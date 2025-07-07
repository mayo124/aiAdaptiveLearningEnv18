# 🚀 Biology RAG System - Cloud Deployment Guide

This guide provides multiple options to deploy your Biology RAG system to the cloud, making it accessible from anywhere without local setup.

## 📋 Prerequisites

- Git repository (GitHub recommended)
- Docker installed locally (for testing)
- Account on your chosen cloud platform

## 🐳 Docker Setup (Local Testing)

First, test the containerized version locally:

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or build and run manually
docker build -t biology-rag .
docker run -p 8080:8080 -p 3001:3001 biology-rag
```

Access your app at:
- Frontend: http://localhost:8080
- API: http://localhost:3001

## ☁️ Cloud Deployment Options

### 1. 🚂 Railway (Recommended - Easiest)

**Cost**: ~$5-10/month for hobby projects
**Setup Time**: 5 minutes

1. Push your code to GitHub
2. Go to [Railway](https://railway.app)
3. Connect your GitHub repository
4. Railway will auto-detect the `railway.toml` and deploy
5. Your app will be live at `https://your-app.railway.app`

**Pros**: 
- Automatic HTTPS
- Easy scaling
- GitHub integration
- Good free tier

### 2. 🎨 Render

**Cost**: Free tier available, paid plans from $7/month
**Setup Time**: 10 minutes

1. Push code to GitHub
2. Go to [Render](https://render.com)
3. Create new Web Service from GitHub repo
4. Render uses the `render.yaml` configuration
5. Deploy automatically

**Pros**:
- Generous free tier
- Automatic SSL
- Easy database integration

### 3. 🌊 DigitalOcean App Platform

**Cost**: $5-12/month
**Setup Time**: 15 minutes

1. Push code to GitHub
2. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
3. Create app from GitHub repository
4. Uses `.do/app.yaml` configuration
5. Deploy with one click

**Pros**:
- Predictable pricing
- Good performance
- Integrated monitoring

### 4. ☁️ AWS/Google Cloud (Advanced)

For production workloads requiring high performance:

**AWS Options**:
- ECS Fargate (containerized)
- EC2 with Docker
- Elastic Beanstalk

**Google Cloud Options**:
- Cloud Run (serverless containers)
- Compute Engine
- App Engine

## 🔧 Configuration Notes

### Environment Variables

The following environment variables are configured across all platforms:

- `NODE_ENV=production`
- `PORT=3001` (API server)
- `FRONTEND_PORT=8080` (Frontend)

### Resource Requirements

**Minimum**:
- RAM: 2GB
- CPU: 1 vCPU
- Storage: 5GB

**Recommended**:
- RAM: 4GB
- CPU: 2 vCPU
- Storage: 10GB

### Database Persistence

Your vector database (ChromaDB) is included in the container. For production:

1. Consider using external vector databases (Pinecone, Weaviate)
2. Mount persistent volumes for data
3. Regular database backups

## 🔒 Security Considerations

1. **API Rate Limiting**: Add rate limiting to prevent abuse
2. **Authentication**: Consider adding user authentication
3. **CORS**: Configure appropriate CORS settings
4. **HTTPS**: All platforms provide automatic HTTPS
5. **Environment Secrets**: Store sensitive data as environment variables

## 📊 Monitoring & Scaling

### Health Checks
All configurations include health checks at `/api/health`

### Scaling Options
- **Horizontal**: Increase instance count
- **Vertical**: Upgrade instance size
- **Auto-scaling**: Configure based on CPU/memory usage

### Monitoring
- Application logs
- Response times
- Error rates
- Resource usage

## 🚀 Quick Start Commands

```bash
# 1. Prepare for deployment
git add .
git commit -m "Add deployment configurations"
git push origin main

# 2. Test locally first
docker-compose up --build

# 3. Deploy to Railway (easiest)
# - Go to railway.app
# - Connect GitHub repo
# - Deploy automatically

# 4. Custom domain (optional)
# Configure in your platform's dashboard
```

## 🐛 Troubleshooting

### Common Issues

1. **Ollama Model Download Fails**
   - Increase deployment timeout
   - Use smaller model (llama3.2:1b is recommended)

2. **Memory Issues**
   - Upgrade to higher tier
   - Optimize model size

3. **Slow Response Times**
   - Check vector database performance
   - Consider caching frequently asked questions

### Debug Commands

```bash
# Check container logs
docker logs <container-id>

# Test API directly
curl https://your-app.com/api/health

# Test local build
docker build -t biology-rag . && docker run -p 8080:8080 -p 3001:3001 biology-rag
```

## 💰 Cost Comparison

| Platform | Free Tier | Paid Plans | Best For |
|----------|-----------|------------|----------|
| Railway | 500h/month | $5-20/month | Quick prototypes |
| Render | 750h/month | $7-25/month | Personal projects |
| DigitalOcean | $100 credit | $5-20/month | Production apps |
| AWS/GCP | Credits | Variable | Enterprise |

## 🎯 Recommended Deployment Path

1. **Development**: Test locally with `docker-compose`
2. **Staging**: Deploy to Railway free tier
3. **Production**: Upgrade to paid Railway or migrate to DigitalOcean

## 🔄 CI/CD Pipeline

For automated deployments, consider:

1. GitHub Actions for testing
2. Automatic deployment on push to main
3. Environment-specific configurations
4. Database migrations

## 📞 Support

For deployment issues:
1. Check platform documentation
2. Review application logs
3. Test Docker build locally
4. Verify all required files are committed

Your Biology RAG system will be accessible globally once deployed! 🌍
