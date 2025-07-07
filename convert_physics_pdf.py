#!/usr/bin/env python3
"""
Physics PDF to Vector Database Converter
Converts College Physics PDF to ChromaDB embeddings
"""

import os
import sys
import re
import time
import chromadb
import PyPDF2
from typing import List, Dict
from sentence_transformers import SentenceTransformer

class PhysicsPDFProcessor:
    def __init__(self, db_path=".", collection_name="physics_textbook"):
        """Initialize the PDF processor"""
        self.db_path = db_path
        self.collection_name = collection_name
        
        # Initialize ChromaDB
        print("🔧 Initializing ChromaDB...")
        self.client = chromadb.PersistentClient(path=db_path)
        
        # Create or get collection
        try:
            self.collection = self.client.get_collection(collection_name)
            print(f"📚 Using existing collection '{collection_name}' with {self.collection.count()} documents")
        except:
            print(f"📚 Creating new collection '{collection_name}'")
            self.collection = self.client.create_collection(
                name=collection_name,
                metadata={"description": "College Physics textbook content"}
            )
        
        # Initialize embedding model
        print("🧠 Loading embedding model...")
        self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        print("✅ Setup complete!")
    
    def extract_text_from_pdf(self, pdf_path: str) -> List[Dict]:
        """Extract text from PDF with page information"""
        print(f"📖 Extracting text from: {pdf_path}")
        
        chunks = []
        
        try:
            with open(pdf_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                total_pages = len(pdf_reader.pages)
                print(f"📄 Processing {total_pages} pages...")
                
                for page_num, page in enumerate(pdf_reader.pages, 1):
                    if page_num % 50 == 0:
                        print(f"  📃 Processed {page_num}/{total_pages} pages...")
                    
                    try:
                        text = page.extract_text()
                        
                        if text.strip():
                            # Clean the text
                            cleaned_text = self.clean_text(text)
                            
                            if len(cleaned_text.split()) > 10:  # Only keep substantial content
                                chunks.append({
                                    'text': cleaned_text,
                                    'page': page_num,
                                    'source': 'College_Physics_2e',
                                    'chunk_id': f"physics_page_{page_num}"
                                })
                    
                    except Exception as e:
                        print(f"⚠️  Error processing page {page_num}: {e}")
                        continue
                
                print(f"✅ Extracted {len(chunks)} text chunks from {total_pages} pages")
                return chunks
                
        except Exception as e:
            print(f"❌ Error reading PDF: {e}")
            return []
    
    def clean_text(self, text: str) -> str:
        """Clean and normalize text"""
        # Remove excessive whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Remove special characters that might interfere
        text = re.sub(r'[^\w\s\.,;:!?\-\(\)\[\]\/\+=<>%°′″∝≈≠≤≥∞∫∂∇×·]', '', text)
        
        # Remove very short lines that might be artifacts
        lines = text.split('\n')
        meaningful_lines = []
        for line in lines:
            if len(line.strip()) > 5:  # Keep lines with substantial content
                meaningful_lines.append(line.strip())
        
        return ' '.join(meaningful_lines).strip()
    
    def create_semantic_chunks(self, chunks: List[Dict], chunk_size: int = 500) -> List[Dict]:
        """Create semantic chunks of appropriate size"""
        print(f"🔪 Creating semantic chunks (target size: {chunk_size} words)...")
        
        semantic_chunks = []
        chunk_id = 1
        
        for page_chunk in chunks:
            text = page_chunk['text']
            words = text.split()
            
            # Split long texts into smaller semantic chunks
            if len(words) > chunk_size:
                # Split by sentences first, then by chunk size
                sentences = re.split(r'[.!?]+', text)
                
                current_chunk = ""
                current_words = 0
                
                for sentence in sentences:
                    sentence = sentence.strip()
                    if not sentence:
                        continue
                    
                    sentence_words = len(sentence.split())
                    
                    # If adding this sentence would exceed chunk size, save current chunk
                    if current_words + sentence_words > chunk_size and current_chunk:
                        semantic_chunks.append({
                            'text': current_chunk.strip(),
                            'page': page_chunk['page'],
                            'source': page_chunk['source'],
                            'chunk_id': f"physics_chunk_{chunk_id}",
                            'words': current_words
                        })
                        chunk_id += 1
                        current_chunk = sentence + ". "
                        current_words = sentence_words
                    else:
                        current_chunk += sentence + ". "
                        current_words += sentence_words
                
                # Add the remaining chunk
                if current_chunk.strip():
                    semantic_chunks.append({
                        'text': current_chunk.strip(),
                        'page': page_chunk['page'],
                        'source': page_chunk['source'],
                        'chunk_id': f"physics_chunk_{chunk_id}",
                        'words': current_words
                    })
                    chunk_id += 1
            else:
                # Keep smaller chunks as-is
                semantic_chunks.append({
                    'text': text,
                    'page': page_chunk['page'],
                    'source': page_chunk['source'],
                    'chunk_id': f"physics_chunk_{chunk_id}",
                    'words': len(words)
                })
                chunk_id += 1
        
        print(f"✅ Created {len(semantic_chunks)} semantic chunks")
        return semantic_chunks
    
    def add_to_database(self, chunks: List[Dict], batch_size: int = 100):
        """Add chunks to ChromaDB"""
        print(f"💾 Adding {len(chunks)} chunks to database...")
        
        total_chunks = len(chunks)
        processed = 0
        
        # Process in batches
        for i in range(0, total_chunks, batch_size):
            batch = chunks[i:i + batch_size]
            
            # Prepare batch data
            ids = [chunk['chunk_id'] for chunk in batch]
            texts = [chunk['text'] for chunk in batch]
            metadatas = [{
                'page': chunk['page'],
                'source': chunk['source'],
                'words': chunk['words'],
                'type': 'physics_textbook'
            } for chunk in batch]
            
            try:
                # Generate embeddings
                print(f"  🧠 Generating embeddings for batch {i//batch_size + 1}/{(total_chunks-1)//batch_size + 1}...")
                embeddings = self.embedding_model.encode(texts).tolist()
                
                # Add to database
                self.collection.add(
                    ids=ids,
                    documents=texts,
                    metadatas=metadatas,
                    embeddings=embeddings
                )
                
                processed += len(batch)
                print(f"  ✅ Processed {processed}/{total_chunks} chunks")
                
            except Exception as e:
                print(f"  ❌ Error processing batch {i//batch_size + 1}: {e}")
                continue
        
        print(f"🎉 Successfully added {processed} chunks to the database!")
        print(f"📊 Total documents in collection: {self.collection.count()}")
    
    def process_pdf(self, pdf_path: str):
        """Main method to process the entire PDF"""
        start_time = time.time()
        
        print(f"🚀 Starting PDF processing: {pdf_path}")
        print("=" * 60)
        
        # Step 1: Extract text from PDF
        raw_chunks = self.extract_text_from_pdf(pdf_path)
        if not raw_chunks:
            print("❌ No text extracted from PDF. Exiting.")
            return
        
        # Step 2: Create semantic chunks
        semantic_chunks = self.create_semantic_chunks(raw_chunks)
        
        # Step 3: Add to database
        self.add_to_database(semantic_chunks)
        
        # Summary
        end_time = time.time()
        duration = end_time - start_time
        
        print("=" * 60)
        print("🎊 PROCESSING COMPLETE!")
        print(f"⏱️  Total time: {duration:.1f} seconds ({duration/60:.1f} minutes)")
        print(f"📚 Final database size: {self.collection.count()} documents")
        print(f"🔍 Collection name: {self.collection_name}")


def main():
    if len(sys.argv) != 2:
        print("Usage: python3 convert_physics_pdf.py <path_to_pdf>")
        print("Example: python3 convert_physics_pdf.py /Users/mihirdhankani/Downloads/College_Physics_2e-WEB_7Zesafu.pdf")
        sys.exit(1)
    
    pdf_path = sys.argv[1]
    
    # Check if PDF exists
    if not os.path.exists(pdf_path):
        print(f"❌ PDF file not found: {pdf_path}")
        sys.exit(1)
    
    # Create processor and process PDF
    processor = PhysicsPDFProcessor()
    processor.process_pdf(pdf_path)


if __name__ == "__main__":
    main()
