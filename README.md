# SentinelScan

SentinelScan is a cybersecurity-focused web application designed to perform authorized security assessments of websites and web applications.

The system analyzes a target URL, performs a series of security checks, identifies potential security weaknesses, and generates findings and a security score.

> **Project Status:** 🚧 In Development

The core scanning backend and initial React frontend have been implemented. Additional security checks, reporting, authentication, and dashboard functionality are planned.

## Current Features

### Website Reachability Analysis

SentinelScan checks whether a supplied website can be successfully reached before performing further analysis.

### HTTPS Analysis

The application analyzes HTTPS usage to help identify websites that may be operating without secure transport.

### HTTP Security Header Analysis

SentinelScan examines security-related HTTP headers and identifies missing or potentially weak security configurations.

### Security Findings

Detected issues are converted into structured security findings that can be presented to the user.

### Security Scoring

The application includes scoring logic for converting scan results into an overall security assessment.

### URL Validation & SSRF Protection

Target URLs are validated before scanning.

The backend includes IP-address validation using `ipaddr.js` as part of the application's protection against unsafe or unauthorized requests to private/internal network resources.

## Architecture

The backend separates the scanning process into dedicated components:

```text
Request
   ↓
Routes
   ↓
Controller
   ↓
Scan Service
   ↓
Security Scanners
   ├── Reachability Scanner
   ├── HTTPS Scanner
   └── Header Scanner
   ↓
Finding Service
   ↓
Score Service
   ↓
Scan Results
```

This modular architecture allows additional security scanners to be added as the project develops.

## Technology Stack

### Frontend

- React
- Vite
- JavaScript
- CSS

### Backend

- Node.js
- Express.js
- PostgreSQL
- Axios
- ipaddr.js
- CORS
- dotenv

### Development Tools

- Visual Studio Code
- Postman
- DBeaver
- Git
- GitHub

## Project Structure

```text
SentinelScan/
├── backend/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── routes/
│       ├── scanners/
│       ├── services/
│       └── utils/
│
├── frontend/
│   ├── public/
│   └── src/
│
├── .env.example
├── .gitignore
└── README.md
```

## Current Security Scanners

### Reachability Scanner

Determines whether the supplied target is reachable and capable of responding to the assessment.

### HTTPS Scanner

Analyzes whether the target website uses HTTPS.

### Header Scanner

Examines HTTP response headers for security-related configuration.

## Getting Started

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

## Environment Configuration

Create a `.env` file inside the backend directory using the variables shown in `.env.example`.

Never commit database credentials or other secrets to the repository.

## Development Roadmap

Planned development includes:

- Additional HTTP security checks
- Expanded security-header analysis
- Improved security scoring
- Scan history
- Persistent scan results
- User authentication
- Security dashboard
- Detailed vulnerability explanations
- Remediation recommendations
- Report generation
- Improved frontend visualization
- Additional SSRF protections
- Scan rate limiting
- Security assessment history

## Ethical Use

SentinelScan is intended for educational purposes and authorized security testing.

Users should only scan systems they own or have explicit permission to assess.

The project is not intended for unauthorized access, exploitation, or malicious activity.

## Purpose

SentinelScan was created to explore practical cybersecurity concepts through full-stack software development, including web security analysis, secure URL handling, modular scanner architecture, risk scoring, and security-focused backend design.

## Author

**Abdirahman Abdullahi**

Full-Stack Developer

---

This project is under active development. Security checks and scoring logic will continue to evolve as additional functionality is implemented.