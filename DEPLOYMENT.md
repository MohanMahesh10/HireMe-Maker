# Deployment Guide for Smart Resume Optimizer

## Quick Overview

This guide will help you deploy the Smart Resume Optimizer to GitHub Pages (frontend) and a cloud service (backend).

## Prerequisites

1. GitHub account
2. Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
3. Cloud service account (Heroku, Railway, or Vercel)

## Step 1: Repository Setup

1. Create a new repository on GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Smart Resume Optimizer"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/smart-resume-optimizer.git
   git push -u origin main
   ```

## Step 2: Backend Deployment

### Option A: Heroku (Recommended)

1. **Create Heroku app:**
   ```bash
   # Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
   heroku create your-app-name
   ```

2. **Deploy backend:**
   ```bash
   # From project root
   git subtree push --prefix backend heroku main
   ```

3. **Your backend URL:** `https://your-app-name.herokuapp.com`

### Option B: Railway

1. Go to [Railway](https://railway.app)
2. Connect your GitHub repository
3. Select the `backend` folder for deployment
4. Railway will auto-detect FastAPI and deploy
5. Note your Railway URL

### Option C: Render

1. Go to [Render](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Build Command: `pip install -r requirements.txt`
5. Start Command: `uvicorn main:app --host=0.0.0.0 --port=$PORT`
6. Root Directory: `backend`

## Step 3: Frontend Configuration

1. **Update API URL in `frontend/src/config.js`:**
   ```javascript
   const config = {
     development: {
       API_BASE_URL: 'http://localhost:8000'
     },
     production: {
       API_BASE_URL: 'https://your-backend-url.herokuapp.com'  // Replace with your actual URL
     }
   };
   ```

2. **Update homepage in `frontend/package.json`:**
   ```json
   {
     "homepage": "https://YOUR_USERNAME.github.io/smart-resume-optimizer",
     ...
   }
   ```

## Step 4: Frontend Deployment to GitHub Pages

1. **Enable GitHub Pages:**
   - Go to your repository settings
   - Scroll to "Pages" section
   - Source: "Deploy from a branch"
   - Branch: `gh-pages`

2. **Deploy frontend:**
   ```bash
   cd frontend
   npm install
   npm run build
   npm run deploy
   ```

3. **Or use GitHub Actions (automatic):**
   - The `.github/workflows/deploy.yml` file is already configured
   - Push changes to main branch
   - GitHub Actions will automatically build and deploy

## Step 5: Update CORS Settings

Update the CORS origins in `backend/main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://YOUR_USERNAME.github.io",  # Your GitHub Pages URL
        "http://localhost:3000"  # Keep for local development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Step 6: Test Deployment

1. Visit your GitHub Pages URL: `https://YOUR_USERNAME.github.io/smart-resume-optimizer`
2. Enter a Gemini API key
3. Upload a test resume and job description
4. Verify the full workflow works

## Troubleshooting

### Common Issues

1. **CORS Errors:**
   - Ensure your backend CORS settings include your GitHub Pages URL
   - Redeploy backend after updating CORS settings

2. **API Key Issues:**
   - Verify your Gemini API key is valid
   - Check that the backend URL is correct in config.js

3. **File Upload Issues:**
   - Check backend logs for specific error messages
   - Ensure your backend service has sufficient memory/storage

4. **GitHub Pages 404:**
   - Ensure `homepage` in package.json matches your repository name
   - Check that the `gh-pages` branch exists and has content

### Backend Logs

- **Heroku:** `heroku logs --tail -a your-app-name`
- **Railway:** Check logs in Railway dashboard
- **Render:** Check logs in Render dashboard

## Environment Variables (Optional)

For production security, you can set environment variables instead of hardcoding URLs:

1. **Backend (`backend/main.py`):**
   ```python
   import os
   
   # CORS origins from environment variable
   allowed_origins = os.getenv('ALLOWED_ORIGINS', 'http://localhost:3000').split(',')
   
   app.add_middleware(
       CORSMiddleware,
       allow_origins=allowed_origins,
       ...
   )
   ```

2. **Frontend (`frontend/src/config.js`):**
   ```javascript
   const config = {
     development: {
       API_BASE_URL: 'http://localhost:8000'
     },
     production: {
       API_BASE_URL: process.env.REACT_APP_API_URL || 'https://your-default-backend.herokuapp.com'
     }
   };
   ```

## Custom Domain (Optional)

1. **GitHub Pages Custom Domain:**
   - Add a `CNAME` file to `frontend/public/` with your domain
   - Configure DNS settings with your domain provider

2. **Backend Custom Domain:**
   - Configure custom domain in your cloud service dashboard
   - Update the API_BASE_URL in frontend config

## Security Considerations

1. **API Keys:** Never commit API keys to the repository
2. **HTTPS:** Always use HTTPS in production
3. **Rate Limiting:** Consider adding rate limiting to your backend
4. **File Validation:** The backend includes basic file type validation

## Monitoring

1. **Backend Monitoring:**
   - Use your cloud service's built-in monitoring
   - Consider adding logging for better debugging

2. **Frontend Monitoring:**
   - GitHub Pages has basic analytics
   - Consider adding Google Analytics or similar

## Scaling

If you expect high traffic:

1. **Backend Scaling:**
   - Use cloud services with auto-scaling
   - Consider adding a Redis cache for session management
   - Implement request queuing for Gemini API calls

2. **Frontend Optimization:**
   - Enable gzip compression
   - Use a CDN for static assets
   - Implement lazy loading for components

Your Smart Resume Optimizer is now deployed and ready to use! 🚀 