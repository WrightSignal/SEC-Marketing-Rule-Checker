from fastapi import FastAPI, File, UploadFile, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
import os
import uuid
from datetime import datetime
from typing import List, Optional

from . import models, schemas, database, compliance_engine
from .database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SEC Marketing Rule Checker",
    description="Upload documents and verify compliance with SEC marketing rules",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Local development
        "https://*.vercel.app",   # All Vercel apps
        "https://sec-marketing-rule-checker.vercel.app",  # Your specific app
        "*"  # Allow all origins (for testing - remove in production)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create upload directory
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
async def root():
    return {"message": "SEC Marketing Rule Checker API"}

@app.post("/upload-document/", response_model=schemas.DocumentResponse)
async def upload_document(
    file: UploadFile = File(...),
    document_type: str = "advertisement",
    db: Session = Depends(get_db)
):
    """Upload a document for SEC marketing rule compliance checking"""
    
    # Validate file type
    allowed_types = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="File type not supported. Please upload PDF, Word, or text files.")
    
    # Check file size (600MB limit)
    MAX_FILE_SIZE = 600 * 1024 * 1024  # 600MB in bytes
    content = await file.read()
    
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413, 
            detail=f"File size exceeds maximum limit of 600MB. File size: {len(content) / (1024*1024):.1f}MB"
        )
    
    # Generate unique filename
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    # Save file
    with open(file_path, "wb") as buffer:
        buffer.write(content)
    
    # Create database record
    db_document = models.Document(
        filename=file.filename,
        original_filename=file.filename,
        file_path=file_path,
        document_type=document_type,
        file_size=len(content),
        uploaded_at=datetime.utcnow()
    )
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    
    # Analyze document for compliance
    try:
        analysis_result = await compliance_engine.analyze_document(file_path, document_type)
        
        # Save analysis results
        db_analysis = models.ComplianceAnalysis(
            document_id=db_document.id,
            overall_score=analysis_result['overall_score'],
            compliance_status=analysis_result['compliance_status'],
            findings=analysis_result['findings'],
            recommendations=analysis_result['recommendations'],
            analyzed_at=datetime.utcnow()
        )
        db.add(db_analysis)
        db.commit()
        db.refresh(db_analysis)
        
        return schemas.DocumentResponse(
            id=db_document.id,
            filename=db_document.filename,
            document_type=db_document.document_type,
            uploaded_at=db_document.uploaded_at,
            analysis=schemas.AnalysisResponse(
                id=db_analysis.id,
                overall_score=db_analysis.overall_score,
                compliance_status=db_analysis.compliance_status,
                findings=db_analysis.findings,
                recommendations=db_analysis.recommendations,
                analyzed_at=db_analysis.analyzed_at
            )
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.get("/documents/", response_model=List[schemas.DocumentResponse])
async def get_documents(db: Session = Depends(get_db)):
    """Get all uploaded documents and their analysis results"""
    documents = db.query(models.Document).all()
    return documents

@app.get("/documents/{document_id}", response_model=schemas.DocumentResponse)
async def get_document(document_id: int, db: Session = Depends(get_db)):
    """Get a specific document and its analysis"""
    document = db.query(models.Document).filter(models.Document.id == document_id).first()
    if document is None:
        raise HTTPException(status_code=404, detail="Document not found")
    return document

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port) 