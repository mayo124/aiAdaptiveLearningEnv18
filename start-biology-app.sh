#!/bin/bash

echo "🧬 Biology Learning RAG - Web Application"
echo "========================================"
echo ""

# Check if we're in the biology-ui directory
if [ ! -f "biology-ui/package.json" ]; then
    echo "❌ Error: Please run this script from the biologyVectorDatabase directory"
    echo "Expected structure: biologyVectorDatabase/biology-ui/"
    exit 1
fi

# Check if Python RAG script exists
if [ ! -f "biology_rag_fast.py" ]; then
    echo "❌ Error: biology_rag_fast.py not found"
    echo "Make sure you're in the correct directory with the RAG script"
    exit 1
fi

# Check if Ollama is running
echo "🔍 Checking Ollama status..."
if ! curl -s http://localhost:11434/api/tags > /dev/null; then
    echo "⚠️  Ollama is not running. Please start it first:"
    echo "   ollama serve"
    echo ""
    echo "Also make sure you have the llama3.2:1b model:"
    echo "   ollama pull llama3.2:1b"
    exit 1
fi

echo "✅ Ollama is running"

# Check if ChromaDB exists
if [ ! -f "chroma.sqlite3" ]; then
    echo "❌ Error: Vector database not found (chroma.sqlite3)"
    echo "Please build the vector database first"
    exit 1
fi

echo "✅ Vector database found"

# Install dependencies if needed
cd biology-ui
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo ""
echo "🚀 Starting Biology Learning RAG Web Application..."
echo ""
echo "🔗 Frontend will be available at: http://localhost:5173"
echo "📡 Backend API will be available at: http://localhost:3001"
echo ""
echo "📝 Features:"
echo "   • Interactive biology topic exploration"
echo "   • AI-generated introductions"
echo "   • Learning pathway recommendations"
echo "   • MCQ questions for testing"
echo "   • Beautiful responsive UI"
echo ""
echo "⏰ Starting servers..."
echo ""

# Start both servers
npm start
