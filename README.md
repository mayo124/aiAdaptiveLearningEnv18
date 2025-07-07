# 🧬 Biology Vector Database

An intelligent biology learning system that uses vector databases and AI to help students learn biology concepts effectively. This project combines a powerful RAG (Retrieval-Augmented Generation) system with an intuitive web interface.

## ✨ Features

- 🔍 **Vector Database**: Uses Pinecone cloud vector database for efficient similarity search
- 🤖 **AI-Powered**: Integrates with Groq API for fast, intelligent responses
- 📚 **Educational Content**: Generates comprehensive biology explanations with learning pathways
- 🎯 **Interactive MCQs**: Creates multiple-choice questions to test understanding
- 🌐 **Modern UI**: React interface with ShadCN components and Tailwind CSS
- ⚡ **Fast Performance**: Cloud-based architecture for scalable responses
- 🌍 **Multi-language Support**: Built-in language switching capabilities

## Database Details
- **Source**: Biology 2e textbook (Biology2e-WEB_ICOFkGu.txt)
- **Total Chunks**: 5,675 text segments
- **Embedding Model**: all-MiniLM-L6-v2 (Sentence Transformers)
- **Database**: ChromaDB (persistent storage)
- **Collection Name**: biology_textbook

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- Python 3.8+
- Pinecone API key
- Groq API key

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd biologyVectorDatabase

# Copy environment variables
cp .env.example .env
# Edit .env and add your API keys
```

### 2. Install Dependencies

```bash
# Python dependencies
pip install -r requirements.txt

# Node.js dependencies
cd biology-ui
npm install
```

### 3. Set Environment Variables

Edit `.env` file:
```bash
PINECONE_API_KEY=your_pinecone_api_key_here
GROQ_API_KEY=your_groq_api_key_here
```

### 4. Run the Application

```bash
# From biology-ui directory
npm run start
```

This will start:
- Backend API server on `http://localhost:3001`
- Frontend React app on `http://localhost:8081`

## How to Use

### 🤖 RAG System (Recommended)
The RAG system combines vector search with AI-powered responses using Ollama Llama 3.2 1B:

```bash
# Quick start (includes Ollama check)
python3 start_rag.py

# Single question
python3 biology_rag.py "What is photosynthesis and how does it work?"

# Interactive mode
python3 biology_rag.py
```

### 📊 Basic Vector Search
For simple similarity search without AI generation:

```bash
python3 query_biology_db.py "What is photosynthesis?"
```

### Example Questions for RAG
```bash
python3 biology_rag.py "How does DNA replication work?"
python3 biology_rag.py "What is the difference between mitosis and meiosis?"
python3 biology_rag.py "Explain cellular respiration step by step"
python3 biology_rag.py "What are the main types of cells?"
python3 biology_rag.py "How do enzymes catalyze reactions?"
```

### Advanced Usage
You can modify the `query_biology_db.py` script to:
- Change the number of results returned (default: 5)
- Customize output formatting
- Add filtering by content type or chapter
- Integrate with other applications

## Database Features
- **Semantic Search**: Find content based on meaning, not just keywords
- **Contextual Chunks**: Text is split into ~800 character chunks with 100 character overlap
- **Metadata**: Each chunk includes information about:
  - Chapter number (when identifiable)
  - Section number and title
  - Content type (content, key_terms, summary, review, introduction)
  - Word and character counts

## Dependencies

### For Vector Search Only
- `chromadb` - Vector database
- `sentence-transformers` - Text embedding model
- `torch` - PyTorch (for sentence transformers)

### For RAG System (Additional)
- `requests` - HTTP client for Ollama API
- **Ollama** - Local LLM server with Llama 3.2 1B model

Install Python packages:
```bash
pip3 install chromadb sentence-transformers requests
```

Install Ollama and model:
```bash
# Install Ollama (macOS)
brew install ollama

# Or download from https://ollama.ai

# Pull the Llama 3.2 1B model
ollama pull llama3.2:1b

# Start Ollama server
ollama serve
```

## Technical Details
- **Embedding Dimensions**: 384 (all-MiniLM-L6-v2)
- **Similarity Metric**: Cosine similarity
- **Storage**: ~35MB for the complete database
- **Query Speed**: Sub-second response times

## Integration Ideas
This vector database can be integrated with:
- **RAG Systems** ✅ (Already implemented with Ollama!)
- Chatbots and Q&A systems
- Study tools and flashcard generators
- Content recommendation systems
- Research and citation tools
- Educational platforms and LMS
- Voice-based biology tutors
- Mobile learning applications

## License
The original Biology 2e textbook is licensed under Creative Commons Attribution 4.0 International License (CC BY 4.0) by OpenStax.
