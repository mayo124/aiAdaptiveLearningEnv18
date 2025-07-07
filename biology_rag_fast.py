#!/usr/bin/env python3
"""
Biology RAG System - GROQ POWERED VERSION
Using Groq API with llama3-70b-instruct for fast, high-quality responses
"""
import sys
import json
import requests
import chromadb
import os
from typing import List, Dict


class BiologyLearningRAG:
    def __init__(self, db_path="/Users/mihirdhankani/biologyVectorDatabase", 
                 groq_api_key=os.getenv('GROQ_API_KEY'),
                 model="llama3-70b-8192"):
        """Initialize the FAST RAG system with Groq API"""
        self.db_path = db_path
        self.groq_api_key = groq_api_key
        self.model = model
        self.groq_url = "https://api.groq.com/openai/v1/chat/completions"
        
        # Initialize ChromaDB quietly
        self.client = chromadb.PersistentClient(path=db_path)
        self.collection = self.client.get_collection("biology_textbook")
    
    def retrieve_context(self, query: str, n_results: int = 3) -> List[Dict]:
        """Retrieve relevant context from the vector database (FAST)"""
        results = self.collection.query(
            query_texts=[query],
            n_results=n_results  # Reduced from 4 to 3 for speed
        )
        
        documents = results['documents'][0]
        metadatas = results['metadatas'][0]
        distances = results['distances'][0]
        
        context_chunks = []
        for doc, metadata, distance in zip(documents, metadatas, distances):
            chunk = {
                'text': doc,
                'metadata': metadata,
                'relevance_score': 1 - distance
            }
            context_chunks.append(chunk)
        
        return context_chunks
    
    def format_context(self, context_chunks: List[Dict]) -> str:
        """Format the retrieved context for the LLM prompt (FAST)"""
        # Simplified formatting for speed
        formatted_context = ""
        
        for i, chunk in enumerate(context_chunks, 1):
            # Balance between speed and quality - keep more context
            text = chunk['text'][:600] + "..." if len(chunk['text']) > 600 else chunk['text']
            formatted_context += f"[Source {i}]\\n{text}\\n\\n"
        
        return formatted_context.strip()
    
    def generate_response(self, query: str, context: str) -> str:
        """Generate response using Groq API (FAST)"""
        # Enhanced prompt for introduction + learning pathways
        system_prompt = "You are a biology expert and educational guide. Using the provided textbook context, write comprehensive and educational content for biology students."
        
        user_prompt = f"""Using the following biology textbook context, provide a comprehensive response about: {query}

Context from Biology Textbook:
{context}

Provide a response with THREE sections:

**INTRODUCTION (approximately 200-250 words):**
- Introduce the topic clearly with scientific accuracy
- Explain key concepts using examples from the context
- Make it engaging and educational for biology students

**LEARNING PATHWAYS (3 recommendations):**
Suggest 3 specific next topics or areas the student should explore to deepen their understanding:
1. [Topic]: Brief explanation of why this is valuable to learn next
2. [Topic]: Brief explanation of how this builds on the current topic
3. [Topic]: Brief explanation of real-world applications or advanced concepts

**MCQ QUESTION:**
Create 1 multiple-choice question to test understanding of the topic just explained:
Question: [Clear, specific question about the topic]
A) [Option]
B) [Option]
C) [Option]
D) [Option]
Correct Answer: [Letter] - [Brief explanation why this is correct]"""

        try:
            response = requests.post(
                self.groq_url,
                headers={
                    "Authorization": f"Bearer {self.groq_api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": self.model,
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    "temperature": 0.3,
                    "max_tokens": 1000,
                    "top_p": 0.9
                },
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                return result['choices'][0]['message']['content']
            else:
                return f"Error: Groq API returned status {response.status_code}: {response.text}"
                
        except requests.exceptions.Timeout:
            return "Error: Request timed out."
        except Exception as e:
            return f"Error: {e}"
    
    def ask_fast(self, query: str) -> Dict:
        """Main method to ask a question and get a FAST RAG response"""
        start_time = __import__('time').time()
        
        # Retrieve relevant context (fewer chunks)
        context_chunks = self.retrieve_context(query, 3)
        
        if not context_chunks:
            return {
                'query': query,
                'answer': 'No relevant context found.',
                'sources': [],
                'response_time': (__import__('time').time() - start_time) * 1000
            }
        
        # Format context for the LLM
        formatted_context = self.format_context(context_chunks)
        
        # Generate response
        answer = self.generate_response(query, formatted_context)
        
        # Prepare sources information (simplified)
        sources = []
        for i, chunk in enumerate(context_chunks, 1):
            source_info = f"{i}. Relevance: {chunk['relevance_score']:.3f} | {chunk['text'][:100]}..."
            sources.append(source_info)
        
        response_time = (__import__('time').time() - start_time) * 1000
        
        return {
            'query': query,
            'answer': answer,
            'sources': sources,
            'response_time': response_time
        }


def main():
    if len(sys.argv) > 1:
        # Command line mode
        query = ' '.join(sys.argv[1:])
        rag = BiologyLearningRAG()
        
        print(f"🎓 Biology Learning RAG")
        print(f"❓ Topic: {query}")
        print("━" * 50)
        
        result = rag.ask_fast(query)
        
        print(f"\\n🤖 Answer:")
        print(result['answer'])
        
        print(f"\\n📚 Sources:")
        for source in result['sources']:
            print(f"  {source}")
        
        print(f"\\n⏱️  Response time: {result['response_time']:.0f}ms ({result['response_time']/1000:.1f}s)")
        
    elif not sys.stdin.isatty():
        # Input from pipe/stdin
        query = sys.stdin.read().strip()
        if query:
            rag = BiologyLearningRAG()
            
            print(f"🎓 Biology Learning RAG")
            print(f"❓ Topic: {query}")
            print("━" * 50)
            
            result = rag.ask_fast(query)
            
            print(f"\\n🤖 Answer:")
            print(result['answer'])
            
            print(f"\\n📚 Sources:")
            for source in result['sources']:
                print(f"  {source}")
            
            print(f"\\n⏱️  Response time: {result['response_time']:.0f}ms ({result['response_time']/1000:.1f}s)")
    else:
        print("Biology RAG System - GROQ POWERED")
        print("Usage: python biology_rag_fast.py 'your question here'")
        print("   or: echo 'your question' | python biology_rag_fast.py")


if __name__ == "__main__":
    main()
