#!/bin/bash
# Railway Deployment Script for SEC Marketing Rule Checker

echo "🚀 Deploying SEC Marketing Rule Checker to Railway..."
echo "=================================================="

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI is not installed"
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli
fi

# Check if logged in
if ! railway whoami &> /dev/null; then
    echo "🔐 Please login to Railway first:"
    railway login
fi

# Check if project is linked
if ! railway status &> /dev/null; then
    echo "🔗 Linking to Railway project..."
    railway link -p c84d545a-ee8a-4ccd-99c6-8641cd9168eb
fi

echo "📊 Current project status:"
railway status

echo ""
echo "🚀 Starting deployment..."
echo "=========================="

# Deploy all services
railway up

echo ""
echo "✅ Deployment completed!"
echo "📋 Next steps:"
echo "   1. Check deployment status: railway status"
echo "   2. View logs: railway logs"
echo "   3. Open project dashboard: railway open"
echo "   4. Update environment variables if needed"
echo ""
echo "🔧 Important: Make sure to set the following environment variables:"
echo "   Backend: CORS_ORIGINS (comma-separated frontend URLs)"
echo "   Frontend: REACT_APP_API_URL (backend service URL)" 