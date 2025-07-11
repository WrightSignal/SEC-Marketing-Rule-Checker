import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DocumentTextIcon, HomeIcon, FolderIcon } from '@heroicons/react/24/outline';

const Header = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <DocumentTextIcon className="h-8 w-8 text-primary-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                SEC Marketing Rule Checker
              </h1>
              <p className="text-sm text-gray-600">
                Ensure compliance with SEC Rule 206(4)-1
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex space-x-1">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/')
                  ? 'bg-primary-100 text-primary-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <HomeIcon className="h-4 w-4" />
              <span>Upload</span>
            </Link>
            <Link
              to="/documents"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/documents')
                  ? 'bg-primary-100 text-primary-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <FolderIcon className="h-4 w-4" />
              <span>Documents</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 