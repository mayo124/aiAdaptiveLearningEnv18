# 🚀 Vercel Deployment Guide - Biology Learning RAG

This guide will help you deploy the Biology Learning RAG application to Vercel with full serverless functionality.

## 📋 Prerequisites

- GitHub account
- Vercel account ([vercel.com](https://vercel.com))
- Groq API key (for AI functionality)
- Pinecone API key (optional, for enhanced functionality)

## 🏗️ Project Structure for Vercel

The project has been optimized for Vercel with the following structure:

```
biology-ui/
├── api/                     # Vercel serverless functions
│   ├── health.js           # Health check endpoint
│   └── biology/
│       ├── learn.js        # Main learning endpoint
│       └── word-explanation.js # Word explanation endpoint
├── src/                    # React frontend source
├── dist/                   # Built frontend (created during build)
├── vercel.json            # Vercel configuration
├── package.json           # Dependencies and scripts
└── .env.production        # Production environment variables
```

## 🚀 Step-by-Step Deployment

### 1. Prepare Your Repository

```bash
# Make sure you're in the biology-ui directory
cd biology-ui

# Install dependencies
npm install

# Test the build locally
npm run build

# Commit all changes
git add .
git commit -m "Optimize for Vercel deployment"
git push origin main
```

### 2. Deploy to Vercel

#### Option A: Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Select the `biology-ui` folder as the root directory
5. Vercel will auto-detect it as a Vite project
6. Click "Deploy"

#### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from the biology-ui directory
cd biology-ui
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - What's your project's name? biology-learning-rag
# - In which directory is your code located? ./
```

### 3. Configure Environment Variables

In your Vercel dashboard:

1. Go to your project → Settings → Environment Variables
2. Add the following variables:

```
GROQ_API_KEY=your_groq_api_key_here
PINECONE_API_KEY=your_pinecone_api_key_here (optional)
NODE_ENV=production
```

### 4. Verify Deployment

Once deployed, test your application:

1. **Frontend**: `https://your-app.vercel.app`
2. **API Health**: `https://your-app.vercel.app/api/health`
3. **Biology API**: Test with a POST request to `/api/biology/learn`

```bash
# Test the API
curl -X POST https://your-app.vercel.app/api/biology/learn \
  -H "Content-Type: application/json" \
  -d '{"topic": "photosynthesis"}'
```

## ⚙️ Configuration Details

### vercel.json Configuration

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### API Functions

The serverless functions in `/api` handle:

- **Health checks**: `/api/health`
- **Biology learning**: `/api/biology/learn`
- **Word explanations**: `/api/biology/word-explanation`

### Frontend Configuration

- Uses environment-aware API URLs
- Automatically detects localhost vs production
- Falls back to same-origin requests in production

## 🔧 Customization

### Custom Domain

1. In Vercel dashboard → Settings → Domains
2. Add your custom domain
3. Follow Vercel's DNS configuration instructions

### Environment-Specific Settings

Create different environment variables for:
- `development`: Local development
- `preview`: Vercel preview deployments
- `production`: Live production site

## 🐛 Troubleshooting

### Common Issues

1. **Build Fails**
   ```bash
   # Check build locally first
   npm run build
   
   # Check for missing dependencies
   npm install
   ```

2. **API Routes Not Working**
   - Verify `vercel.json` is in the root directory
   - Check that API files are in `/api` folder
   - Ensure environment variables are set

3. **CORS Issues**
   - The API functions include CORS headers
   - Frontend uses same-origin requests in production

4. **Environment Variables Not Loading**
   - Verify they're set in Vercel dashboard
   - Redeploy after adding variables
   - Check variable names match exactly

### Debug Commands

```bash
# Check Vercel logs
vercel logs https://your-app.vercel.app

# Test API locally
vercel dev

# Check environment variables
vercel env ls
```

## 📊 Performance Considerations

### Optimization Features

- **Serverless Functions**: Automatic scaling
- **Edge Caching**: Static assets cached globally
- **API Responses**: Optimized for fast responses
- **Image Optimization**: Educational images optimized automatically

### Expected Performance

- **Cold Start**: ~2-3 seconds (first API call)
- **Warm Requests**: ~500ms-1s
- **Frontend Load**: ~1-2 seconds
- **Global CDN**: Content served from edge locations

## 🔒 Security

### Built-in Security Features

- **HTTPS**: Automatic SSL certificates
- **CORS**: Properly configured for API access
- **Environment Variables**: Secure storage of API keys
- **Rate Limiting**: Consider adding for production use

### Additional Security (Recommended)

```javascript
// Add to API functions for rate limiting
const rateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
};
```

## 📈 Monitoring

### Vercel Analytics

Enable in dashboard → Analytics for:
- Page views
- Performance metrics
- User engagement
- Geographic distribution

### Custom Monitoring

```javascript
// Add to API functions
console.log(`API call: ${req.url} - ${new Date().toISOString()}`);
```

## 🎯 Success Checklist

- ✅ Frontend loads at your Vercel URL
- ✅ API health check returns 200
- ✅ Biology topic search works
- ✅ Word explanation chatbot functions
- ✅ Visual images display correctly
- ✅ Environment variables configured
- ✅ Custom domain configured (if desired)

## 🚀 Next Steps

After successful deployment:

1. **Custom Domain**: Set up your own domain
2. **Analytics**: Enable Vercel Analytics
3. **Monitoring**: Set up error tracking
4. **Performance**: Monitor and optimize response times
5. **Features**: Add user authentication if needed

Your Biology Learning RAG system is now live and accessible worldwide! 🌍

## 📞 Support

For deployment issues:
1. Check Vercel dashboard for error logs
2. Verify all files are committed to Git
3. Test build locally with `npm run build`
4. Check environment variables in Vercel dashboard

---

**Your biology learning app is now optimized for global deployment!** 🧬✨
