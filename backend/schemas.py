from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional, Dict, Any

class AnalysisResponse(BaseModel):
    id: int
    overall_score: float
    compliance_status: str
    findings: List[Dict[str, Any]]
    recommendations: List[str]
    analyzed_at: datetime

    class Config:
        from_attributes = True

class DocumentResponse(BaseModel):
    id: int
    filename: str
    document_type: str
    uploaded_at: datetime
    analysis: Optional[AnalysisResponse] = None

    class Config:
        from_attributes = True

class ComplianceFinding(BaseModel):
    rule_type: str
    severity: str  # "high", "medium", "low"
    description: str
    location: Optional[str]
    suggestion: str

class DocumentUploadRequest(BaseModel):
    document_type: str = "advertisement" 