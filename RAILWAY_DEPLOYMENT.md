# Railway + Vercel Deployment Guide - SEC Marketing Rule Checker

## Project Information
- **Railway Project ID**: `c84d545a-ee8a-4ccd-99c6-8641cd9168eb`
- **Project Name**: SEC-Marketing-Rule-Checker
- **Environment**: production
- **Backend**: Railway (FastAPI)
- **Frontend**: Vercel (React)

## Architecture Overview

This project uses a hybrid deployment approach:
1. **Backend Service**: FastAPI Python application on Railway (Port 8000)
2. **Frontend Service**: React application on Vercel

## Prerequisites

1. **Railway CLI** (for backend deployment)
   ```bash
   npm install -g @railway/cli
   ```

2. **Vercel CLI** (for frontend deployment)
   ```bash
   npm install -g vercel
   ```

3. **Railway Account** (already linked)
   ```bash
   railway login
   ```

4. **Vercel Account**
   ```bash
   vercel login
   ```

## Backend Deployment (Railway)

### Configuration
- **Runtime**: Python 3.11
- **Framework**: FastAPI
- **Database**: SQLite (file-based)
- **Configuration**: `backend/nixpacks.toml`

### Environment Variables
Set these in Railway dashboard:

```bash
# Automatically set by Railway
PORT=8000

# Database (SQLite file-based - no external config needed)
# File will be created as: ./sec_compliance.db

# CORS Origins (add your Vercel URL)
CORS_ORIGINS=https://your-vercel-app.vercel.app,https://sec-marketing-rule-checker.vercel.app
```

### Deploy Backend
```bash
# From project root
railway up

# Or specifically target the backend service
railway up --service SEC-Marketing-Rule-Checker
```

## Frontend Deployment (Vercel)

### Configuration
- **Runtime**: Node.js 18
- **Framework**: React
- **Build Tool**: Create React App
- **Platform**: Vercel

### Environment Variables
Set these in Vercel dashboard:

```bash
# API Base URL (your Railway backend URL)
REACT_APP_API_URL=https://your-railway-backend.railway.app
```

### Deploy Frontend
```bash
# From frontend directory
cd frontend
vercel

# Or for production deployment
vercel --prod
```

## Service URLs

Once deployed, your services will be available at:
- **Backend (Railway)**: `https://your-backend-service.railway.app`
- **Frontend (Vercel)**: `https://your-vercel-app.vercel.app`

## Configuration Files

### Backend (Railway)
- `backend/nixpacks.toml` - Backend build configuration
- `backend/requirements.txt` - Python dependencies
- `backend/main.py` - Updated with Vercel CORS support

### Frontend (Vercel)
- `frontend/package.json` - Node.js dependencies
- `frontend/public/index.html` - React app entry point
- Vercel automatically detects React projects

### Root Level
- `railway.json` - Railway configuration
- `RAILWAY_DEPLOYMENT.md` - This deployment guide

## CORS Configuration

The backend is already configured to accept requests from:
- `http://localhost:3000` (Local development)
- `https://*.vercel.app` (All Vercel apps)
- `https://sec-marketing-rule-checker.vercel.app` (Your specific app)
- `https://*.railway.app` (Railway deployments)

## Database Setup

The application uses SQLite which is file-based:
- Database file: `sec_compliance.db`
- Tables are created automatically on first run
- No external database configuration needed

## File Storage

Documents are stored in the `uploads/` directory:
- Directory is created automatically
- Files are stored locally on the Railway service
- Consider using Railway's persistent storage for production

## Monitoring and Logs

### Backend (Railway)
```bash
railway logs         # View application logs
railway status       # Check deployment status
railway open         # Open Railway dashboard
```

### Frontend (Vercel)
- Use Vercel dashboard: https://vercel.com/dashboard
- View deployment logs and analytics
- Monitor performance and errors

## Deployment Commands

### Backend Only (Railway)
```bash
railway up
```

### Frontend Only (Vercel)
```bash
cd frontend
vercel --prod
```

### Both Services
```bash
# Deploy backend
railway up

# Deploy frontend
cd frontend
vercel --prod
```

## Environment Setup

### Development
```bash
# Backend (Terminal 1)
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# Frontend (Terminal 2)
cd frontend
npm start
```

### Production
- Backend: Automatically deployed on Railway
- Frontend: Automatically deployed on Vercel

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Verify your Vercel URL is added to CORS_ORIGINS in Railway
   - Check that the frontend API URL points to your Railway backend

2. **Backend Build Failures**
   - Check `backend/nixpacks.toml` configuration
   - Ensure all dependencies are in requirements.txt
   - Check Railway logs for specific errors

3. **Frontend Build Failures**
   - Check Vercel build logs
   - Verify environment variables are set correctly
   - Ensure API URL is accessible from Vercel

4. **API Communication Issues**
   - Check that Railway backend is running
   - Verify CORS configuration includes your Vercel domain
   - Test backend endpoints directly

### Useful Commands

```bash
# Railway (Backend)
railway status       # Check project status
railway logs         # View logs
railway variables    # View environment variables
railway shell        # Connect to service shell

# Vercel (Frontend)
vercel ls            # List deployments
vercel logs          # View logs
vercel env           # Manage environment variables
vercel --prod        # Deploy to production
```

## Security Considerations

1. **Environment Variables**
   - Use Railway's environment variables for backend secrets
   - Use Vercel's environment variables for frontend config
   - Never commit sensitive data to repository

2. **CORS Configuration**
   - Limit CORS origins to your actual domains
   - Remove wildcard origins in production
   - Regularly review and update allowed origins

3. **API Security**
   - Implement proper authentication if needed
   - Use HTTPS for all communications
   - Monitor API usage and rate limiting

## Production Checklist

### Backend (Railway)
- [ ] Railway deployment successful
- [ ] Environment variables configured
- [ ] Database initialized properly
- [ ] Upload directory created
- [ ] CORS origins include Vercel domain

### Frontend (Vercel)
- [ ] Vercel deployment successful
- [ ] API URL environment variable set
- [ ] Custom domain configured (if needed)
- [ ] Performance monitoring enabled
- [ ] Error tracking configured

### Integration Testing
- [ ] Frontend can reach backend API
- [ ] File upload functionality works
- [ ] CORS headers properly configured
- [ ] SSL certificates valid
- [ ] All API endpoints responsive

## Support

### Railway (Backend)
- Railway Documentation: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Railway GitHub: https://github.com/railwayapp/railway

### Vercel (Frontend)
- Vercel Documentation: https://vercel.com/docs
- Vercel Discord: https://discord.gg/vercel
- Vercel GitHub: https://github.com/vercel/vercel

### Project-Specific
- Check application logs in respective dashboards
- Review this deployment guide
- Verify all configuration files are properly set 