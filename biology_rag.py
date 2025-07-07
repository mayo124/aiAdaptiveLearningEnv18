#!/usr/bin/env python3
"""
Biology RAG System - Retrieval Augmented Generation
Connects the biology vector database with Ollama Llama 3.2 1B for intelligent Q&A
"""
import sys
import json
import requests
import chromadb
from typing import List, Dict


class BiologyRAG:
    def __init__(self, db_path="/Users/mihirdhankani/biologyVectorDatabase", 
                 ollama_url="http://localhost:11434", model="llama3.2:1b"):
        """Initialize the RAG system"""
        self.db_path = db_path
        self.ollama_url = ollama_url
        self.model = model
        
        # Initialize ChromaDB
        print("🔗 Connecting to vector database...")
        self.client = chromadb.PersistentClient(path=db_path)
        self.collection = self.client.get_collection("biology_textbook")
        print("✅ Vector database connected")
        
        # Test Ollama connection
        print("🤖 Testing Ollama connection...")
        self._test_ollama_connection()
        print("✅ Ollama connected")
    
    def _test_ollama_connection(self):
        """Test connection to Ollama"""
        try:
            response = requests.get(f"{self.ollama_url}/api/tags")
            if response.status_code == 200:
                models = response.json().get('models', [])
                model_names = [m['name'] for m in models]
                if self.model not in model_names:
                    print(f"⚠️  Warning: Model {self.model} not found in Ollama")
                    print(f"Available models: {model_names}")
            else:
                raise Exception(f"Ollama API returned status {response.status_code}")
        except Exception as e:
            print(f"❌ Error connecting to Ollama: {e}")
            print("Make sure Ollama is running with: ollama serve")
            sys.exit(1)
    
    def retrieve_context(self, query: str, n_results: int = 5) -> List[Dict]:
        """Retrieve relevant context from the vector database"""
        print(f"🔍 Searching for relevant content...")
        
        results = self.collection.query(
            query_texts=[query],
            n_results=n_results
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
        
        print(f"📊 Found {len(context_chunks)} relevant chunks")
        return context_chunks
    
    def format_context(self, context_chunks: List[Dict]) -> str:
        """Format the retrieved context for the LLM prompt"""
        formatted_context = ""
        
        for i, chunk in enumerate(context_chunks, 1):
            metadata = chunk['metadata']
            
            # Add metadata information
            context_info = f"[Source {i}"
            if 'chapter' in metadata:
                context_info += f" - Chapter {metadata['chapter']}"
            if 'section' in metadata:
                context_info += f" - Section {metadata['section']}"
            context_info += "]"
            
            formatted_context += f"{context_info}\n{chunk['text']}\n\n"
        
        return formatted_context.strip()
    
    def generate_response(self, query: str, context: str) -> str:
        """Generate response using Ollama"""
        print("🤖 Generating response with Ollama...")
        
        prompt = f"""You are a biology tutor helping students understand concepts from their textbook. Use the provided context from the Biology 2e textbook to answer the student's question accurately and comprehensively.

Context from Biology Textbook:
{context}

Student Question: {query}

Instructions:
- Base your answer primarily on the provided context
- If the context doesn't fully answer the question, mention what information is available
- Use clear, educational language appropriate for biology students
- Include specific details and examples from the textbook when relevant
- If you reference information from the context, you can mention the chapter/section
- Keep your response focused and well-organized

Answer:"""

        try:
            response = requests.post(
                f"{self.ollama_url}/api/generate",
                json={
                    "model": self.model,
                    "prompt": prompt,
                    "stream": False,
                    "options": {
                        "temperature": 0.3,  # Lower temperature for more factual responses
                        "top_p": 0.9,
                        "top_k": 40
                    }
                },
                timeout=120  # 2 minute timeout
            )
            
            if response.status_code == 200:
                result = response.json()
                return result.get('response', 'No response generated')
            else:
                return f"Error: Ollama API returned status {response.status_code}"
                
        except requests.exceptions.Timeout:
            return "Error: Request timed out. The model might be taking too long to respond."
        except Exception as e:
            return f"Error generating response: {e}"
    
    def ask(self, query: str, n_context_chunks: int = 4) -> Dict:
        """Main method to ask a question and get a RAG response"""
        print(f"\n🎓 Biology RAG System")
        print(f"📝 Question: {query}")
        print("-" * 60)
        
        # Retrieve relevant context
        context_chunks = self.retrieve_context(query, n_context_chunks)
        
        if not context_chunks:
            return {
                'query': query,
                'answer': 'No relevant context found in the biology textbook.',
                'sources': []
            }
        
        # Format context for the LLM
        formatted_context = self.format_context(context_chunks)
        
        # Generate response
        answer = self.generate_response(query, formatted_context)
        
        # Prepare sources information
        sources = []
        for chunk in context_chunks:
            source_info = {
                'relevance_score': chunk['relevance_score'],
                'text_preview': chunk['text'][:150] + "..." if len(chunk['text']) > 150 else chunk['text']
            }
            if 'chapter' in chunk['metadata']:
                source_info['chapter'] = chunk['metadata']['chapter']
            if 'section' in chunk['metadata']:
                source_info['section'] = chunk['metadata']['section']
            sources.append(source_info)
        
        return {
            'query': query,
            'answer': answer,
            'sources': sources
        }
    
    def interactive_mode(self):
        """Start interactive Q&A session"""
        print("\n🎓 Biology RAG System - Interactive Mode")
        print("Ask questions about biology and get answers from the textbook!")
        print("Type 'quit', 'exit', or 'q' to stop.\n")
        
        while True:
            try:
                query = input("🤔 Your question: ").strip()
                
                if query.lower() in ['quit', 'exit', 'q', '']:
                    print("👋 Goodbye!")
                    break
                
                result = self.ask(query)
                
                print(f"\n🤖 Answer:")
                print(result['answer'])
                
                print(f"\n📚 Sources (Top {len(result['sources'])}):")
                for i, source in enumerate(result['sources'], 1):
                    print(f"  {i}. Score: {source['relevance_score']:.3f}")
                    if 'chapter' in source:
                        print(f"     Chapter: {source['chapter']}")
                    if 'section' in source:
                        print(f"     Section: {source['section']}")
                    print(f"     Preview: {source['text_preview']}")
                
                print("\n" + "="*80)
                
            except KeyboardInterrupt:
                print("\n👋 Goodbye!")
                break
            except EOFError:
                print("\n👋 Goodbye!")
                break
            except Exception as e:
                print(f"❌ Error: {e}")
                break


def main():
    if len(sys.argv) > 1:
        # Command line mode
        query = ' '.join(sys.argv[1:])
        rag = BiologyRAG()
        result = rag.ask(query)
        
        print(f"\n🤖 Answer:")
        print(result['answer'])
        
        print(f"\n📚 Sources:")
        for i, source in enumerate(result['sources'], 1):
            print(f"  {i}. Relevance: {source['relevance_score']:.3f}")
            if 'chapter' in source:
                print(f"     Chapter: {source['chapter']}")
            print(f"     Preview: {source['text_preview']}")
    elif not sys.stdin.isatty():
        # Input from pipe/stdin
        query = sys.stdin.read().strip()
        if query:
            rag = BiologyRAG()
            result = rag.ask(query)
            
            print(f"\n🤖 Answer:")
            print(result['answer'])
            
            print(f"\n📚 Sources:")
            for i, source in enumerate(result['sources'], 1):
                print(f"  {i}. Relevance: {source['relevance_score']:.3f}")
                if 'chapter' in source:
                    print(f"     Chapter: {source['chapter']}")
                print(f"     Preview: {source['text_preview']}")
        else:
            print("No input provided.")
    else:
        # Interactive mode
        rag = BiologyRAG()
        rag.interactive_mode()


if __name__ == "__main__":
    main()
