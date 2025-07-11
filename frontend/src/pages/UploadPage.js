import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  CloudArrowUpIcon, 
  DocumentIcon, 
  CheckCircleIcon, 
  ExclamationCircleIcon,
  XCircleIcon,
  InformationCircleIcon 
} from '@heroicons/react/24/outline';

const UploadPage = () => {
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentType, setDocumentType] = useState('advertisement');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a PDF, Word document, or text file.');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File size must be less than 10MB.');
      return;
    }
    
    setError(null);
    setSelectedFile(file);
    setAnalysisResult(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setUploading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('document_type', documentType);
    
    try {
      const response = await axios.post('/upload-document/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setAnalysisResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const getComplianceStatusColor = (status) => {
    switch (status) {
      case 'compliant':
        return 'success';
      case 'needs_review':
        return 'warning';
      case 'non_compliant':
        return 'danger';
      default:
        return 'primary';
    }
  };

  const getComplianceStatusIcon = (status) => {
    switch (status) {
      case 'compliant':
        return <CheckCircleIcon className="h-6 w-6" />;
      case 'needs_review':
        return <ExclamationCircleIcon className="h-6 w-6" />;
      case 'non_compliant':
        return <XCircleIcon className="h-6 w-6" />;
      default:
        return <InformationCircleIcon className="h-6 w-6" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'text-danger-700 bg-danger-50 border-danger-200';
      case 'medium':
        return 'text-warning-700 bg-warning-50 border-warning-200';
      case 'low':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          SEC Marketing Rule Compliance Checker
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Upload your marketing documents, RFPs, or advertisements to verify compliance 
          with SEC Marketing Rule 206(4)-1 requirements.
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Upload Document</h2>
        
        {/* Document Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Document Type
          </label>
          <select
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="advertisement">Advertisement</option>
            <option value="rfp">Request for Proposal (RFP)</option>
            <option value="rfi">Request for Information (RFI)</option>
            <option value="marketing_material">Marketing Material</option>
            <option value="presentation">Presentation</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* File Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
            dragActive
              ? 'border-primary-400 bg-primary-50'
              : selectedFile
              ? 'border-success-300 bg-success-50'
              : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.docx,.doc,.txt"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          {selectedFile ? (
            <div className="flex items-center justify-center space-x-3">
              <DocumentIcon className="h-8 w-8 text-success-600" />
              <div>
                <p className="text-lg font-medium text-success-800">{selectedFile.name}</p>
                <p className="text-sm text-success-600">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          ) : (
            <div>
              <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-lg font-medium text-gray-900">
                Drop your document here, or click to browse
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Supports PDF, Word documents, and text files (max 10MB)
              </p>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-danger-50 border border-danger-200 rounded-lg">
            <div className="flex items-center">
              <XCircleIcon className="h-5 w-5 text-danger-500 mr-2" />
              <p className="text-danger-700">{error}</p>
            </div>
          </div>
        )}

        {/* Upload Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
              selectedFile && !uploading
                ? 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-4 focus:ring-primary-200'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {uploading ? 'Analyzing Document...' : 'Analyze Compliance'}
          </button>
        </div>
      </div>

      {/* Analysis Results */}
      {analysisResult && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Analysis Results</h2>
            <button
              onClick={() => navigate(`/documents/${analysisResult.id}`)}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              View Details →
            </button>
          </div>

          {/* Compliance Score */}
          <div className={`mb-6 p-4 rounded-lg border ${
            getComplianceStatusColor(analysisResult.analysis?.compliance_status) === 'success'
              ? 'bg-success-50 border-success-200'
              : getComplianceStatusColor(analysisResult.analysis?.compliance_status) === 'warning'
              ? 'bg-warning-50 border-warning-200'
              : 'bg-danger-50 border-danger-200'
          }`}>
            <div className="flex items-center space-x-3">
              <div className={`${
                getComplianceStatusColor(analysisResult.analysis?.compliance_status) === 'success'
                  ? 'text-success-600'
                  : getComplianceStatusColor(analysisResult.analysis?.compliance_status) === 'warning'
                  ? 'text-warning-600'
                  : 'text-danger-600'
              }`}>
                {getComplianceStatusIcon(analysisResult.analysis?.compliance_status)}
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  Compliance Score: {analysisResult.analysis?.overall_score?.toFixed(1)}%
                </h3>
                <p className="text-sm capitalize">
                  Status: {analysisResult.analysis?.compliance_status?.replace('_', ' ')}
                </p>
              </div>
            </div>
          </div>

          {/* Key Findings */}
          {analysisResult.analysis?.findings?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Findings</h3>
              <div className="space-y-3">
                {analysisResult.analysis.findings.slice(0, 3).map((finding, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${getSeverityColor(finding.severity)}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium capitalize">
                          {finding.rule_type?.replace('_', ' ')}
                        </p>
                        <p className="text-sm mt-1">{finding.description}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded capitalize ${
                        finding.severity === 'high'
                          ? 'bg-danger-100 text-danger-800'
                          : finding.severity === 'medium'
                          ? 'bg-warning-100 text-warning-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {finding.severity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {analysisResult.analysis.findings.length > 3 && (
                <p className="mt-3 text-sm text-gray-600">
                  and {analysisResult.analysis.findings.length - 3} more findings...
                </p>
              )}
            </div>
          )}

          {/* Quick Recommendations */}
          {analysisResult.analysis?.recommendations?.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Recommendations</h3>
              <ul className="space-y-2">
                {analysisResult.analysis.recommendations.slice(0, 3).map((recommendation, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700">{recommendation}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadPage; 