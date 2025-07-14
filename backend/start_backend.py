#!/usr/bin/env python3
"""
SEC Marketing Rule Checker - Backend Startup Script
"""

import os
import sys
import subprocess

def main():
    """Start the FastAPI backend server"""
    print("🚀 Starting SEC Marketing Rule Checker Backend...")
    
    # Get port from environment (Railway sets this)
    port = int(os.environ.get("PORT", 8000))
    print(f"📍 Server will be available at: http://0.0.0.0:{port}")
    print(f"📖 API Documentation will be available at: http://0.0.0.0:{port}/docs")
    print("=" * 60)
    
    # We're already in the backend directory, no need to change paths
    
    # Check if requirements are installed
    try:
        import fastapi
        import uvicorn
        import sqlalchemy
    except ImportError as e:
        print(f"❌ Missing dependencies: {e}")
        print("💡 Please install requirements: pip install -r requirements.txt")
        return 1
    
    # Start the server with dynamic port and large file support
    try:
        cmd = [
            sys.executable, "-m", "uvicorn", "main:app", 
            "--host", "0.0.0.0", 
            "--port", str(port),
            "--timeout-keep-alive", "300",
            "--limit-max-requests", "1000",
            "--limit-concurrency", "100"
        ]
        subprocess.run(cmd)
    except KeyboardInterrupt:
        print("\n👋 Server stopped.")
        return 0
    except Exception as e:
        print(f"❌ Failed to start server: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(main()) 