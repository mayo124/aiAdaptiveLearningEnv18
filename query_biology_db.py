#!/usr/bin/env python3
"""
Query the Biology Vector Database
Usage: python3 query_biology_db.py "your question here"
"""
import sys
import os
import chromadb
from sentence_transformers import SentenceTransformer


def query_database(query_text, n_results=5):
    """Query the biology vector database"""
    # Initialize ChromaDB client
    db_path = "/Users/mihirdhankani/biologyVectorDatabase"
    client = chromadb.PersistentClient(path=db_path)
    
    # Get the collection
    collection = client.get_collection("biology_textbook")
    
    # Query the database
    results = collection.query(
        query_texts=[query_text],
        n_results=n_results
    )
    
    return results


def format_results(results, query_text):
    """Format and display query results"""
    print(f"🔍 Query: '{query_text}'")
    print(f"📊 Found {len(results['documents'][0])} relevant chunks\n")
    
    documents = results['documents'][0]
    metadatas = results['metadatas'][0]
    distances = results['distances'][0]
    
    for i, (doc, metadata, distance) in enumerate(zip(documents, metadatas, distances)):
        print(f"📄 Result {i+1} (Relevance Score: {1-distance:.3f})")
        print(f"📋 Content Type: {metadata.get('content_type', 'N/A')}")
        
        if 'chapter' in metadata:
            print(f"📖 Chapter: {metadata['chapter']}")
        if 'section' in metadata:
            print(f"📑 Section: {metadata['section']}")
        if 'section_title' in metadata:
            print(f"🏷️  Section Title: {metadata['section_title']}")
        
        print(f"📝 Text: {doc[:300]}...")
        print("-" * 80)


def main():
    if len(sys.argv) < 2:
        print("Usage: python3 query_biology_db.py 'your question here'")
        print("\nExample queries:")
        print("  python3 query_biology_db.py 'What is photosynthesis?'")
        print("  python3 query_biology_db.py 'How does DNA replication work?'")
        print("  python3 query_biology_db.py 'What are the types of cells?'")
        return
    
    query_text = ' '.join(sys.argv[1:])
    
    try:
        print("🔎 Searching biology database...")
        results = query_database(query_text)
        format_results(results, query_text)
        
    except Exception as e:
        print(f"❌ Error querying database: {e}")
        return


if __name__ == "__main__":
    main()
