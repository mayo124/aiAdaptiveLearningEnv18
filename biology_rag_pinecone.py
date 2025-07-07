#!/usr/bin/env python3
"""
Biology RAG System - PINECONE CLOUD VERSION
Using Pinecone cloud vector database + Groq API for fast, scalable responses
"""
import os
import sys
import json
import requests
from pinecone import Pinecone
from sentence_transformers import SentenceTransformer
from typing import List, Dict, Any
import time

class BiologyRAGPinecone:
    def __init__(self, 
                 pinecone_api_key=None,
                 groq_api_key=None,
                 index_name="biology-vectors",
                 model="llama3-70b-8192"):
        """Initialize the cloud-based RAG system"""
        
        # API keys
        self.pinecone_api_key = pinecone_api_key or os.getenv('PINECONE_API_KEY')
        self.groq_api_key = groq_api_key or os.getenv('GROQ_API_KEY')
        self.index_name = index_name
        self.model = model
        self.groq_url = "https://api.groq.com/openai/v1/chat/completions"
        
        if not self.pinecone_api_key:
            raise ValueError("Pinecone API key required. Set PINECONE_API_KEY environment variable.")
        
        if not self.groq_api_key:
            raise ValueError("Groq API key required. Set GROQ_API_KEY environment variable.")
        
        # Initialize Pinecone
        print("🔗 Connecting to Pinecone cloud database...")
        self.pc = Pinecone(api_key=self.pinecone_api_key)
        self.index = self.pc.Index(self.index_name)
        
        # Initialize embedding model (same as used in ChromaDB)
        print("🤖 Loading embedding model...")
        self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        
        print("✅ Cloud RAG system initialized!")
    
    def get_query_embedding(self, query: str) -> List[float]:
        """Generate embedding for the query"""
        embedding = self.embedding_model.encode(query)
        return embedding.tolist()
    
    def retrieve_context(self, query: str, n_results: int = 3) -> List[Dict]:
        """Retrieve relevant context from Pinecone cloud database"""
        
        # Generate query embedding
        query_embedding = self.get_query_embedding(query)
        
        # Query Pinecone
        results = self.index.query(
            vector=query_embedding,
            top_k=n_results,
            include_metadata=True
        )
        
        # Format results to match ChromaDB structure
        context_chunks = []
        for match in results['matches']:
            chunk = {
                'text': match['metadata']['text'],
                'metadata': {
                    'chapter': match['metadata'].get('chapter', 'unknown'),
                    'section': match['metadata'].get('section', 'unknown'),
                    'content_type': match['metadata'].get('content_type', 'content'),
                    'word_count': match['metadata'].get('word_count', 0),
                    'char_count': match['metadata'].get('char_count', 0)
                },
                'relevance_score': match['score']
            }
            context_chunks.append(chunk)
        
        return context_chunks
    
    def format_context(self, context_chunks: List[Dict]) -> str:
        """Format the retrieved context for the LLM prompt"""
        formatted_context = ""
        
        for i, chunk in enumerate(context_chunks, 1):
            # Balance between speed and quality
            text = chunk['text'][:600] + "..." if len(chunk['text']) > 600 else chunk['text']
            formatted_context += f"[Source {i}]\\n{text}\\n\\n"
        
        return formatted_context.strip()
    
    def generate_response(self, query: str, context: str) -> str:
        """Generate response using Groq API"""
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
    
    def ask_cloud(self, query: str) -> Dict[str, Any]:
        """Main method to ask a question using cloud vector database"""
        start_time = time.time()
        
        # Retrieve relevant context from Pinecone
        context_chunks = self.retrieve_context(query, 3)
        
        if not context_chunks:
            return {
                'query': query,
                'answer': 'No relevant context found.',
                'sources': [],
                'response_time': (time.time() - start_time) * 1000
            }
        
        # Format context for the LLM
        formatted_context = self.format_context(context_chunks)
        
        # Generate response
        answer = self.generate_response(query, formatted_context)
        
        # Prepare sources information
        sources = []
        for i, chunk in enumerate(context_chunks, 1):
            source_info = f"{i}. Score: {chunk['relevance_score']:.3f} | {chunk['text'][:100]}..."
            sources.append(source_info)
        
        response_time = (time.time() - start_time) * 1000
        
        return {
            'query': query,
            'answer': answer,
            'sources': sources,
            'response_time': response_time,
            'database': 'pinecone-cloud'
        }
    
    def health_check(self) -> Dict[str, Any]:
        """Check system health"""
        try:
            # Test Pinecone connection
            stats = self.index.describe_index_stats()
            
            # Test a simple query
            test_embedding = self.get_query_embedding("test")
            test_results = self.index.query(
                vector=test_embedding,
                top_k=1,
                include_metadata=True
            )
            
            return {
                'status': 'healthy',
                'pinecone_connected': True,
                'total_vectors': stats.get('total_vector_count', 0),
                'embedding_model': 'all-MiniLM-L6-v2',
                'index_name': self.index_name
            }
            
        except Exception as e:
            return {
                'status': 'error',
                'error': str(e),
                'pinecone_connected': False
            }


