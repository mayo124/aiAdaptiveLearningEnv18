# 🌲 Pinecone Setup Guide

## Step 1: Create Pinecone Account

1. Go to [https://app.pinecone.io/](https://app.pinecone.io/)
2. Sign up for a free account
3. Verify your email

## Step 2: Get API Key

1. Once logged in, go to "API Keys" in the sidebar
2. Copy your API key (starts with `pc-` or similar)
3. Set it as an environment variable:

```bash
export PINECONE_API_KEY='your-api-key-here'
```

Or create a `.env` file:
```bash
echo "PINECONE_API_KEY=your-api-key-here" > .env
```

## Step 3: Test Migration

Run the migration script:

```bash
python3 migrate_to_pinecone.py
```

This will:
- ✅ Export all vectors from ChromaDB
- ✅ Create a new Pinecone index called "biology-vectors"
- ✅ Upload all vectors with metadata
- ✅ Test the connection

## Step 4: Test Cloud RAG System

Test the new cloud-based system:

```bash
# Test a biology question
python3 biology_rag_pinecone.py "What is photosynthesis?"

# Interactive mode
python3 biology_rag_pinecone.py
```

## Step 5: Verify Success

You should see:
- ✅ Connection to Pinecone cloud database
- ✅ Fast query responses
- ✅ Same quality answers as local version
- ✅ "Database: pinecone-cloud" in output

## Pinecone Free Tier Limits

- **5,000 vectors** (should be enough for your biology data)
- **1 index**
- **1GB storage**
- **100GB bandwidth/month**

Your biology dataset should fit well within these limits!

## Troubleshooting

### Error: "Index not found"
```bash
# Check your index name in Pinecone dashboard
# Make sure it matches "biology-vectors"
```

### Error: "API key invalid"
```bash
# Verify your API key
echo $PINECONE_API_KEY
```

### Error: "Embedding model download"
```bash
# The model will download automatically on first run
# Make sure you have internet connection
```

## Next Steps

Once migration is successful, you can:
1. ✅ Delete local ChromaDB files (save space)
2. ✅ Deploy to Vercel (vectors are now in cloud)
3. ✅ Access from anywhere with just API keys
