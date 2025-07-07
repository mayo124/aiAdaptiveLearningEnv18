#!/usr/bin/env python3
"""
Vector Database Migration Script
Export vectors from ChromaDB and upload to Pinecone
"""
import os
import json
import time
import chromadb
from pinecone import Pinecone, ServerlessSpec
from typing import List, Dict, Any
import numpy as np
from tqdm import tqdm

class VectorMigration:
    def __init__(self, 
                 chroma_path="/Users/mihirdhankani/biologyVectorDatabase",
                 pinecone_api_key=None,
                 pinecone_index_name="biology-vectors"):
        """Initialize migration tools"""
        self.chroma_path = chroma_path
        self.pinecone_api_key = pinecone_api_key or os.getenv('PINECONE_API_KEY')
        self.index_name = pinecone_index_name
        
        if not self.pinecone_api_key:
            raise ValueError("Pinecone API key required. Set PINECONE_API_KEY environment variable or pass it directly.")
        
        # Initialize ChromaDB
        print("🔗 Connecting to ChromaDB...")
        self.chroma_client = chromadb.PersistentClient(path=self.chroma_path)
        self.chroma_collection = self.chroma_client.get_collection("biology_textbook")
        
        # Initialize Pinecone
        print("🔗 Connecting to Pinecone...")
        self.pc = Pinecone(api_key=self.pinecone_api_key)
        
    def export_vectors_from_chroma(self) -> Dict[str, Any]:
        """Export all vectors and metadata from ChromaDB"""
        print("📤 Exporting vectors from ChromaDB...")
        
        # Get all data from ChromaDB
        results = self.chroma_collection.get(
            include=['embeddings', 'documents', 'metadatas']
        )
        
        print(f"✅ Found {len(results['ids'])} vectors to migrate")
        
        return {
            'ids': results['ids'],
            'embeddings': results['embeddings'],
            'documents': results['documents'],
            'metadatas': results['metadatas']
        }
    
    def create_pinecone_index(self, dimension=384):
        """Create Pinecone index if it doesn't exist"""
        print(f"🏗️  Setting up Pinecone index: {self.index_name}")
        
        # Check if index exists
        existing_indexes = [index.name for index in self.pc.list_indexes()]
        
        if self.index_name in existing_indexes:
            print(f"📋 Index '{self.index_name}' already exists")
            return self.pc.Index(self.index_name)
        
        # Create new index
        print(f"🆕 Creating new index '{self.index_name}'...")
        self.pc.create_index(
            name=self.index_name,
            dimension=dimension,
            metric='cosine',
            spec=ServerlessSpec(
                cloud='aws',
                region='us-east-1'
            )
        )
        
        # Wait for index to be ready
        print("⏳ Waiting for index to be ready...")
        while not self.pc.describe_index(self.index_name).status['ready']:
            time.sleep(1)
        
        print("✅ Index created and ready!")
        return self.pc.Index(self.index_name)
    
    def upload_to_pinecone(self, data: Dict[str, Any], batch_size=100):
        """Upload vectors to Pinecone in batches"""
        print("📤 Uploading vectors to Pinecone...")
        
        index = self.create_pinecone_index()
        
        # Prepare data for Pinecone
        vectors_to_upload = []
        
        for i, (id_, embedding, document, metadata) in enumerate(zip(
            data['ids'], 
            data['embeddings'], 
            data['documents'], 
            data['metadatas']
        )):
            # Prepare metadata for Pinecone (must be JSON serializable)
            pinecone_metadata = {
                'text': document,
                'chapter': str(metadata.get('chapter', 'unknown')),
                'section': str(metadata.get('section', 'unknown')),
                'content_type': str(metadata.get('content_type', 'content')),
                'word_count': int(metadata.get('word_count', 0)),
                'char_count': int(metadata.get('char_count', 0))
            }
            
            vectors_to_upload.append({
                'id': id_,
                'values': embedding,
                'metadata': pinecone_metadata
            })
        
        # Upload in batches
        total_vectors = len(vectors_to_upload)
        print(f"🔄 Uploading {total_vectors} vectors in batches of {batch_size}")
        
        for i in tqdm(range(0, total_vectors, batch_size), desc="Uploading"):
            batch = vectors_to_upload[i:i+batch_size]
            index.upsert(vectors=batch)
            time.sleep(0.1)  # Rate limiting
        
        print("✅ All vectors uploaded to Pinecone!")
        
        # Verify upload
        stats = index.describe_index_stats()
        print(f"📊 Pinecone index stats: {stats['total_vector_count']} vectors")
        
        return index
    
    def migrate(self):
        """Complete migration process"""
        print("🚀 Starting vector database migration...")
        print("=" * 50)
        
        # Step 1: Export from ChromaDB
        data = self.export_vectors_from_chroma()
        
        # Step 2: Upload to Pinecone
        index = self.upload_to_pinecone(data)
        
        # Step 3: Test query
        print("\n🧪 Testing Pinecone query...")
        test_query = "What is photosynthesis?"
        
        # Get a sample embedding from ChromaDB for testing
        test_results = self.chroma_collection.query(
            query_texts=[test_query],
            n_results=1,
            include=['embeddings']
        )
        
        if test_results['embeddings']:
            test_embedding = test_results['embeddings'][0][0]
            
            # Query Pinecone
            pinecone_results = index.query(
                vector=test_embedding,
                top_k=3,
                include_metadata=True
            )
            
            print(f"✅ Test query successful! Found {len(pinecone_results['matches'])} results")
            print(f"📋 Sample result: {pinecone_results['matches'][0]['metadata']['text'][:100]}...")
        
        print("\n🎉 Migration completed successfully!")
        print(f"📊 Migrated {len(data['ids'])} vectors to Pinecone index '{self.index_name}'")
        
        return {
            'success': True,
            'vectors_migrated': len(data['ids']),
            'index_name': self.index_name
        }

def main():
    print("🧬 Biology Vector Database Migration to Pinecone")
    print("=" * 60)
    
    # Check for API key
    api_key = os.getenv('PINECONE_API_KEY')
    if not api_key:
        print("❌ Error: PINECONE_API_KEY environment variable not set")
        print("📋 Please set your Pinecone API key:")
        print("   export PINECONE_API_KEY='your-api-key-here'")
        print("\n🔗 Get your API key from: https://app.pinecone.io/")
        return
    
    try:
        # Initialize migration
        migration = VectorMigration()
        
        # Run migration
        result = migration.migrate()
        
        if result['success']:
            print(f"\n✅ SUCCESS: {result['vectors_migrated']} vectors migrated to '{result['index_name']}'")
            print("🌐 Your vectors are now available in the cloud!")
            
            # Save configuration for the API
            config = {
                'pinecone_index_name': result['index_name'],
                'vector_dimension': 384,
                'migration_date': time.strftime('%Y-%m-%d %H:%M:%S'),
                'total_vectors': result['vectors_migrated']
            }
            
            with open('pinecone_config.json', 'w') as f:
                json.dump(config, f, indent=2)
            
            print("📁 Configuration saved to pinecone_config.json")
        
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        return False

if __name__ == "__main__":
    main()
