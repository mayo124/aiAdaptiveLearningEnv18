#!/bin/bash

echo "🧬 Starting Biology RAG System in Docker..."

# Start Ollama in background
echo "🚀 Starting Ollama server..."
ollama serve &
OLLAMA_PID=$!

# Wait for Ollama to be ready
echo "⏳ Waiting for Ollama to be ready..."
while ! curl -s http://localhost:11434/api/tags > /dev/null; do
    sleep 2
done

# Pull the model if not exists
echo "📥 Ensuring llama3.2:1b model is available..."
ollama pull llama3.2:1b

echo "✅ Ollama is ready with llama3.2:1b model"

# Start the Node.js server
echo "🌐 Starting Biology RAG API server..."
cd /app/biology-ui
node server.js &
SERVER_PID=$!

# Serve static files on port 8080
echo "🎨 Starting static file server on port 8080..."
npx http-server dist -p 8080 -c-1 --cors &
STATIC_PID=$!

echo "🎉 Biology RAG System is running!"
echo "📱 Frontend: http://localhost:8080"
echo "🔗 API: http://localhost:3001"

# Function to handle shutdown
cleanup() {
    echo "🛑 Shutting down services..."
    kill $OLLAMA_PID $SERVER_PID $STATIC_PID 2>/dev/null
    exit 0
}

# Handle shutdown signals
trap cleanup SIGTERM SIGINT

# Wait for all background processes
wait
