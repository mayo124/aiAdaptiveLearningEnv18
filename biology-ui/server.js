import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import url from 'url';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '.env') });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3001;

// Create basic HTTP server
const server = http.createServer((req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Content-Type', 'application/json');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    const parsedUrl = url.parse(req.url, true);
    
    if (req.method === 'GET' && parsedUrl.pathname === '/api/health') {
        res.writeHead(200);
        res.end(JSON.stringify({ 
            status: 'OK', 
            service: 'Biology Learning RAG API',
            timestamp: new Date().toISOString() 
        }));
        return;
    }
    
    if (req.method === 'POST' && parsedUrl.pathname === '/api/biology/learn') {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                handleBiologyRequest(data, res);
            } catch (error) {
                res.writeHead(400);
                res.end(JSON.stringify({
                    success: false,
                    error: 'Invalid JSON'
                }));
            }
        });
        return;
    }
    
    if (req.method === 'POST' && parsedUrl.pathname === '/api/biology/word-explanation') {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                handleWordExplanationRequest(data, res);
            } catch (error) {
                res.writeHead(400);
                res.end(JSON.stringify({
                    success: false,
                    error: 'Invalid JSON'
                }));
            }
        });
        return;
    }
    
    // 404 for all other routes
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
});

function handleBiologyRequest(data, res) {
    const { topic } = data;
    
    if (!topic) {
        res.writeHead(400);
        res.end(JSON.stringify({ 
            success: false, 
            error: 'Topic is required' 
        }));
        return;
    }

    const startTime = Date.now();
    
    // Path to the RAG script - use demo version as fallback
    let pythonScript;
    let useDemo = false;
    
    if (process.env.PINECONE_API_KEY && process.env.PINECONE_API_KEY !== 'your_pinecone_api_key_here') {
        pythonScript = path.join(__dirname, '..', 'biology_rag_pinecone.py');
    } else {
        pythonScript = path.join(__dirname, '..', 'biology_rag_demo.py');
        useDemo = true;
        console.log('📝 Using demo mode - set PINECONE_API_KEY for full functionality');
    }
    
    // Spawn Python process with environment variables
    const pythonProcess = spawn('python3', [pythonScript, topic], {
        env: {
            ...process.env,
            PINECONE_API_KEY: process.env.PINECONE_API_KEY,
            GROQ_API_KEY: process.env.GROQ_API_KEY
        }
    });
    
    let output = '';
    let error = '';
    
    pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
        error += data.toString();
    });
    
    let responseSent = false;
    
    pythonProcess.on('close', (code) => {
        if (responseSent) return;
        responseSent = true;
        
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        if (code === 0) {
            // Parse the output to extract different sections
            const lines = output.split('\n');
            let introduction = '';
            let learningPathways = [];
            let mcqQuestion = '';
            let sources = [];
            
            let currentSection = '';
            let inIntroduction = false;
            let inPathways = false;
            let inMcq = false;
            let inSources = false;
            
            // Parse the full Groq response directly
            const fullResponse = output.split('🤖 Answer:')[1] || output;
            
            // Use regex to extract sections from the Groq response
            const introMatch = fullResponse.match(/\*\*INTRODUCTION\*\*([\s\S]*?)(?=\*\*LEARNING PATHWAYS\*\*|\*\*MCQ QUESTION\*\*|$)/i);
            const pathwaysMatch = fullResponse.match(/\*\*LEARNING PATHWAYS\*\*([\s\S]*?)(?=\*\*MCQ QUESTION\*\*|📚 Sources:|$)/i);
            const mcqMatch = fullResponse.match(/\*\*MCQ QUESTION\*\*([\s\S]*?)(?=📚 Sources:|⏱️|$)/i);
            
            // Extract introduction
            if (introMatch) {
                introduction = introMatch[1].trim();
            }
            
            // Extract learning pathways
            if (pathwaysMatch) {
                const pathwaysText = pathwaysMatch[1].trim();
                const pathwayLines = pathwaysText.split('\n').filter(line => line.trim());
                
                for (const line of pathwayLines) {
                    if (line.match(/^\s*\d+\./)) {
                        learningPathways.push(line.trim());
                    }
                }
            }
            
            // Extract MCQ question
            if (mcqMatch) {
                mcqQuestion = mcqMatch[1].trim();
            }
            
            // Extract sources from the original format
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                if (line.includes('📚 Sources:')) {
                    inSources = true;
                    continue;
                } else if (line.includes('⏱️  Response time:')) {
                    break;
                }
                
                if (inSources && line.trim() && line.match(/^\s*\d+\./)) {
                    sources.push(line.trim());
                }
            }
            
            res.writeHead(200);
            res.end(JSON.stringify({
                success: true,
                topic,
                introduction: introduction.trim(),
                learningPathways,
                mcqQuestion: mcqQuestion.trim(),
                sources,
                responseTime,
                timestamp: new Date().toISOString()
            }));
        } else {
            res.writeHead(500);
            res.end(JSON.stringify({
                success: false,
                error: error || 'Failed to generate biology content',
                responseTime,
                timestamp: new Date().toISOString()
            }));
        }
    });
    
    // Handle timeout (60 seconds)
    const timeoutId = setTimeout(() => {
        if (!responseSent) {
            responseSent = true;
            pythonProcess.kill();
            res.writeHead(408);
            res.end(JSON.stringify({
                success: false,
                error: 'Request timeout',
                responseTime: Date.now() - startTime,
                timestamp: new Date().toISOString()
            }));
        }
    }, 60000);
    
    // Clear timeout when process completes
    pythonProcess.on('close', () => {
        clearTimeout(timeoutId);
    });
}

