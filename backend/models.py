from sqlalchemy import Column, Integer, String, DateTime, Text, Float, ForeignKey, JSON
from sqlalchemy.orm import relationship
from .database import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)
    original_filename = Column(String)
    file_path = Column(String)
    document_type = Column(String)  # "advertisement", "rfp", "rfi", etc.
    file_size = Column(Integer)
    uploaded_at = Column(DateTime)
    
    # Relationship to compliance analysis
    analysis = relationship("ComplianceAnalysis", back_populates="document", uselist=False)

class ComplianceAnalysis(Base):
    __tablename__ = "compliance_analyses"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"))
    overall_score = Column(Float)  # 0-100 compliance score
    compliance_status = Column(String)  # "compliant", "non_compliant", "needs_review"
    findings = Column(JSON)  # List of compliance findings
    recommendations = Column(JSON)  # List of recommendations
    analyzed_at = Column(DateTime)
    
    # Relationship to document
    document = relationship("Document", back_populates="analysis") 