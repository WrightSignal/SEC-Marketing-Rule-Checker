import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  DocumentIcon, 
  CheckCircleIcon, 
  ExclamationCircleIcon,
  XCircleIcon,
  EyeIcon,
  CalendarIcon,
  FolderIcon
} from '@heroicons/react/24/outline';

const DocumentsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get('/documents/');
      setDocuments(response.data);
    } catch (err) {
      setError('Failed to load documents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getComplianceStatusIcon = (status) => {
    switch (status) {
      case 'compliant':
        return <CheckCircleIcon className="h-5 w-5 text-success-600" />;
      case 'needs_review':
        return <ExclamationCircleIcon className="h-5 w-5 text-warning-600" />;
      case 'non_compliant':
        return <XCircleIcon className="h-5 w-5 text-danger-600" />;
      default:
        return <DocumentIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getComplianceStatusBadge = (status) => {
    switch (status) {
      case 'compliant':
        return 'bg-success-100 text-success-800 border-success-200';
      case 'needs_review':
        return 'bg-warning-100 text-warning-800 border-warning-200';
      case 'non_compliant':
        return 'bg-danger-100 text-danger-800 border-danger-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading documents...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <XCircleIcon className="h-12 w-12 text-danger-500 mx-auto mb-4" />
          <p className="text-danger-700">{error}</p>
          <button
            onClick={fetchDocuments}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Document Library</h1>
          <p className="mt-2 text-gray-600">
            View and manage your uploaded documents and compliance analyses
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Upload New Document
        </Link>
      </div>

      {/* Documents Count */}
      <div className="mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <FolderIcon className="h-8 w-8 text-primary-600 mr-3" />
            <div>
              <p className="text-2xl font-semibold text-gray-900">{documents.length}</p>
              <p className="text-sm text-gray-600">Total Documents</p>
            </div>
          </div>
        </div>
      </div>

      {/* Documents List */}
      {documents.length === 0 ? (
        <div className="text-center py-12">
          <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No documents</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by uploading your first document.
          </p>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Upload Document
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-4">
              {documents.map((document) => (
                <div
                  key={document.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      {/* Document Icon & Status */}
                      <div className="flex-shrink-0">
                        {getComplianceStatusIcon(document.analysis?.compliance_status)}
                      </div>

                      {/* Document Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-medium text-gray-900 truncate">
                            {document.filename}
                          </h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize bg-gray-100 text-gray-800">
                            {document.document_type.replace('_', ' ')}
                          </span>
                        </div>
                        
                        <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <CalendarIcon className="flex-shrink-0 mr-1.5 h-4 w-4" />
                            {formatDate(document.uploaded_at)}
                          </div>
                        </div>
                      </div>

                      {/* Compliance Score & Status */}
                      {document.analysis && (
                        <div className="flex-shrink-0 text-right">
                          <div className="text-2xl font-bold text-gray-900">
                            {document.analysis.overall_score?.toFixed(0)}%
                          </div>
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${getComplianceStatusBadge(document.analysis.compliance_status)}`}>
                            {document.analysis.compliance_status?.replace('_', ' ')}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* View Button */}
                    <div className="flex-shrink-0 ml-4">
                      <Link
                        to={`/documents/${document.id}`}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        <EyeIcon className="h-4 w-4 mr-1" />
                        View
                      </Link>
                    </div>
                  </div>

                  {/* Quick Preview of Findings */}
                  {document.analysis?.findings?.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          {document.analysis.findings.length} compliance findings
                        </span>
                        <div className="flex space-x-2">
                          {document.analysis.findings.filter(f => f.severity === 'high').length > 0 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-danger-100 text-danger-800">
                              {document.analysis.findings.filter(f => f.severity === 'high').length} High
                            </span>
                          )}
                          {document.analysis.findings.filter(f => f.severity === 'medium').length > 0 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning-100 text-warning-800">
                              {document.analysis.findings.filter(f => f.severity === 'medium').length} Medium
                            </span>
                          )}
                          {document.analysis.findings.filter(f => f.severity === 'low').length > 0 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {document.analysis.findings.filter(f => f.severity === 'low').length} Low
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsPage; 