function handleWordExplanationRequest(data, res) {
    const { word, context } = data;
    
    if (!word) {
        res.writeHead(400);
        res.end(JSON.stringify({ 
            success: false, 
            error: 'Word is required' 
        }));
        return;
    }

    const startTime = Date.now();
    
    // Path to the Python RAG script with word explanation
    const pythonScript = path.join(__dirname, '..', 'word_explanation.py');
    
    // Check if environment variables are set
    if (!process.env.GROQ_API_KEY) {
        res.writeHead(500);
        res.end(JSON.stringify({
            success: false,
            error: 'GROQ_API_KEY environment variable not set',
            timestamp: new Date().toISOString()
        }));
        return;
    }
    
    // Spawn Python process with word explanation
    const pythonProcess = spawn('python3', [pythonScript, word, context || 'biology'], {
        env: {
            ...process.env,
            GROQ_API_KEY: process.env.GROQ_API_KEY
        }
    });
    
    let output = '';
    let error = '';
    
    pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
        error += data.toString();
    });
    
    let responseSent = false;
    
    pythonProcess.on('close', (code) => {
        if (responseSent) return;
        responseSent = true;
        
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        if (code === 0) {
            res.writeHead(200);
            res.end(JSON.stringify({
                success: true,
                word,
                explanation: output.trim(),
                responseTime,
                timestamp: new Date().toISOString()
            }));
        } else {
            res.writeHead(500);
            res.end(JSON.stringify({
                success: false,
                error: error || 'Failed to generate word explanation',
                responseTime,
                timestamp: new Date().toISOString()
            }));
        }
    });
    
    // Handle timeout (10 seconds for word explanations)
    const timeoutId = setTimeout(() => {
        if (!responseSent) {
            responseSent = true;
            pythonProcess.kill();
            res.writeHead(408);
            res.end(JSON.stringify({
                success: false,
                error: 'Request timeout',
                responseTime: Date.now() - startTime,
                timestamp: new Date().toISOString()
            }));
        }
    }, 10000);
    
    // Clear timeout when process completes
    pythonProcess.on('close', () => {
        clearTimeout(timeoutId);
    });
}

server.listen(PORT, () => {
    console.log(`🧬 Biology Learning RAG API running on http://localhost:${PORT}`);
    console.log(`📡 API endpoint: http://localhost:${PORT}/api/biology/learn`);
    console.log(`📖 Word explanation endpoint: http://localhost:${PORT}/api/biology/word-explanation`);
});
