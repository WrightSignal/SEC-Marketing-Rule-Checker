import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeftIcon,
  DocumentIcon, 
  CheckCircleIcon, 
  ExclamationCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  CalendarIcon,
  ChartBarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const DocumentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDocument();
  }, [id]);

  const fetchDocument = async () => {
    try {
      const response = await axios.get(`/documents/${id}`);
      setDocument(response.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Document not found.');
      } else {
        setError('Failed to load document. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getComplianceStatusIcon = (status) => {
    switch (status) {
      case 'compliant':
        return <CheckCircleIcon className="h-8 w-8 text-success-600" />;
      case 'needs_review':
        return <ExclamationCircleIcon className="h-8 w-8 text-warning-600" />;
      case 'non_compliant':
        return <XCircleIcon className="h-8 w-8 text-danger-600" />;
      default:
        return <InformationCircleIcon className="h-8 w-8 text-gray-400" />;
    }
  };

  const getComplianceStatusColor = (status) => {
    switch (status) {
      case 'compliant':
        return 'bg-success-50 border-success-200 text-success-800';
      case 'needs_review':
        return 'bg-warning-50 border-warning-200 text-warning-800';
      case 'non_compliant':
        return 'bg-danger-50 border-danger-200 text-danger-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
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

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high':
        return <XCircleIcon className="h-5 w-5 text-danger-600" />;
      case 'medium':
        return <ExclamationTriangleIcon className="h-5 w-5 text-warning-600" />;
      case 'low':
        return <InformationCircleIcon className="h-5 w-5 text-blue-600" />;
      default:
        return <InformationCircleIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-success-600';
    if (score >= 70) return 'text-warning-600';
    return 'text-danger-600';
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading document details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <XCircleIcon className="h-12 w-12 text-danger-500 mx-auto mb-4" />
          <p className="text-danger-700 mb-4">{error}</p>
          <div className="space-x-4">
            <button
              onClick={() => navigate('/documents')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Back to Documents
            </button>
            <button
              onClick={fetchDocument}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/documents"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeftIcon className="flex-shrink-0 -ml-1 mr-1 h-5 w-5" />
          Back to Documents
        </Link>
        
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <DocumentIcon className="h-8 w-8 text-primary-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{document.filename}</h1>
              <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize bg-gray-100 text-gray-800">
                  {document.document_type.replace('_', ' ')}
                </span>
                <div className="flex items-center">
                  <CalendarIcon className="flex-shrink-0 mr-1.5 h-4 w-4" />
                  Uploaded {formatDate(document.uploaded_at)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Results */}
      {document.analysis ? (
        <div className="space-y-8">
          {/* Compliance Score Overview */}
          <div className={`rounded-xl border-2 p-6 ${getComplianceStatusColor(document.analysis.compliance_status)}`}>
            <div className="flex items-center space-x-4">
              {getComplianceStatusIcon(document.analysis.compliance_status)}
              <div className="flex-1">
                <div className="flex items-center space-x-4">
                  <div>
                    <h2 className="text-2xl font-bold">
                      Overall Compliance Score
                    </h2>
                    <p className="text-lg capitalize">
                      Status: {document.analysis.compliance_status.replace('_', ' ')}
                    </p>
                  </div>
                  <div className={`text-4xl font-bold ${getScoreColor(document.analysis.overall_score)}`}>
                    {document.analysis.overall_score.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Document Statistics */}
          {document.analysis.document_stats && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <ChartBarIcon className="h-6 w-6 mr-2" />
                Document Statistics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {document.analysis.document_stats.word_count || 0}
                  </div>
                  <div className="text-sm text-gray-600">Words</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {document.analysis.document_stats.page_count || 0}
                  </div>
                  <div className="text-sm text-gray-600">Pages</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {document.analysis.findings?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Findings</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 capitalize">
                    {document.analysis.document_stats.format || 'Unknown'}
                  </div>
                  <div className="text-sm text-gray-600">Format</div>
                </div>
              </div>
            </div>
          )}

          {/* Detailed Findings */}
          {document.analysis.findings && document.analysis.findings.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Compliance Findings ({document.analysis.findings.length})
              </h3>
              <div className="space-y-4">
                {document.analysis.findings.map((finding, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg p-4 ${getSeverityColor(finding.severity)}`}
                  >
                    <div className="flex items-start space-x-3">
                      {getSeverityIcon(finding.severity)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold capitalize">
                            {finding.rule_type?.replace('_', ' ')} Issue
                          </h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded uppercase ${
                            finding.severity === 'high'
                              ? 'bg-danger-100 text-danger-800'
                              : finding.severity === 'medium'
                              ? 'bg-warning-100 text-warning-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {finding.severity} Priority
                          </span>
                        </div>
                        <p className="text-sm mb-3">{finding.description}</p>
                        
                        {finding.location && (
                          <div className="mb-3 p-2 bg-white bg-opacity-50 rounded text-xs font-mono text-gray-700">
                            <strong>Location:</strong> {finding.location}
                          </div>
                        )}
                        
                        {finding.suggestion && (
                          <div className="bg-white bg-opacity-50 rounded p-3">
                            <strong className="text-sm font-medium">Recommendation:</strong>
                            <p className="text-sm mt-1">{finding.suggestion}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {document.analysis.recommendations && document.analysis.recommendations.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Compliance Recommendations
              </h3>
              <div className="space-y-3">
                {document.analysis.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <p className="text-sm text-gray-700 flex-1">{recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analysis Timestamp */}
          <div className="text-center text-sm text-gray-500">
            Analysis completed on {formatDate(document.analysis.analyzed_at)}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <DocumentIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis Available</h3>
          <p className="text-gray-600">
            This document hasn't been analyzed yet or the analysis failed.
          </p>
        </div>
      )}
    </div>
  );
};

export default DocumentDetailPage; 