export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  
  const { topic } = req.body;
  
  if (!topic) {
    res.status(400).json({ 
      success: false, 
      error: 'Topic is required' 
    });
    return;
  }

  const startTime = Date.now();
  
  try {
    // Use Groq API directly instead of Python subprocess
    const groqResponse = await generateBiologyContent(topic);
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    res.status(200).json({
      success: true,
      topic,
      introduction: groqResponse.introduction,
      learningPathways: groqResponse.learningPathways,
      mcqQuestion: groqResponse.mcqQuestion,
      sources: groqResponse.sources,
      responseTime,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error generating biology content:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate biology content',
      responseTime: Date.now() - startTime,
      timestamp: new Date().toISOString()
    });
  }
}

async function generateBiologyContent(topic) {
  const groqApiKey = process.env.GROQ_API_KEY;
  
  if (!groqApiKey) {
    // Return demo content if no API key
    return generateDemoContent(topic);
  }
  
  const prompt = `You are an expert biology educator creating comprehensive learning content.

For the topic "${topic}", provide a structured response with these exact sections:

**INTRODUCTION**
[Provide a comprehensive 200-300 word introduction explaining the topic, its importance, key concepts, and real-world applications in biology]

**LEARNING PATHWAYS**
[List 5-7 related topics that students should explore to deepen their understanding, formatted as numbered items:]
1. [First related topic]
2. [Second related topic]
3. [Third related topic]
4. [Fourth related topic]
5. [Fifth related topic]

**MCQ QUESTION**
[Create a thoughtful multiple-choice question about this topic with 4 options (A, B, C, D) and indicate the correct answer. Format as:
Question: [Your question here]
A) [Option A]
B) [Option B] 
C) [Option C]
D) [Option D]
Correct Answer: [Letter]]

Focus on accuracy, educational value, and clear explanations that help students understand complex biological concepts.`;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${groqApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama3-8b-8192',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    }),
  });

  if (!response.ok) {
    throw new Error(`Groq API error: ${response.status}`);
  }

  const data = await response.json();
  const fullResponse = data.choices[0]?.message?.content || '';
  
  // Parse the response
  const introMatch = fullResponse.match(/\*\*INTRODUCTION\*\*([\s\S]*?)(?=\*\*LEARNING PATHWAYS\*\*|\*\*MCQ QUESTION\*\*|$)/i);
  const pathwaysMatch = fullResponse.match(/\*\*LEARNING PATHWAYS\*\*([\s\S]*?)(?=\*\*MCQ QUESTION\*\*|$)/i);
  const mcqMatch = fullResponse.match(/\*\*MCQ QUESTION\*\*([\s\S]*?)$/i);
  
  // Extract introduction
  let introduction = '';
  if (introMatch) {
    introduction = introMatch[1].trim();
  }
  
  // Extract learning pathways
  let learningPathways = [];
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
  let mcqQuestion = '';
  if (mcqMatch) {
    mcqQuestion = mcqMatch[1].trim();
  }
  
  // Generate basic sources
  const sources = [
    `1. Generated content for "${topic}" using AI educational model`,
    `2. Biology educational content - ${new Date().toLocaleDateString()}`,
    `3. Interactive learning pathway for ${topic}`
  ];
  
  return {
    introduction,
    learningPathways,
    mcqQuestion,
    sources
  };
}

function generateDemoContent(topic) {
  return {
    introduction: `This is demo content for "${topic}". 

In this educational overview, we explore the fundamental concepts and principles related to ${topic}. This topic plays a crucial role in understanding biological processes and systems.

Key areas of focus include:
- Basic definitions and terminology
- Core mechanisms and processes
- Biological significance and applications
- Connections to other biological concepts

Understanding ${topic} provides students with essential knowledge that serves as a foundation for more advanced biological studies. This topic demonstrates the interconnected nature of biological systems and helps students appreciate the complexity and elegance of life processes.

The study of ${topic} reveals important patterns and relationships that exist throughout the biological world, making it an essential component of any comprehensive biology education.`,
    
    learningPathways: [
      `1. Cellular Structure and Function related to ${topic}`,
      `2. Molecular Biology aspects of ${topic}`,
      `3. Physiological processes involving ${topic}`,
      `4. Evolutionary perspectives on ${topic}`,
      `5. Ecological implications of ${topic}`,
      `6. Laboratory techniques for studying ${topic}`,
      `7. Current research and applications in ${topic}`
    ],
    
    mcqQuestion: `Question: Which of the following best describes a key characteristic of ${topic}?
A) It only occurs in prokaryotic organisms
B) It is fundamental to many biological processes
C) It was discovered in the last decade
D) It has no practical applications

Correct Answer: B`,
    
    sources: [
      `1. Demo content for "${topic}" - Educational simulation`,
      `2. Biology learning system - Demo mode`,
      `3. Generated educational content - ${new Date().toLocaleDateString()}`
    ]
  };
}
