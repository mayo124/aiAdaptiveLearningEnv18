#!/bin/bash

echo "🚀 Biology RAG System - Cloud Deployment Script"
echo "=============================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📂 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit: Biology RAG System ready for deployment"
else
    echo "✅ Git repository found"
fi

# Check for GitHub repository
echo ""
echo "🔗 GitHub Repository Setup"
echo "=========================="
echo "To deploy to cloud platforms, you need to push this to GitHub:"
echo ""
echo "1. Create a new repository on GitHub"
echo "2. Add the remote origin:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/biologyVectorDatabase.git"
echo "3. Push your code:"
echo "   git push -u origin main"
echo ""

# Platform options
echo "☁️  Deployment Platform Options"
echo "==============================="
echo ""
echo "1. 🚂 RAILWAY (Easiest - Recommended)"
echo "   • Go to: https://railway.app"
echo "   • Connect your GitHub repository"
echo "   • Railway auto-detects the configuration"
echo "   • Deploy with one click!"
echo "   • Cost: ~$5-10/month"
echo ""
echo "2. 🎨 RENDER" 
echo "   • Go to: https://render.com"
echo "   • Create Web Service from GitHub"
echo "   • Free tier available"
echo "   • Cost: Free tier, then $7+/month"
echo ""
echo "3. 🌊 DIGITALOCEAN"
echo "   • Go to: https://cloud.digitalocean.com/apps"
echo "   • Create app from GitHub repository"
echo "   • Uses included .do/app.yaml config"
echo "   • Cost: $5-12/month"
echo ""

# File checklist
echo "📋 Deployment Files Checklist"
echo "=============================="

files=(
    "Dockerfile"
    "docker-entrypoint.sh" 
    "requirements.txt"
    "docker-compose.yml"
    "railway.toml"
    "render.yaml"
    ".do/app.yaml"
    "DEPLOYMENT.md"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file (missing)"
    fi
done

echo ""
echo "🎯 Quick Start Steps:"
echo "===================="
echo "1. Push this repository to GitHub"
echo "2. Choose a platform (Railway recommended)"
echo "3. Connect your GitHub repository"
echo "4. Deploy automatically!"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT.md"
echo ""
echo "🌍 Your Biology RAG system will be accessible worldwide once deployed!"

# Check if changes need to be committed
if [[ -n $(git status --porcelain) ]]; then
    echo ""
    echo "⚠️  You have uncommitted changes. Run these commands:"
    echo "   git add ."
    echo "   git commit -m 'Add deployment configurations'"
    echo "   git push origin main"
fi

echo ""
echo "✨ Ready for deployment! Choose your platform and deploy! ✨"
