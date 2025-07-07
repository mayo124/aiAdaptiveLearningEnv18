#!/usr/bin/env python3
"""
Quick start script for Biology RAG System
"""
import subprocess
import sys
import time
import requests

def check_ollama():
    """Check if Ollama is running"""
    try:
        response = requests.get("http://localhost:11434/api/tags", timeout=5)
        return response.status_code == 200
    except:
        return False

def start_ollama():
    """Start Ollama if it's not running"""
    print("🚀 Starting Ollama...")
    try:
        subprocess.Popen(["ollama", "serve"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        time.sleep(3)  # Give it a moment to start
        return check_ollama()
    except:
        return False

def main():
    print("🎓 Biology RAG System Startup")
    print("=" * 40)
    
    # Check if Ollama is running
    if not check_ollama():
        print("⚠️  Ollama is not running. Attempting to start...")
        if not start_ollama():
            print("❌ Failed to start Ollama. Please run 'ollama serve' manually.")
            sys.exit(1)
        print("✅ Ollama started successfully!")
    else:
        print("✅ Ollama is already running!")
    
    # Check if llama3.2:1b is available
    try:
        response = requests.get("http://localhost:11434/api/tags")
        models = response.json().get('models', [])
        model_names = [m['name'] for m in models]
        
        if 'llama3.2:1b' in model_names:
            print("✅ Llama 3.2 1B model is available!")
        else:
            print("⚠️  Llama 3.2 1B model not found. Available models:", model_names)
            print("💡 Run: ollama pull llama3.2:1b")
    except:
        print("⚠️  Could not check available models")
    
    print("\n🎯 RAG System is ready!")
    print("\n📖 Usage examples:")
    print("  python3 biology_rag.py 'What is DNA?'")
    print("  python3 biology_rag.py  # Interactive mode")
    print("\n🔗 Starting interactive session...")
    print("=" * 40)
    
    # Start the RAG system in interactive mode
    from biology_rag import BiologyRAG
    rag = BiologyRAG()
    rag.interactive_mode()

if __name__ == "__main__":
    main()
