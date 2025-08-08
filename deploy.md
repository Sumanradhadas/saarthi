
# Deployment Guide for SAARthi

This guide covers deploying SAARthi to various platforms.

## Prerequisites

Before deploying, ensure you have:
- A PostgreSQL database (can use Neon, Supabase, or any cloud PostgreSQL)
- Google Gemini API key
- OCR.space API key (optional)

## Environment Variables Required

```env
DATABASE_URL=postgresql://user:password@host:port/database
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_AI_API_KEY=your_google_ai_api_key
OCR_SPACE_API_KEY=your_ocr_space_api_key
PORT=5000
NODE_ENV=production
```

## Platform-Specific Deployment

### 1. Render Deployment

**Steps:**
1. Push your code to GitHub
2. Go to Render Dashboard → New → Web Service
3. Connect your GitHub repository
4. Configure:
   - **Name**: saarthi-app
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Node Version**: 18+
5. Add environment variables in Environment section
6. Deploy

**Render Configuration File** (optional - `render.yaml`):
```yaml
services:
  - type: web
    name: saarthi
    env: node
    buildCommand: npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
```

### 2. Railway Deployment

**Steps:**
1. Push your code to GitHub
2. Go to Railway → New Project → Deploy from GitHub
3. Select your repository
4. Add environment variables
5. Deploy automatically

**Railway Configuration**:
- Build Command: `npm run build`
- Start Command: `npm start`

### 3. Vercel Deployment

**Steps:**
1. Push your code to GitHub
2. Go to Vercel → New Project
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Add environment variables
6. Deploy

**Vercel Configuration** (`vercel.json`):
```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/index.js",
      "use": "@vercel/node"
    },
    {
      "src": "client/dist/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "dist/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "client/dist/$1"
    }
  ]
}
```

### 4. Heroku Deployment

**Steps:**
1. Install Heroku CLI
2. Create Heroku app: `heroku create saarthi-app`
3. Set environment variables: `heroku config:set KEY=value`
4. Deploy: `git push heroku main`

**Heroku Configuration** (`Procfile`):
```
web: npm start
```

### 5. DigitalOcean App Platform

**Steps:**
1. Push your code to GitHub
2. Go to DigitalOcean → Apps → Create App
3. Connect GitHub repository
4. Configure:
   - **Build Command**: `npm run build`
   - **Run Command**: `npm start`
5. Add environment variables
6. Deploy

## Database Setup

### Using Neon (Recommended)

1. Go to [Neon Console](https://console.neon.tech)
2. Create a new project
3. Copy the connection string
4. Add to `DATABASE_URL` environment variable
5. Run `npm run db:push` to create tables

### Using Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string
5. Add to `DATABASE_URL` environment variable
6. Run `npm run db:push` to create tables

## Post-Deployment Checklist

- [ ] Application starts without errors
- [ ] Database connection works
- [ ] API endpoints respond correctly
- [ ] Frontend loads and functions properly
- [ ] File uploads work (if applicable)
- [ ] AI services are responding
- [ ] Environment variables are set correctly

## Troubleshooting

### Common Issues

1. **Module not found errors**
   - Ensure all dependencies are in `dependencies`, not `devDependencies`
   - Run `npm run build` locally to test

2. **Database connection errors**
   - Verify `DATABASE_URL` format
   - Ensure database is accessible from deployment platform

3. **API key errors**
   - Check environment variables are set correctly
   - Verify API keys are valid and have proper permissions

4. **Build failures**
   - Check Node.js version compatibility
   - Ensure all TypeScript types are resolved

5. **Memory issues**
   - Optimize images and assets
   - Consider upgrading plan if needed

## Monitoring

After deployment, monitor:
- Application logs for errors
- Database performance
- API response times
- Memory and CPU usage
- Error rates

## Scaling

For high traffic:
- Use Redis for session storage
- Implement caching strategies
- Consider CDN for static assets
- Database connection pooling
- Horizontal scaling if supported by platform
