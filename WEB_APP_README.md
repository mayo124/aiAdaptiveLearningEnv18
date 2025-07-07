# 🧬 Biology Learning RAG - Web Application

A beautiful, modern web interface for the Biology Learning RAG system that provides interactive biology education with AI-powered content generation.

## ✨ Features

### 🎓 **Interactive Learning Experience**
- **Topic Exploration**: Search any biology topic or choose from popular examples
- **AI-Generated Introductions**: Comprehensive 200-250 word introductions to any topic
- **Learning Pathways**: 3 personalized recommendations for next topics to study
- **MCQ Questions**: Auto-generated multiple choice questions to test understanding
- **Source Attribution**: View relevant sections from the biology textbook

### 🎨 **Beautiful Modern UI**
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Elegant Styling**: Cream and navy color scheme with smooth animations
- **Real-time Feedback**: Loading states, error handling, and response time display
- **Intuitive Navigation**: Easy switching between search and learning views

### ⚡ **Performance Optimized**
- **Fast Responses**: Optimized for ~5-20 second response times
- **Concurrent Processing**: Backend handles multiple requests efficiently
- **Smart Caching**: Reduces redundant computations

## 🚀 Quick Start

### Prerequisites
1. **Ollama**: Running with `llama3.2:1b` model
2. **Python 3**: With required packages (ChromaDB, SentenceTransformers, requests)
3. **Node.js**: v14 or higher
4. **Vector Database**: Built biology textbook database

### One-Command Startup
```bash
./start-biology-app.sh
```

This script will:
- ✅ Check all prerequisites
- 📦 Install dependencies if needed
- 🚀 Start both frontend and backend servers
- 🔗 Open the application at http://localhost:5173

### Manual Startup
```bash
# Terminal 1 - Start the backend API
cd biology-ui
npm run server

# Terminal 2 - Start the frontend
cd biology-ui
npm run dev
```

## 🌐 Application URLs

- **Frontend (React)**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

## 📱 How to Use

### 1. **Explore Topics**
- Type any biology topic in the search bar
- Or click on popular topic cards (DNA, Photosynthesis, etc.)

### 2. **Learn Interactively**
- Read the AI-generated introduction
- Explore the 3 suggested learning pathways
- Test your knowledge with the MCQ question
- Check sources from the biology textbook

### 3. **Navigate Seamlessly**
- Use the "Back to Topics" button to explore more subjects
- Response times are displayed for each query
- Error messages guide you if something goes wrong

## 🏗 Architecture

### Frontend (React + TypeScript)
```
biology-ui/src/
├── pages/Index.tsx          # Main application page
├── components/              # Reusable UI components
└── contexts/               # Language and state management
```

### Backend (Node.js + Express)
```
biology-ui/server.js         # API server
```

### RAG System (Python)
```
biology_rag_fast.py         # Optimized RAG system
chroma.sqlite3              # Vector database
```

### Data Flow
1. **User Input** → React frontend
2. **API Request** → Express.js backend
3. **Python Execution** → Biology RAG script
4. **AI Processing** → Ollama LLM + ChromaDB
5. **Structured Response** → Back through the chain
6. **Beautiful Display** → React UI components

## 🔧 Configuration

### Backend API Endpoints

#### POST /api/biology/learn
Generate learning content for a biology topic.

**Request:**
```json
{
  "topic": "DNA structure"
}
```

**Response:**
```json
{
  "success": true,
  "topic": "DNA structure",
  "introduction": "DNA (Deoxyribonucleic acid) is...",
  "learningPathways": [
    "1. Molecular Biology: Study the chemical composition...",
    "2. Genetics: Explore how DNA carries genetic information...", 
    "3. Biotechnology: Learn about DNA manipulation techniques..."
  ],
  "mcqQuestion": "Question: What is the structure of DNA?\nA) Single helix...",
  "sources": ["1. Relevance: 0.245 | Preview text..."],
  "responseTime": 15230,
  "timestamp": "2024-12-06T22:30:15.123Z"
}
```

#### GET /api/health
Check API server status.

### Frontend Configuration

The React app automatically connects to the backend API and provides:
- **Loading states** during content generation
- **Error handling** for connection issues
- **Responsive design** for all screen sizes
- **Theme support** with language switching

## 📊 Example Topics

The application comes with popular biology topics:

- **DNA Structure** - Learn about the double helix and genetic code
- **Photosynthesis** - Understand how plants convert light into energy
- **Cell Division** - Explore mitosis and meiosis processes
- **Enzymes** - Discover how biological catalysts work
- **Evolution** - Study natural selection and adaptation
- **Ecosystems** - Learn about ecological relationships

## 🛠 Development

### Project Structure
```
biologyVectorDatabase/
├── biology-ui/                    # React web application
│   ├── src/                      # Frontend source code
│   ├── server.js                 # Backend API server
│   └── package.json              # Dependencies and scripts
├── biology_rag_fast.py           # Optimized RAG system
├── chroma.sqlite3                # Vector database
├── start-biology-app.sh          # One-command startup
└── WEB_APP_README.md             # This file
```

### Available Scripts

```bash
# In biology-ui directory:
npm run dev          # Start frontend only
npm run server       # Start backend only  
npm start           # Start both (recommended)
npm run build       # Build for production
npm run lint        # Check code quality
```

### Dependencies

**Frontend:**
- React 18 + TypeScript
- Tailwind CSS + shadcn/ui components
- Lucide React icons
- React Router for navigation

**Backend:**
- Express.js for API server
- CORS for cross-origin requests
- Child process for Python integration

## 🎯 Performance Tips

1. **Keep Ollama Running**: Start `ollama serve` before using the app
2. **Monitor Response Times**: Displayed for each query (target: <20s)
3. **Check Network**: Ensure stable connection between components
4. **Use Examples**: Popular topics load faster due to relevance

## 🚨 Troubleshooting

### Common Issues

**"Failed to connect to server"**
- Ensure the backend is running on port 3001
- Check that Ollama is accessible at localhost:11434

**"Biology content generation failed"**
- Verify the Python RAG script is executable
- Check that the vector database exists
- Ensure all Python dependencies are installed

**Slow responses (>30 seconds)**
- Ollama model might be loading for the first time
- Try simpler, more focused questions
- Check system resources (CPU/RAM usage)

**UI not loading**
- Verify frontend is running on port 5173
- Check browser console for JavaScript errors
- Try refreshing or clearing browser cache

### Debug Steps

1. **Check API Health**: Visit http://localhost:3001/api/health
2. **Test Python Script**: Run `python3 biology_rag_fast.py "DNA"` manually
3. **Verify Ollama**: Run `ollama list` to see available models
4. **Check Logs**: Look at terminal output for error messages

## 🌟 Advanced Features

### Custom Topics
The system can handle any biology topic, not just the examples. Try:
- Specific processes: "Krebs cycle", "protein synthesis"
- Organisms: "E. coli metabolism", "plant transpiration"  
- Systems: "nervous system", "immune response"

### Educational Flow
Each topic provides a complete learning experience:
1. **Introduction** - Core concepts and overview
2. **Learning Pathways** - Next topics to explore
3. **Assessment** - MCQ to test understanding
4. **Sources** - Attribution to textbook sections

### Integration Possibilities
- Export learning content to PDF
- Bookmark favorite topics
- Progress tracking across sessions
- Integration with learning management systems

---

**Ready to explore biology with AI! 🧬✨**

## 📞 Support

If you encounter issues:
1. Check this README for common solutions
2. Verify all prerequisites are met
3. Look at terminal logs for error details
4. Try the manual startup process step-by-step
