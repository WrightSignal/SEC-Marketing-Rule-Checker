import re
import json
from typing import Dict, List, Any, Tuple
from datetime import datetime
import logging

from .document_parser import DocumentParser

logger = logging.getLogger(__name__)

class SECComplianceEngine:
    """
    Analyzes documents for compliance with SEC Marketing Rule 206(4)-1
    """
    
    def __init__(self):
        self.parser = DocumentParser()
        self.compliance_rules = self._load_compliance_rules()
    
    def _load_compliance_rules(self) -> Dict[str, Any]:
        """Load SEC marketing rule compliance patterns and requirements"""
        return {
            'performance_advertising': {
                'required_periods': ['1-year', '5-year', '10-year', 'inception'],
                'prohibited_patterns': [
                    r'cherry.?pick',
                    r'select(?:ed|ive).{0,50}period',
                    r'best.{0,30}performance',
                    r'handpicked.{0,30}returns?'
                ],
                'required_disclosures': [
                    r'net.{0,20}fees?',
                    r'past.{0,30}performance.{0,30}not.{0,30}guarantee',
                    r'hypothetical.{0,30}performance',
                    r'risk.{0,30}disclaimer'
                ]
            },
            'hypothetical_performance': {
                'required_warnings': [
                    r'hypothetical',
                    r'not.{0,30}actual.{0,30}results?',
                    r'risk.{0,30}loss',
                    r'limitations?'
                ],
                'prohibited_without_disclosure': [
                    r'projected.{0,30}returns?',
                    r'expected.{0,30}performance',
                    r'estimated.{0,30}gains?'
                ]
            },
            'testimonials_endorsements': {
                'required_disclosures': [
                    r'compensation.{0,30}provided',
                    r'conflicts?.{0,30}of.{0,30}interest',
                    r'client.{0,30}(?:or|\/|and).{0,30}investor',
                    r'material.{0,30}conflicts?'
                ],
                'client_indicators': [
                    r'client.{0,30}testimonial',
                    r'customer.{0,30}review',
                    r'investor.{0,30}feedback'
                ]
            },
            'substantiation': {
                'unsubstantiated_claims': [
                    r'guaranteed.{0,30}returns?',
                    r'risk.?free',
                    r'always.{0,30}profitable',
                    r'never.{0,30}lose',
                    r'best.{0,30}in.{0,30}(?:industry|market|class)'
                ],
                'requires_evidence': [
                    r'#1.{0,30}(?:ranked|rated|performing)',
                    r'top.{0,30}\d+.{0,30}(?:advisor|firm|manager)',
                    r'award.?winning',
                    r'highest.{0,30}(?:rated|ranked)'
                ]
            },
            'anti_fraud': {
                'misleading_patterns': [
                    r'guaranteed.{0,30}profit',
                    r'no.{0,30}risk',
                    r'certain.{0,30}returns?',
                    r'foolproof.{0,30}strategy'
                ],
                'omission_indicators': [
                    r'results.{0,30}may.{0,30}vary',
                    r'individual.{0,30}results.{0,30}differ',
                    r'consult.{0,30}financial.{0,30}advisor'
                ]
            },
            'third_party_ratings': {
                'required_disclosures': [
                    r'rating.{0,30}date',
                    r'period.{0,30}based.{0,30}on',
                    r'third.?party.{0,30}(?:identity|source)',
                    r'compensation.{0,30}provided'
                ]
            }
        }
    
    async def analyze_document(self, file_path: str, document_type: str = "advertisement") -> Dict[str, Any]:
        """
        Perform comprehensive SEC marketing rule compliance analysis
        
        Args:
            file_path: Path to the document to analyze
            document_type: Type of document (advertisement, rfp, rfi, etc.)
            
        Returns:
            Dictionary with compliance analysis results
        """
        try:
            # Extract text from document
            extraction_result = self.parser.extract_text(file_path)
            
            if 'error' in extraction_result:
                return {
                    'overall_score': 0,
                    'compliance_status': 'error',
                    'findings': [{'rule_type': 'extraction_error', 'severity': 'high', 
                                'description': extraction_result['error'], 'suggestion': 'Please upload a valid document file'}],
                    'recommendations': ['Upload a valid PDF, Word, or text document'],
                    'document_stats': extraction_result
                }
            
            text = extraction_result['text']
            cleaned_text = self.parser.clean_text(text.lower())
            
            # Perform compliance checks
            findings = []
            findings.extend(self._check_performance_advertising(cleaned_text))
            findings.extend(self._check_hypothetical_performance(cleaned_text))
            findings.extend(self._check_testimonials_endorsements(cleaned_text))
            findings.extend(self._check_substantiation(cleaned_text))
            findings.extend(self._check_anti_fraud(cleaned_text))
            findings.extend(self._check_third_party_ratings(cleaned_text))
            
            # Calculate overall score and status
            overall_score, compliance_status = self._calculate_compliance_score(findings)
            
            # Generate recommendations
            recommendations = self._generate_recommendations(findings)
            
            return {
                'overall_score': overall_score,
                'compliance_status': compliance_status,
                'findings': findings,
                'recommendations': recommendations,
                'document_stats': extraction_result
            }
            
        except Exception as e:
            logger.error(f"Analysis failed for {file_path}: {str(e)}")
            return {
                'overall_score': 0,
                'compliance_status': 'error',
                'findings': [{'rule_type': 'analysis_error', 'severity': 'high', 
                            'description': f'Analysis failed: {str(e)}', 'suggestion': 'Please try again or contact support'}],
                'recommendations': ['Please try uploading the document again'],
                'document_stats': {'text': '', 'word_count': 0, 'page_count': 0}
            }
    
    def _check_performance_advertising(self, text: str) -> List[Dict[str, Any]]:
        """Check compliance with performance advertising rules"""
        findings = []
        
        # Check for cherry-picking indicators
        for pattern in self.compliance_rules['performance_advertising']['prohibited_patterns']:
            if re.search(pattern, text, re.IGNORECASE):
                findings.append({
                    'rule_type': 'performance_advertising',
                    'severity': 'high',
                    'description': f'Potential cherry-picking detected: {pattern}',
                    'location': self._find_pattern_context(text, pattern),
                    'suggestion': 'Remove selective time period language and present standardized time periods (1, 5, 10 years, inception)'
                })
        
        # Check for required performance disclosures
        performance_keywords = ['return', 'performance', 'gain', 'profit', 'yield']
        has_performance_content = any(keyword in text for keyword in performance_keywords)
        
        if has_performance_content:
            missing_disclosures = []
            for disclosure in self.compliance_rules['performance_advertising']['required_disclosures']:
                if not re.search(disclosure, text, re.IGNORECASE):
                    missing_disclosures.append(disclosure)
            
            if missing_disclosures:
                findings.append({
                    'rule_type': 'performance_advertising',
                    'severity': 'medium',
                    'description': 'Missing required performance disclosures',
                    'location': 'Throughout document',
                    'suggestion': 'Add disclosures about net fees, past performance not guaranteeing future results, and risk warnings'
                })
        
        return findings
    
    def _check_hypothetical_performance(self, text: str) -> List[Dict[str, Any]]:
        """Check compliance with hypothetical performance rules"""
        findings = []
        
        # Check for hypothetical performance without proper warnings
        for pattern in self.compliance_rules['hypothetical_performance']['prohibited_without_disclosure']:
            if re.search(pattern, text, re.IGNORECASE):
                # Check if proper hypothetical warnings are present
                has_warnings = any(re.search(warning, text, re.IGNORECASE) 
                                 for warning in self.compliance_rules['hypothetical_performance']['required_warnings'])
                
                if not has_warnings:
                    findings.append({
                        'rule_type': 'hypothetical_performance',
                        'severity': 'high',
                        'description': f'Hypothetical performance without required warnings: {pattern}',
                        'location': self._find_pattern_context(text, pattern),
                        'suggestion': 'Add clear disclosure that this is hypothetical performance, includes risks and limitations'
                    })
        
        return findings
    
    def _check_testimonials_endorsements(self, text: str) -> List[Dict[str, Any]]:
        """Check compliance with testimonial and endorsement rules"""
        findings = []
        
        # Check for client testimonials
        for indicator in self.compliance_rules['testimonials_endorsements']['client_indicators']:
            if re.search(indicator, text, re.IGNORECASE):
                # Check for required disclosures
                missing_disclosures = []
                for disclosure in self.compliance_rules['testimonials_endorsements']['required_disclosures']:
                    if not re.search(disclosure, text, re.IGNORECASE):
                        missing_disclosures.append(disclosure)
                
                if missing_disclosures:
                    findings.append({
                        'rule_type': 'testimonials_endorsements',
                        'severity': 'high',
                        'description': 'Testimonial/endorsement missing required disclosures',
                        'location': self._find_pattern_context(text, indicator),
                        'suggestion': 'Add disclosures about compensation, conflicts of interest, and client/investor status'
                    })
        
        return findings
    
    def _check_substantiation(self, text: str) -> List[Dict[str, Any]]:
        """Check for unsubstantiated claims"""
        findings = []
        
        # Check for unsubstantiated claims
        for pattern in self.compliance_rules['substantiation']['unsubstantiated_claims']:
            if re.search(pattern, text, re.IGNORECASE):
                findings.append({
                    'rule_type': 'substantiation',
                    'severity': 'high',
                    'description': f'Unsubstantiated claim detected: {pattern}',
                    'location': self._find_pattern_context(text, pattern),
                    'suggestion': 'Remove unsubstantiated claims or provide proper evidence and disclaimers'
                })
        
        # Check for claims requiring evidence
        for pattern in self.compliance_rules['substantiation']['requires_evidence']:
            if re.search(pattern, text, re.IGNORECASE):
                findings.append({
                    'rule_type': 'substantiation',
                    'severity': 'medium',
                    'description': f'Claim requiring substantiation: {pattern}',
                    'location': self._find_pattern_context(text, pattern),
                    'suggestion': 'Provide evidence source, date, and methodology for this ranking/award claim'
                })
        
        return findings
    
    def _check_anti_fraud(self, text: str) -> List[Dict[str, Any]]:
        """Check for potentially fraudulent or misleading statements"""
        findings = []
        
        for pattern in self.compliance_rules['anti_fraud']['misleading_patterns']:
            if re.search(pattern, text, re.IGNORECASE):
                findings.append({
                    'rule_type': 'anti_fraud',
                    'severity': 'high',
                    'description': f'Potentially misleading statement: {pattern}',
                    'location': self._find_pattern_context(text, pattern),
                    'suggestion': 'Remove misleading language and add appropriate risk disclosures'
                })
        
        return findings
    
    def _check_third_party_ratings(self, text: str) -> List[Dict[str, Any]]:
        """Check compliance with third-party rating disclosure requirements"""
        findings = []
        
        rating_indicators = ['rated', 'ranking', 'award', 'recognition', 'honor']
        has_ratings = any(indicator in text for indicator in rating_indicators)
        
        if has_ratings:
            missing_disclosures = []
            for disclosure in self.compliance_rules['third_party_ratings']['required_disclosures']:
                if not re.search(disclosure, text, re.IGNORECASE):
                    missing_disclosures.append(disclosure)
            
            if missing_disclosures:
                findings.append({
                    'rule_type': 'third_party_ratings',
                    'severity': 'medium',
                    'description': 'Third-party rating missing required disclosures',
                    'location': 'Rating/award mentions',
                    'suggestion': 'Add disclosures about rating date, period, source identity, and any compensation provided'
                })
        
        return findings
    
    def _find_pattern_context(self, text: str, pattern: str, context_chars: int = 100) -> str:
        """Find context around a pattern match"""
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            start = max(0, match.start() - context_chars)
            end = min(len(text), match.end() + context_chars)
            return f"...{text[start:end]}..."
        return "Pattern found in document"
    
    def _calculate_compliance_score(self, findings: List[Dict[str, Any]]) -> Tuple[float, str]:
        """Calculate overall compliance score and status"""
        if not findings:
            return 100.0, "compliant"
        
        # Weight findings by severity
        severity_weights = {'high': 25, 'medium': 10, 'low': 5}
        total_deduction = sum(severity_weights.get(finding['severity'], 5) for finding in findings)
        
        # Cap at 0
        score = max(0, 100 - total_deduction)
        
        # Determine status
        if score >= 85:
            status = "compliant"
        elif score >= 70:
            status = "needs_review"
        else:
            status = "non_compliant"
        
        return score, status
    
    def _generate_recommendations(self, findings: List[Dict[str, Any]]) -> List[str]:
        """Generate actionable recommendations based on findings"""
        recommendations = []
        
        # Group findings by type
        finding_types = {}
        for finding in findings:
            rule_type = finding['rule_type']
            if rule_type not in finding_types:
                finding_types[rule_type] = []
            finding_types[rule_type].append(finding)
        
        # Generate type-specific recommendations
        if 'performance_advertising' in finding_types:
            recommendations.append("Review performance advertising to ensure proper time periods (1, 5, 10 years, inception) and required disclosures")
        
        if 'hypothetical_performance' in finding_types:
            recommendations.append("Add clear hypothetical performance warnings including risks and limitations")
        
        if 'testimonials_endorsements' in finding_types:
            recommendations.append("Include required testimonial disclosures: compensation, conflicts of interest, client status")
        
        if 'substantiation' in finding_types:
            recommendations.append("Remove unsubstantiated claims or provide proper evidence and documentation")
        
        if 'anti_fraud' in finding_types:
            recommendations.append("Remove potentially misleading statements and add appropriate risk disclosures")
        
        if 'third_party_ratings' in finding_types:
            recommendations.append("Add third-party rating disclosures: date, period, source, compensation")
        
        # Add general recommendations
        if findings:
            recommendations.append("Consult with compliance counsel to review all marketing materials")
            recommendations.append("Maintain proper documentation and records for all marketing materials")
        
        return recommendations

# Global instance
compliance_engine = SECComplianceEngine()

async def analyze_document(file_path: str, document_type: str = "advertisement") -> Dict[str, Any]:
    """Convenience function for document analysis"""
    return await compliance_engine.analyze_document(file_path, document_type) 