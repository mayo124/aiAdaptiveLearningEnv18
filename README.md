# Biology Vector Database

This directory contains a vector database created from the Biology 2e textbook, enabling semantic search across the entire textbook content.

## Database Details
- **Source**: Biology 2e textbook (Biology2e-WEB_ICOFkGu.txt)
- **Total Chunks**: 5,675 text segments
- **Embedding Model**: all-MiniLM-L6-v2 (Sentence Transformers)
- **Database**: ChromaDB (persistent storage)
- **Collection Name**: biology_textbook

## Files in this Directory
- `chroma.sqlite3` - Main ChromaDB database file
- `780cc6b5-...` - ChromaDB internal directory
- `database_info.txt` - Database metadata and creation details
- `query_biology_db.py` - Python script for simple vector search
- `biology_rag.py` - **RAG System** - AI-powered Q&A with Ollama integration
- `start_rag.py` - Quick startup script for the RAG system
- `README.md` - This documentation file

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
