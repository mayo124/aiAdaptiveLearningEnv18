# 🚀 Complete Migration Guide: Local ChromaDB → Cloud Pinecone

This guide will walk you through migrating your biology RAG system from local ChromaDB to cloud-based Pinecone, then testing everything before Vercel deployment.

## 📋 Prerequisites

✅ Existing biology RAG system with ChromaDB  
✅ Python environment with required packages  
✅ Internet connection  

## Step 1: Set Up Pinecone Account 🌲

### 1.1 Create Account
1. Go to [https://app.pinecone.io/](https://app.pinecone.io/)
2. Sign up for a **free account**
3. Verify your email

### 1.2 Get API Key
1. In Pinecone dashboard, go to **"API Keys"**
2. Copy your API key (starts with `pc-` or similar)
3. Save it securely

### 1.3 Set Environment Variable
```bash
# Set the API key
export PINECONE_API_KEY='your-pinecone-api-key-here'

# Verify it's set
echo $PINECONE_API_KEY
```

## Step 2: Install Dependencies 📦

```bash
# Install required packages
pip3 install pinecone-client tqdm

# Verify installation
python3 -c "import pinecone; print('Pinecone installed successfully!')"
```

## Step 3: Migrate Vectors to Pinecone 📤

### 3.1 Run Migration Script
```bash
python3 migrate_to_pinecone.py
```

**Expected Output:**
```
🧬 Biology Vector Database Migration to Pinecone
================================================================
🔗 Connecting to ChromaDB...
🔗 Connecting to Pinecone...
📤 Exporting vectors from ChromaDB...
✅ Found 5675 vectors to migrate
🏗️  Setting up Pinecone index: biology-vectors
🆕 Creating new index 'biology-vectors'...
⏳ Waiting for index to be ready...
✅ Index created and ready!
📤 Uploading vectors to Pinecone...
🔄 Uploading 5675 vectors in batches of 100
Uploading: 100%|██████████| 57/57 [02:15<00:00,  2.38s/it]
✅ All vectors uploaded to Pinecone!
📊 Pinecone index stats: 5675 vectors

🧪 Testing Pinecone query...
✅ Test query successful! Found 3 results
📋 Sample result: Photosynthesis is the process by which plants and other organisms...

🎉 Migration completed successfully!
📊 Migrated 5675 vectors to Pinecone index 'biology-vectors'
✅ SUCCESS: 5675 vectors migrated to 'biology-vectors'
🌐 Your vectors are now available in the cloud!
📁 Configuration saved to pinecone_config.json
```

### 3.2 Verify Migration
```bash
# Check that config file was created
ls -la pinecone_config.json

# View the configuration
cat pinecone_config.json
```

## Step 4: Test Cloud RAG System 🧪

### 4.1 Test Direct Python Script
```bash
# Test single query
python3 biology_rag_pinecone.py "What is photosynthesis?"

# Test interactive mode
python3 biology_rag_pinecone.py
```

**Expected Output:**
```
🔗 Connecting to Pinecone cloud database...
🤖 Loading embedding model...
✅ Cloud RAG system initialized!
🎓 Biology Learning RAG (Cloud Version)
❓ Topic: What is photosynthesis?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🤖 Answer:
**INTRODUCTION**
Photosynthesis is a fundamental biological process...

**LEARNING PATHWAYS**
1. Cellular Respiration: Understanding how plants...
2. Light-Dependent Reactions: Exploring the...
3. Carbon Fixation: Investigating how carbon...

**MCQ QUESTION**
Question: Which of the following is the primary...

📚 Sources:
  1. Score: 0.856 | Photosynthesis is the process by which plants and other autotrophic organisms...
  2. Score: 0.834 | The light-dependent reactions of photosynthesis occur in the thylakoid...
  3. Score: 0.812 | Carbon dioxide enters the plant through stomata and is used in the...

⏱️  Response time: 3247ms (3.2s)
🌐 Database: pinecone-cloud
```

### 4.2 Run Comprehensive Test
```bash
python3 test_cloud_system.py
```

**Expected Output:**
```
🧬 Biology RAG Cloud System - Comprehensive Test
============================================================
✅ Environment variables checked

🧪 Testing Pinecone Connection...
🔗 Connecting to Pinecone cloud database...
🤖 Loading embedding model...
✅ Cloud RAG system initialized!
✅ Pinecone connected successfully!
📊 Total vectors: 5675
🏷️  Index name: biology-vectors

🚀 Testing Query Performance...
🔗 Connecting to Pinecone cloud database...
🤖 Loading embedding model...
✅ Cloud RAG system initialized!

📝 Testing: What is photosynthesis?
✅ Success! (3.24s)
📄 Answer preview: **INTRODUCTION** Photosynthesis is a fundamental biological process that serves as the foundation for life on Earth...
📚 Sources found: 3

📝 Testing: How does DNA replication work?
✅ Success! (2.87s)
📄 Answer preview: **INTRODUCTION** DNA replication is a crucial cellular process that ensures genetic information is accurately...
📚 Sources found: 3

📝 Testing: What is cellular respiration?
✅ Success! (3.12s)
📄 Answer preview: **INTRODUCTION** Cellular respiration is a vital metabolic process that occurs in all living organisms...
📚 Sources found: 3

📊 Performance Summary:
✅ Successful queries: 3/3
⏱️  Average response time: 3.08s

🌐 Testing API Server...
⚠️  API server not running. Start with:
   cd biology-ui && node server_pinecone.js

============================================================
🎯 Test Results: 2/2 passed
🎉 ALL TESTS PASSED!
✅ Your cloud RAG system is ready for deployment!

🚀 Next steps:
1. Deploy to Vercel using the Pinecone backend
2. Set PINECONE_API_KEY in Vercel environment variables
3. Your biology RAG will be accessible worldwide!
```

## Step 5: Test API Server (Optional) 🌐

### 5.1 Start Cloud API Server
```bash
# Terminal 1: Start the API server
cd biology-ui
PINECONE_API_KEY='your-key' node server_pinecone.js
```

**Expected Output:**
```
🧬 Biology Learning RAG API (Cloud Version) running on http://localhost:3001
📡 API endpoint: http://localhost:3001/api/biology/learn
🌐 Database: Pinecone Cloud Vector Database
✅ PINECONE_API_KEY configured
⚠️  INFO: Using default GROQ_API_KEY
```

### 5.2 Test API Endpoints
```bash
# Terminal 2: Test the API
# Health check
curl http://localhost:3001/api/health

# Biology query
curl -X POST http://localhost:3001/api/biology/learn \
  -H "Content-Type: application/json" \
  -d '{"topic": "What is mitosis?"}'
```

### 5.3 Run Full API Test
```bash
# Run the complete test (with API server running)
python3 test_cloud_system.py
```

## Step 6: Clean Up Local Files (Optional) 🧹

Once you've verified everything works with Pinecone:

```bash
# Backup local ChromaDB (just in case)
mkdir backup_chromadb
cp -r chroma.sqlite3 780cc6b5-* 7fa06425-* backup_chromadb/

# Optional: Remove large local files to save space
# (Only do this after confirming Pinecone works!)
# rm chroma.sqlite3
# rm -rf 780cc6b5-* 7fa06425-*
```

## 🎯 Success Criteria

You should have achieved:

✅ **Migration Complete**: All vectors uploaded to Pinecone cloud  
✅ **Cloud Queries Working**: Python script connects and returns answers  
✅ **Performance Good**: Average response time under 5 seconds  
✅ **API Server Functional**: Node.js server connects to Pinecone  
✅ **Configuration Saved**: `pinecone_config.json` created  

## 🚨 Troubleshooting

### Problem: "API key invalid"
```bash
# Check your API key
echo $PINECONE_API_KEY
# Make sure it starts with 'pc-' or similar
```

### Problem: "Index not found"
```bash
# Check Pinecone dashboard
# Verify index name is 'biology-vectors'
```

### Problem: "Embedding model download fails"
```bash
# Check internet connection
# Model downloads automatically on first run
# May take 5-10 minutes for first download
```

### Problem: "Slow query performance"
```bash
# This is normal for first queries
# Subsequent queries will be faster
# Pinecone has cold start delays
```

## 🎉 You're Ready!

Once all tests pass, your system is ready for Vercel deployment! Your vectors are now in the cloud and accessible from anywhere with just your Pinecone API key.

**Next**: Move to Step 3 - Vercel Deployment 🚀