def main():
    # Check for required API keys
    if not os.getenv('PINECONE_API_KEY'):
        print("❌ Error: PINECONE_API_KEY environment variable not set")
        print("📋 Please set your Pinecone API key:")
        print("   export PINECONE_API_KEY='your-api-key-here'")
        return
    
    if len(sys.argv) > 1:
        # Command line mode
        query = ' '.join(sys.argv[1:])
        
        try:
            rag = BiologyRAGPinecone()
            
            print(f"🎓 Biology Learning RAG (Cloud Version)")
            print(f"❓ Topic: {query}")
            print("━" * 50)
            
            result = rag.ask_cloud(query)
            
            print(f"\\n🤖 Answer:")
            print(result['answer'])
            
            print(f"\\n📚 Sources:")
            for source in result['sources']:
                print(f"  {source}")
            
            print(f"\\n⏱️  Response time: {result['response_time']:.0f}ms ({result['response_time']/1000:.1f}s)")
            print(f"🌐 Database: {result['database']}")
            
        except Exception as e:
            print(f"❌ Error: {e}")
            
    elif not sys.stdin.isatty():
        # Input from pipe/stdin
        query = sys.stdin.read().strip()
        if query:
            try:
                rag = BiologyRAGPinecone()
                
                print(f"🎓 Biology Learning RAG (Cloud Version)")
                print(f"❓ Topic: {query}")
                print("━" * 50)
                
                result = rag.ask_cloud(query)
                
                print(f"\\n🤖 Answer:")
                print(result['answer'])
                
                print(f"\\n📚 Sources:")
                for source in result['sources']:
                    print(f"  {source}")
                
                print(f"\\n⏱️  Response time: {result['response_time']:.0f}ms ({result['response_time']/1000:.1f}s)")
                print(f"🌐 Database: {result['database']}")
                
            except Exception as e:
                print(f"❌ Error: {e}")
        else:
            print("No input provided.")
    else:
        # Interactive mode
        try:
            rag = BiologyRAGPinecone()
            print("\\n🎓 Biology Learning RAG - Cloud Interactive Mode")
            print("Connected to Pinecone cloud vector database!")
            print("Type 'quit', 'exit', or 'q' to stop.\\n")
            
            while True:
                try:
                    query = input("🌱 Biology topic to explore: ").strip()
                    
                    if query.lower() in ['quit', 'exit', 'q', '']:
                        print("👋 Goodbye!")
                        break
                    
                    result = rag.ask_cloud(query)
                    
                    print(f"\\n🤖 Answer:")
                    print(result['answer'])
                    
                    print(f"\\n📚 Sources:")
                    for source in result['sources']:
                        print(f"  {source}")
                    
                    print(f"\\n⏱️  Response time: {result['response_time']:.0f}ms ({result['response_time']/1000:.1f}s)")
                    print("\\n" + "="*60)
                    
                except KeyboardInterrupt:
                    print("\\n👋 Goodbye!")
                    break
                except EOFError:
                    print("\\n👋 Goodbye!")
                    break
                except Exception as e:
                    print(f"❌ Error: {e}")
                    break
                    
        except Exception as e:
            print(f"❌ Failed to initialize: {e}")


if __name__ == "__main__":
    main()
