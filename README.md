# SEC Marketing Rule Checker

A comprehensive web application for analyzing marketing documents and ensuring compliance with SEC Marketing Rule 206(4)-1. This tool helps investment advisors verify that their advertisements, RFPs, RFIs, and other marketing materials meet regulatory requirements.

## Features

### 🔍 **Document Analysis**
- **Multi-format Support**: Upload PDF, Word documents (.docx), and text files
- **Comprehensive Compliance Checking**: Analyzes documents against key SEC Marketing Rule requirements
- **Real-time Processing**: Get instant compliance feedback upon upload

### 📊 **Compliance Categories**
- **Performance Advertising**: Checks for proper time periods, anti-cherry-picking compliance, and required disclosures
- **Hypothetical Performance**: Ensures proper warnings and risk disclosures are present
- **Testimonials & Endorsements**: Verifies required compensation and conflict of interest disclosures
- **Substantiation**: Identifies unsubstantiated claims and ensures proper evidence documentation
- **Anti-Fraud**: Detects potentially misleading statements and ensures appropriate risk disclosures
- **Third-Party Ratings**: Checks for proper rating disclosures (date, source, compensation)

### 🎯 **Smart Scoring System**
- **Overall Compliance Score**: 0-100% rating based on findings severity
- **Severity Levels**: High, medium, and low priority findings
- **Status Categories**: Compliant (85%+), Needs Review (70-84%), Non-Compliant (<70%)

### 💡 **Actionable Insights**
- **Detailed Findings**: Specific compliance issues with context and location
- **Expert Recommendations**: Actionable steps to improve compliance
- **Document Statistics**: Word count, page count, and format information

### 🏢 **Professional Interface**
- **Modern UI**: Clean, professional design built with React and Tailwind CSS
- **Document Library**: View and manage all uploaded documents
- **Detailed Reports**: Comprehensive analysis results with export capabilities
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Technology Stack

### Backend
- **FastAPI**: High-performance Python web framework
- **SQLAlchemy**: Database ORM with SQLite
- **PyPDF2**: PDF text extraction
- **python-docx**: Word document parsing
- **Custom NLP Engine**: Regex-based compliance pattern matching

### Frontend
- **React 18**: Modern JavaScript framework
- **Tailwind CSS**: Utility-first CSS framework
- **Heroicons**: Beautiful SVG icons
- **Axios**: HTTP client for API communication
- **React Router**: Client-side routing

## Installation & Setup

### Prerequisites
- Python 3.8+ 
- Node.js 14+
- npm or yarn

### Backend Setup

1. **Install Python Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Start the Backend Server**
   ```bash
   cd backend
   python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

   The backend API will be available at `http://localhost:8000`

### Frontend Setup

1. **Install Node Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start the Frontend Development Server**
   ```bash
   npm start
   ```

   The frontend will be available at `http://localhost:3000`

## Quick Start

1. **Start Both Servers**
   - Backend: `cd backend && python -m uvicorn main:app --reload`
   - Frontend: `cd frontend && npm start`

2. **Access the Application**
   - Open your browser to `http://localhost:3000`

3. **Upload a Document**
   - Click "Upload Document" or drag and drop a file
   - Select the document type (Advertisement, RFP, RFI, etc.)
   - Click "Analyze Compliance"

4. **Review Results**
   - View your compliance score and status
   - Review detailed findings and recommendations
   - Access full analysis from the Documents page

## API Documentation

The backend provides a RESTful API with the following endpoints:

### Document Upload
```http
POST /upload-document/
Content-Type: multipart/form-data

Form Data:
- file: Document file (PDF, DOCX, TXT)
- document_type: Type of document (advertisement, rfp, rfi, etc.)
```

### Get All Documents
```http
GET /documents/
```

### Get Specific Document
```http
GET /documents/{document_id}
```

### Health Check
```http
GET /health
```

Full API documentation is available at `http://localhost:8000/docs` when the backend is running.

## SEC Marketing Rule Compliance

This tool checks compliance with SEC Marketing Rule 206(4)-1, which includes:

### Key Requirements Analyzed
1. **Performance Advertising Standards**
   - Standardized time periods (1, 5, 10 years, inception)
   - Net fee disclosures
   - Past performance disclaimers

2. **Hypothetical Performance Rules**
   - Clear hypothetical labels
   - Risk and limitation warnings
   - Proper substantiation

3. **Testimonial & Endorsement Requirements**
   - Compensation disclosures
   - Conflict of interest statements
   - Client vs. non-client identification

4. **Substantiation Requirements**
   - Evidence for performance claims
   - Documentation for awards/rankings
   - Prohibition of unsubstantiated statements

5. **Anti-Fraud Provisions**
   - No misleading statements
   - Appropriate risk disclosures
   - Clear, non-deceptive language

## Legal Disclaimer

⚠️ **IMPORTANT**: This tool provides automated analysis for educational and preliminary review purposes only. It does not constitute legal advice and should not replace consultation with qualified compliance counsel. The SEC Marketing Rule is complex and subject to interpretation. Always consult with legal professionals before finalizing any marketing materials.

## File Structure

```
SEC-Marketing-Rule-Checker/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── models.py              # Database models
│   ├── schemas.py             # Pydantic schemas
│   ├── database.py            # Database configuration
│   ├── document_parser.py     # Document text extraction
│   ├── compliance_engine.py   # SEC compliance analysis
│   └── __init__.py
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js
│   │   │   └── Footer.js
│   │   ├── pages/
│   │   │   ├── UploadPage.js
│   │   │   ├── DocumentsPage.js
│   │   │   └── DocumentDetailPage.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
├── requirements.txt
└── README.md
```

## Contributing

This is a compliance tool designed to assist with SEC Marketing Rule analysis. When contributing:

1. Ensure accuracy of compliance rules
2. Test thoroughly with various document types
3. Maintain professional code standards
4. Update documentation for any rule changes

## Support

For technical issues or compliance questions:
- Review the SEC Marketing Rule documentation
- Consult with qualified compliance counsel
- Check the API documentation at `/docs`

## License

This project is created for educational and professional compliance assistance purposes. Always verify compliance requirements with legal counsel.

---

**Built for compliance professionals by compliance professionals** 🛡️ 