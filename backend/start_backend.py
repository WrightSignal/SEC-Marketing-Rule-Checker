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
    print("📍 Server will be available at: http://localhost:8000")
    print("📖 API Documentation will be available at: http://localhost:8000/docs")
    print("=" * 60)
    
    # Change to backend directory
    backend_dir = os.path.join(os.path.dirname(__file__), 'backend')
    if not os.path.exists(backend_dir):
        print("❌ Backend directory not found!")
        return 1
    
    os.chdir(backend_dir)
    
    # Check if requirements are installed
    try:
        import fastapi
        import uvicorn
        import sqlalchemy
        import docx
        import PyPDF2
    except ImportError as e:
        print(f"❌ Missing dependencies: {e}")
        print("💡 Please install requirements: pip install -r requirements.txt")
        return 1
    
    # Start the server
    try:
        cmd = [sys.executable, "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
        subprocess.run(cmd)
    except KeyboardInterrupt:
        print("\n👋 Server stopped.")
        return 0
    except Exception as e:
        print(f"❌ Failed to start server: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(main()) 