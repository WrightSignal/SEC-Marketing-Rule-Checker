import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Disclaimer Section */}
        <div className="bg-yellow-900 bg-opacity-20 border border-yellow-600 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <ExclamationTriangleIcon className="h-6 w-6 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-100 mb-2">
                Important Legal Disclaimer
              </h3>
              <p className="text-yellow-200 text-sm leading-relaxed">
                This tool provides automated analysis for educational and preliminary review purposes only. 
                It does not constitute legal advice and should not replace consultation with qualified compliance 
                counsel. The SEC Marketing Rule is complex and subject to interpretation. Always consult with 
                legal professionals before finalizing any marketing materials.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-300 text-sm">
                © 2024 SEC Marketing Rule Checker. Built for compliance professionals.
              </p>
              <p className="text-gray-400 text-xs mt-1">
                SEC Rule 206(4)-1 compliance analysis tool
              </p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-xs">
                Version 1.0.0 | Last updated: {new Date().toLocaleDateString()}
              </p>
              <p className="text-gray-400 text-xs mt-1">
                For compliance questions, consult your legal counsel
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 