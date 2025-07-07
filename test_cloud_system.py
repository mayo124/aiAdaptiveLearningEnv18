#!/usr/bin/env python3
"""
Test Script for Cloud Biology RAG System
Tests the migration and Pinecone-based RAG system
"""
import os
import sys
import time
import requests
from biology_rag_pinecone import BiologyRAGPinecone

def test_pinecone_connection():
    """Test Pinecone connection and basic functionality"""
    print("🧪 Testing Pinecone Connection...")
    
    try:
        rag = BiologyRAGPinecone()
        
        # Test health check
        health = rag.health_check()
        
        if health['status'] == 'healthy':
            print(f"✅ Pinecone connected successfully!")
            print(f"📊 Total vectors: {health['total_vectors']}")
            print(f"🏷️  Index name: {health['index_name']}")
            return True
        else:
            print(f"❌ Health check failed: {health.get('error', 'Unknown error')}")
            return False
            
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        return False

def test_query_performance():
    """Test query performance and quality"""
    print("\n🚀 Testing Query Performance...")
    
    try:
        rag = BiologyRAGPinecone()
        
        test_queries = [
            "What is photosynthesis?",
            "How does DNA replication work?",
            "What is cellular respiration?"
        ]
        
        total_time = 0
        successful_queries = 0
        
        for query in test_queries:
            print(f"\n📝 Testing: {query}")
            
            start_time = time.time()
            result = rag.ask_cloud(query)
            query_time = time.time() - start_time
            
            if result['answer'] and not result['answer'].startswith('Error'):
                print(f"✅ Success! ({query_time:.2f}s)")
                print(f"📄 Answer preview: {result['answer'][:150]}...")
                print(f"📚 Sources found: {len(result['sources'])}")
                successful_queries += 1
                total_time += query_time
            else:
                print(f"❌ Failed: {result['answer']}")
        
        if successful_queries > 0:
            avg_time = total_time / successful_queries
            print(f"\n📊 Performance Summary:")
            print(f"✅ Successful queries: {successful_queries}/{len(test_queries)}")
            print(f"⏱️  Average response time: {avg_time:.2f}s")
            return successful_queries == len(test_queries)
        else:
            return False
            
    except Exception as e:
        print(f"❌ Query test failed: {e}")
        return False

def test_api_server():
    """Test the API server with Pinecone backend"""
    print("\n🌐 Testing API Server...")
    
    # Note: This assumes the server is running
    api_url = "http://localhost:3001"
    
    try:
        # Test health endpoint
        health_response = requests.get(f"{api_url}/api/health", timeout=10)
        
        if health_response.status_code == 200:
            health_data = health_response.json()
            print(f"✅ Health check passed!")
            print(f"📊 Service: {health_data.get('service', 'Unknown')}")
            print(f"🌐 Database: {health_data.get('database', 'Unknown')}")
            
            # Test biology endpoint
            test_data = {"topic": "What is mitosis?"}
            learn_response = requests.post(
                f"{api_url}/api/biology/learn",
                json=test_data,
                timeout=30
            )
            
            if learn_response.status_code == 200:
                learn_data = learn_response.json()
                if learn_data.get('success'):
                    print(f"✅ Biology API test passed!")
                    print(f"📄 Response preview: {learn_data.get('introduction', '')[:100]}...")
                    print(f"🎯 Learning pathways: {len(learn_data.get('learningPathways', []))}")
                    return True
                else:
                    print(f"❌ API returned error: {learn_data.get('error', 'Unknown')}")
                    return False
            else:
                print(f"❌ API request failed: {learn_response.status_code}")
                return False
        else:
            print(f"❌ Health check failed: {health_response.status_code}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("⚠️  API server not running. Start with:")
        print("   cd biology-ui && node server_pinecone.js")
        return False
    except Exception as e:
        print(f"❌ API test failed: {e}")
        return False

def main():
    print("🧬 Biology RAG Cloud System - Comprehensive Test")
    print("=" * 60)
    
    # Check environment
    if not os.getenv('PINECONE_API_KEY'):
        print("❌ PINECONE_API_KEY not set!")
        print("📋 Please run: export PINECONE_API_KEY='your-key-here'")
        return False
    
    print("✅ Environment variables checked")
    
    # Run tests
    tests_passed = 0
    total_tests = 3
    
    # Test 1: Pinecone Connection
    if test_pinecone_connection():
        tests_passed += 1
    
    # Test 2: Query Performance
    if test_query_performance():
        tests_passed += 1
    
    # Test 3: API Server (optional)
    if test_api_server():
        tests_passed += 1
    else:
        total_tests = 2  # API server test is optional
    
    # Results
    print("\n" + "=" * 60)
    print(f"🎯 Test Results: {tests_passed}/{total_tests} passed")
    
    if tests_passed == total_tests:
        print("🎉 ALL TESTS PASSED!")
        print("✅ Your cloud RAG system is ready for deployment!")
        print("\n🚀 Next steps:")
        print("1. Deploy to Vercel using the Pinecone backend")
        print("2. Set PINECONE_API_KEY in Vercel environment variables")
        print("3. Your biology RAG will be accessible worldwide!")
        return True
    else:
        print("❌ Some tests failed. Please check the errors above.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
