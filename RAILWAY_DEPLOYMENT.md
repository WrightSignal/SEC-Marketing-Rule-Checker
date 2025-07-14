# Railway Deployment Guide - SEC Marketing Rule Checker

## Project Information
- **Project ID**: `c84d545a-ee8a-4ccd-99c6-8641cd9168eb`
- **Project Name**: SEC-Marketing-Rule-Checker
- **Environment**: production

## Architecture Overview

This project consists of two services:
1. **Backend Service**: FastAPI Python application (Port 8000)
2. **Frontend Service**: React application (Port 3000)

## Prerequisites

1. **Railway CLI** (already installed)
   ```bash
   npm install -g @railway/cli
   ```

2. **Railway Account** (already linked)
   ```bash
   railway login
   ```

## Deployment Structure

### Backend Service (`/backend`)
- **Runtime**: Python 3.11
- **Framework**: FastAPI
- **Database**: SQLite (file-based)
- **Configuration**: `backend/nixpacks.toml`

### Frontend Service (`/frontend`)
- **Runtime**: Node.js 18
- **Framework**: React
- **Build Tool**: Create React App
- **Serving**: `serve` package
- **Configuration**: `frontend/nixpacks.toml`

## Environment Variables

### Backend Service
Set these environment variables in Railway dashboard:

```bash
# Automatically set by Railway
PORT=8000

# Database (SQLite file-based - no external config needed)
# File will be created as: ./sec_compliance.db

# CORS Origins (update with your Railway frontend URL)
CORS_ORIGINS=["https://your-frontend-service.railway.app"]
```

### Frontend Service
Set these environment variables in Railway dashboard:

```bash
# Automatically set by Railway
PORT=3000

# API Base URL (update with your Railway backend URL)
REACT_APP_API_URL=https://your-backend-service.railway.app
```

## Deployment Commands

### Deploy Backend Service
```bash
# From project root
railway up --service backend

# Or deploy specific service
railway up --service SEC-Marketing-Rule-Checker
```

### Deploy Frontend Service
```bash
# From project root
railway up --service frontend
```

### Deploy Both Services
```bash
# Deploy all services
railway up
```

## Service URLs

Once deployed, your services will be available at:
- **Backend**: `https://your-backend-service.railway.app`
- **Frontend**: `https://your-frontend-service.railway.app`

## Configuration Files

### Root Level
- `railway.json` - Main Railway configuration
- `RAILWAY_DEPLOYMENT.md` - This deployment guide

### Backend Service
- `backend/nixpacks.toml` - Backend build configuration
- `backend/requirements.txt` - Python dependencies

### Frontend Service
- `frontend/nixpacks.toml` - Frontend build configuration
- `frontend/package.json` - Node.js dependencies (includes `serve`)

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

### View Logs
```bash
# Backend logs
railway logs --service backend

# Frontend logs
railway logs --service frontend

# All services
railway logs
```

### Service Status
```bash
railway status
```

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check `nixpacks.toml` configuration
   - Ensure all dependencies are in requirements.txt/package.json
   - Check Railway logs for specific errors

2. **Service Communication**
   - Update CORS origins in backend
   - Set correct API URL in frontend environment variables
   - Check service URLs in Railway dashboard

3. **Database Issues**
   - SQLite file permissions
   - Check if uploads directory exists
   - Verify database initialization

### Useful Commands

```bash
# Check project status
railway status

# Open Railway dashboard
railway open

# View environment variables
railway variables

# Connect to service shell
railway shell

# Download service logs
railway logs --service backend > backend.log
```

## Security Considerations

1. **Environment Variables**
   - Never commit sensitive data to repository
   - Use Railway's environment variables for secrets
   - Update CORS origins for production

2. **File Uploads**
   - Consider file size limits
   - Implement proper file validation
   - Use secure file storage for production

3. **Database**
   - SQLite is suitable for development/small scale
   - Consider PostgreSQL for production scaling

## Production Checklist

- [ ] Update CORS origins with actual frontend URL
- [ ] Set correct API URL in frontend environment variables
- [ ] Configure proper file storage solution
- [ ] Set up monitoring and alerts
- [ ] Configure custom domains if needed
- [ ] Review security settings
- [ ] Test all upload functionality
- [ ] Set up backup strategy for database and files

## Support

For Railway-specific issues:
- Railway Documentation: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Railway GitHub: https://github.com/railwayapp/railway

For project-specific issues:
- Check application logs in Railway dashboard
- Review this deployment guide
- Verify all configuration files are properly set 