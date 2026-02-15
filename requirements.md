# BharatSetu - Requirements Document

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)

**Project:** BharatSetu - AI-Powered Citizen Empowerment Platform  
**Version:** 1.0  
**Date:** February 2026  
**Target:** AWS Hackathon Submission

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Functional Requirements](#functional-requirements)
3. [Non-Functional Requirements](#non-functional-requirements)
4. [Technical Requirements](#technical-requirements)
5. [User Requirements](#user-requirements)
6. [Security Requirements](#security-requirements)
7. [Performance Requirements](#performance-requirements)
8. [Constraints and Assumptions](#constraints-and-assumptions)

---

## Project Overview

### Vision Statement

BharatSetu aims to democratize access to critical information and public services for Indian citizens through AI-powered tools, addressing gaps in health literacy, civic awareness, legal rights, and women's health education.

### Problem Statement

- **Health Literacy:** Only 33% of Indian consumers check nutrition facts on product labels [FSSAI, 2013]
- **Civic Issues:** 157 million Indians still practice open defecation despite infrastructure efforts [UNICEF, 2022]
- **Legal Awareness:** Majority of Indians are unaware of fundamental legal rights [India Justice Report, 2023]
- **Women's Health:** Only 48% of adolescent girls knew about menstruation before menarche [IJCM, 2016]
- **Medical Literacy:** 39% of patients cannot correctly interpret standard lab reports [JMS, 2021]

### Solution Approach

Five integrated AI-powered modules providing multilingual, accessible, privacy-first services to empower citizens with knowledge and tools for better decision-making.

---

## Functional Requirements

### FR1: Product Label Auditor (Label Padhega India)

#### FR1.1 Input Processing
- **FR1.1.1** System SHALL accept product label images in JPG, PNG, JPEG formats
- **FR1.1.2** System SHALL support image uploads up to 10 MB
- **FR1.1.3** System SHALL accept user health conditions via text or voice input
- **FR1.1.4** System SHALL support Hindi, English, and Hinglish language inputs

#### FR1.2 Analysis Features
- **FR1.2.1** System SHALL extract text from product labels using OCR technology
- **FR1.2.2** System SHALL identify product name, ingredients, nutritional values, and additives
- **FR1.2.3** System SHALL compare nutritional values against FSSAI and WHO standards
- **FR1.2.4** System SHALL generate personalized health alerts based on user conditions
- **FR1.2.5** System SHALL flag false or misleading product claims

#### FR1.3 Output Generation
- **FR1.3.1** System SHALL display nutritional analysis in text format
- **FR1.3.2** System SHALL generate bar charts showing per 100g nutritional content
- **FR1.3.3** System SHALL provide audio output in user's preferred language
- **FR1.3.4** System SHALL highlight health flags (high sugar, sodium, trans-fat)
- **FR1.3.5** System SHALL provide educational content about misleading products

#### FR1.4 Data Management
- **FR1.4.1** System SHALL store anonymous analysis history without PII
- **FR1.4.2** System SHALL delete uploaded images after processing
- **FR1.4.3** System SHALL maintain aggregate statistics for product categories

---

### FR2: CivicSense (Awareness & Reporting)

#### FR2.1 Input Processing
- **FR2.1.1** System SHALL accept civic issue descriptions via text or voice
- **FR2.1.2** System SHALL accept image or video proof of civic issues
- **FR2.1.3** System SHALL capture user location via browser geolocation API
- **FR2.1.4** System SHALL detect input language automatically

#### FR2.2 Issue Processing
- **FR2.2.1** System SHALL identify issue type (garbage disposal, pothole, streetlight, etc.)
- **FR2.2.2** System SHALL determine issue urgency level
- **FR2.2.3** System SHALL map location and issue type to appropriate municipal authority
- **FR2.2.4** System SHALL generate professional complaint message with all details

#### FR2.3 Authority Resolution
- **FR2.3.1** System SHALL maintain database of municipal authorities by city and issue type
- **FR2.3.2** System SHALL provide multiple submission channels (WhatsApp, email, portal, phone)
- **FR2.3.3** System SHALL show expected response time for each authority
- **FR2.3.4** System SHALL provide escalation contact if no response received

#### FR2.4 Complaint Management
- **FR2.4.1** System SHALL format complaints suitable for email submission
- **FR2.4.2** System SHALL format complaints suitable for WhatsApp messaging
- **FR2.4.3** System SHALL generate pre-filled web portal links where supported
- **FR2.4.4** System SHALL track complaint submission status anonymously

---

### FR3: Document Jargon & Legal/Financial Rights Assistant

#### FR3.1 Document Processing
- **FR3.1.1** System SHALL accept PDF, DOC, DOCX, and image formats
- **FR3.1.2** System SHALL extract text from scanned documents using OCR
- **FR3.1.3** System SHALL simplify complex legal and bureaucratic language
- **FR3.1.4** System SHALL translate simplified content to regional languages

#### FR3.2 Rights Information
- **FR3.2.1** System SHALL maintain database of 50-100 common legal scenarios
- **FR3.2.2** System SHALL provide conversational answers about legal rights
- **FR3.2.3** System SHALL cite source laws and acts with section numbers
- **FR3.2.4** System SHALL support fuzzy matching for user queries

#### FR3.3 RAG Implementation
- **FR3.3.1** System SHALL implement vector search over legal documents
- **FR3.3.2** System SHALL retrieve relevant legal text chunks for user queries
- **FR3.3.3** System SHALL generate plain-language explanations with citations
- **FR3.3.4** System SHALL maintain embeddings of Indian legal documents

#### FR3.4 Interactive Features
- **FR3.4.1** System SHALL allow follow-up questions on simplified documents
- **FR3.4.2** System SHALL generate step-by-step action checklists
- **FR3.4.3** System SHALL provide links to relevant government forms
- **FR3.4.4** System SHALL offer downloadable simplified document summaries

---

### FR4: Lab Report Analyzer

#### FR4.1 Terms and Disclaimers
- **FR4.1.1** System SHALL display mandatory disclaimer before feature access
- **FR4.1.2** System SHALL require explicit user acceptance of terms
- **FR4.1.3** System SHALL clearly state tool is educational, not diagnostic
- **FR4.1.4** System SHALL display persistent disclaimers throughout analysis

#### FR4.2 Input Collection
- **FR4.2.1** System SHALL accept lab reports in PDF, JPG, PNG, DOC formats
- **FR4.2.2** System SHALL collect user age, gender, and optional health conditions
- **FR4.2.3** System SHALL extract lab values using OCR technology
- **FR4.2.4** System SHALL allow user verification and correction of extracted values

#### FR4.3 Analysis Features
- **FR4.3.1** System SHALL compare lab values against WHO/ICMR reference ranges
- **FR4.3.2** System SHALL adjust reference ranges based on age and gender
- **FR4.3.3** System SHALL generate general diet and lifestyle suggestions
- **FR4.3.4** System SHALL use India-specific food recommendations

#### FR4.4 Visualization
- **FR4.4.1** System SHALL display bar charts comparing user values to healthy ranges
- **FR4.4.2** System SHALL use color coding (Green: normal, Yellow: borderline, Red: concerning)
- **FR4.4.3** System SHALL provide simple explanations for each test
- **FR4.4.4** System SHALL generate downloadable summary reports

#### FR4.5 Safety Features
- **FR4.5.1** System SHALL detect critical lab values and display urgent warnings
- **FR4.5.2** System SHALL recommend emergency services (108) for critical cases
- **FR4.5.3** System SHALL rate limit to 5 reports per hour per device
- **FR4.5.4** System SHALL process all data in-memory with zero permanent storage

---

### FR5: GynaeCare Women's Health Module

#### FR5.1 Privacy and Access
- **FR5.1.1** System SHALL provide completely anonymous chat interface
- **FR5.1.2** System SHALL require acceptance of privacy terms before use
- **FR5.1.3** System SHALL not require login or personal identification
- **FR5.1.4** System SHALL state age appropriateness (10+ years)

#### FR5.2 Knowledge Modules
- **FR5.2.1** System SHALL provide information on menstrual health and hygiene
- **FR5.2.2** System SHALL provide PCOS awareness and management information
- **FR5.2.3** System SHALL provide basic pregnancy and postnatal care information
- **FR5.2.4** System SHALL provide general women's wellness information

#### FR5.3 Interactive Features
- **FR5.3.1** System SHALL offer myth-busting quiz with educational content
- **FR5.3.2** System SHALL provide PCOS symptom checker with recommendations
- **FR5.3.3** System SHALL offer period tracker with local storage only
- **FR5.3.4** System SHALL provide curated resource library (articles, videos)

#### FR5.4 Conversational AI
- **FR5.4.1** System SHALL implement RAG-based question answering
- **FR5.4.2** System SHALL provide age-appropriate responses (10-14, 15-25, 25-40)
- **FR5.4.3** System SHALL support text and voice input in Hindi/English
- **FR5.4.4** System SHALL always include disclaimer to consult healthcare provider

#### FR5.5 Safety Features
- **FR5.5.1** System SHALL detect emergency keywords and display urgent warnings
- **FR5.5.2** System SHALL block queries about abortion pills and sex determination
- **FR5.5.3** System SHALL provide helpline numbers (Medical: 108, Women: 181)
- **FR5.5.4** System SHALL log zero conversation data permanently

---

## Non-Functional Requirements

### NFR1: Usability

#### NFR1.1 User Interface
- **NFR1.1.1** System SHALL provide responsive web interface for desktop and mobile browsers
- **NFR1.1.2** System SHALL load initial page within 3 seconds on 4G connection
- **NFR1.1.3** System SHALL support screen readers for accessibility
- **NFR1.1.4** System SHALL provide consistent navigation across all features

#### NFR1.2 Language Support
- **NFR1.2.1** System SHALL support Hindi, English, and major regional languages
- **NFR1.2.2** System SHALL auto-detect user language where possible
- **NFR1.2.3** System SHALL provide language toggle option in UI
- **NFR1.2.4** System SHALL maintain consistent terminology across languages

#### NFR1.3 User Experience
- **NFR1.3.1** System SHALL provide clear error messages in user's language
- **NFR1.3.2** System SHALL show processing indicators during AI operations
- **NFR1.3.3** System SHALL minimize number of clicks to complete tasks
- **NFR1.3.4** System SHALL provide contextual help and tooltips

---

### NFR2: Reliability

#### NFR2.1 Availability
- **NFR2.1.1** System SHALL maintain 95% uptime during working hours (9 AM - 9 PM IST)
- **NFR2.1.2** System SHALL handle graceful degradation if AI services are unavailable
- **NFR2.1.3** System SHALL implement fallback mechanisms (Gemini → Groq)
- **NFR2.1.4** System SHALL recover from failures within 5 minutes

#### NFR2.2 Error Handling
- **NFR2.2.1** System SHALL log all errors for debugging without storing user data
- **NFR2.2.2** System SHALL provide meaningful error messages to users
- **NFR2.2.3** System SHALL prevent data loss during processing errors
- **NFR2.2.4** System SHALL validate all user inputs before processing

---

### NFR3: Scalability

#### NFR3.1 Performance Targets
- **NFR3.1.1** System SHALL support minimum 100 concurrent users
- **NFR3.1.2** System SHALL scale horizontally on Render.com infrastructure
- **NFR3.1.3** System SHALL process image OCR within 5-10 seconds
- **NFR3.1.4** System SHALL generate AI responses within 3-5 seconds

#### NFR3.2 Resource Optimization
- **NFR3.2.1** System SHALL use client-side processing where possible
- **NFR3.2.2** System SHALL cache static knowledge bases in memory
- **NFR3.2.3** System SHALL optimize API calls to stay within free tier limits
- **NFR3.2.4** System SHALL compress images before upload

---

### NFR4: Maintainability

#### NFR4.1 Code Quality
- **NFR4.1.1** System SHALL follow PEP 8 style guide for Python code
- **NFR4.1.2** System SHALL use ESLint for React code quality
- **NFR4.1.3** System SHALL maintain minimum 60% code documentation
- **NFR4.1.4** System SHALL separate concerns (frontend/backend/AI logic)

#### NFR4.2 Deployment
- **NFR4.2.1** System SHALL support automated deployment via Git push
- **NFR4.2.2** System SHALL maintain separate development and production environments
- **NFR4.2.3** System SHALL use environment variables for configuration
- **NFR4.2.4** System SHALL version all API endpoints

---

## Technical Requirements

### TR1: Frontend Technology

#### TR1.1 Core Framework
- **TR1.1.1** Frontend SHALL be built using React.js (version 18+)
- **TR1.1.2** Frontend SHALL use functional components with hooks
- **TR1.1.3** Frontend SHALL implement React Router for navigation
- **TR1.1.4** Frontend SHALL use Context API or Redux for state management

#### TR1.2 Libraries and Tools
- **TR1.2.1** System SHALL use Tesseract.js for client-side OCR
- **TR1.2.2** System SHALL use Web Speech API for voice input
- **TR1.2.3** System SHALL use Recharts or Chart.js for data visualization
- **TR1.2.4** System SHALL use Axios for API communication

#### TR1.3 Deployment
- **TR1.3.1** Frontend SHALL be deployed on Vercel free tier
- **TR1.3.2** Frontend SHALL support automatic HTTPS
- **TR1.3.3** Frontend SHALL use CDN for asset delivery
- **TR1.3.4** Frontend SHALL implement code splitting for optimization

---

### TR2: Backend Technology

#### TR2.1 Core Framework
- **TR2.1.1** Backend SHALL be built using FastAPI (Python 3.10+)
- **TR2.1.2** Backend SHALL use Uvicorn as ASGI server
- **TR2.1.3** Backend SHALL implement async/await patterns
- **TR2.1.4** Backend SHALL use Pydantic for request validation

#### TR2.2 AI/ML Integration
- **TR2.2.1** System SHALL integrate Google Gemini 1.5 Flash as primary LLM
- **TR2.2.2** System SHALL integrate Groq (Llama 3.1 70B) as fallback LLM
- **TR2.2.3** System SHALL use Google Cloud Vision API for OCR fallback
- **TR2.2.4** System SHALL use Google Translate API for language translation

#### TR2.3 Vector Database
- **TR2.3.1** System SHALL use ChromaDB for vector embeddings
- **TR2.3.2** System SHALL use all-MiniLM-L6-v2 for embedding generation
- **TR2.3.3** System SHALL implement RAG for Legal Rights and GynaeCare features
- **TR2.3.4** System SHALL persist ChromaDB to disk for data retention

#### TR2.4 Deployment
- **TR2.4.1** Backend SHALL be deployed on Render.com free tier (750 hours/month)
- **TR2.4.2** Backend SHALL implement automatic health checks
- **TR2.4.3** Backend SHALL support environment-based configuration
- **TR2.4.4** Backend SHALL log requests without storing sensitive data

---

### TR3: Database Technology

#### TR3.1 MongoDB Atlas
- **TR3.1.1** System SHALL use MongoDB Atlas free tier (512 MB)
- **TR3.1.2** System SHALL store anonymous analysis history
- **TR3.1.3** System SHALL store aggregate product and usage statistics
- **TR3.1.4** System SHALL implement indexes for query optimization

#### TR3.2 Firebase Firestore
- **TR3.2.1** System SHALL use Firestore free tier (1 GB, 50K reads/day)
- **TR3.2.2** System SHALL store temporary session data (24-hour max)
- **TR3.2.3** System SHALL store civic complaint tracking data anonymously
- **TR3.2.4** System SHALL implement automatic data expiry rules

#### TR3.3 Cloudinary
- **TR3.3.1** System SHALL use Cloudinary free tier (25 GB)
- **TR3.3.2** System SHALL store uploaded images temporarily
- **TR3.3.3** System SHALL delete images automatically after processing
- **TR3.3.4** System SHALL optimize images before storage

#### TR3.4 JSON Knowledge Bases
- **TR3.4.1** System SHALL maintain FSSAI nutritional standards in JSON format
- **TR3.4.2** System SHALL maintain authority database in JSON format
- **TR3.4.3** System SHALL maintain legal FAQ database in JSON format
- **TR3.4.4** System SHALL maintain medical reference ranges in JSON format

---

### TR4: API Requirements

#### TR4.1 RESTful Design
- **TR4.1.1** All APIs SHALL follow REST principles
- **TR4.1.2** APIs SHALL use standard HTTP methods (GET, POST, PUT, DELETE)
- **TR4.1.3** APIs SHALL return appropriate HTTP status codes
- **TR4.1.4** APIs SHALL use JSON for request and response payloads

#### TR4.2 Rate Limiting
- **TR4.2.1** System SHALL implement rate limiting per IP address
- **TR4.2.2** Lab Report Analyzer SHALL limit to 5 requests/hour per device
- **TR4.2.3** Product Label Auditor SHALL limit to 20 requests/hour per device
- **TR4.2.4** System SHALL return 429 status code when rate limit exceeded

#### TR4.3 API Documentation
- **TR4.3.1** System SHALL provide OpenAPI/Swagger documentation
- **TR4.3.2** System SHALL document all request/response schemas
- **TR4.3.3** System SHALL provide example requests for each endpoint
- **TR4.3.4** System SHALL document error responses

---

## User Requirements

### UR1: Target User Groups

#### UR1.1 Primary Users
- **UR1.1.1** Indian citizens aged 18-65 years
- **UR1.1.2** Urban and rural populations
- **UR1.1.3** Low to moderate digital literacy users
- **UR1.1.4** Hindi and regional language speakers

#### UR1.2 Secondary Users
- **UR1.2.1** Adolescent girls (10-17 years) for GynaeCare module
- **UR1.2.2** Elderly citizens requiring lab report understanding
- **UR1.2.3** Citizens requiring legal rights information
- **UR1.2.4** Civic-minded individuals reporting community issues

---

### UR2: User Capabilities

#### UR2.1 Device Access
- **UR2.1.1** Users SHALL access platform via modern web browsers
- **UR2.1.2** Users SHALL use desktop, tablet, or smartphone devices
- **UR2.1.3** Users SHALL have stable internet connection (2G minimum)
- **UR2.1.4** Users SHALL not require any software installation

#### UR2.2 Digital Literacy
- **UR2.2.1** Users SHALL be able to navigate web interfaces
- **UR2.2.2** Users SHALL be able to upload files via browser
- **UR2.2.3** Users MAY use voice input if unable to type
- **UR2.2.4** Users SHALL understand basic disclaimer concepts

---

## Security Requirements

### SR1: Data Privacy

#### SR1.1 Personal Data Protection
- **SR1.1.1** System SHALL NOT store raw lab reports permanently
- **SR1.1.2** System SHALL NOT store personally identifiable health information
- **SR1.1.3** System SHALL NOT store user conversations from GynaeCare
- **SR1.1.4** System SHALL comply with India's DPDP Act 2023

#### SR1.2 Anonymous Operation
- **SR1.2.1** System SHALL NOT require user login for any feature
- **SR1.2.2** System SHALL NOT collect names, emails, or phone numbers
- **SR1.2.3** System SHALL generate random session IDs without user tracking
- **SR1.2.4** System SHALL delete all session data within 24 hours

#### SR1.3 Data in Transit
- **SR1.3.1** System SHALL use HTTPS for all communications
- **SR1.3.2** System SHALL encrypt API requests and responses
- **SR1.3.3** System SHALL validate SSL certificates
- **SR1.3.4** System SHALL use secure WebSocket connections for real-time features

---

### SR2: Input Validation

#### SR2.1 File Upload Security
- **SR2.1.1** System SHALL validate file types before processing
- **SR2.1.2** System SHALL reject files larger than 10 MB
- **SR2.1.3** System SHALL scan uploads for malicious content
- **SR2.1.4** System SHALL sanitize file names

#### SR2.2 Text Input Security
- **SR2.2.1** System SHALL sanitize all user text inputs
- **SR2.2.2** System SHALL prevent SQL injection attacks
- **SR2.2.3** System SHALL prevent XSS attacks
- **SR2.2.4** System SHALL prevent prompt injection in AI queries

---

### SR3: Access Control

#### SR3.1 API Security
- **SR3.1.1** System SHALL use API keys for external service authentication
- **SR3.1.2** System SHALL store API keys in environment variables
- **SR3.1.3** System SHALL rotate API keys periodically
- **SR3.1.4** System SHALL implement CORS policies

#### SR3.2 Rate Limiting
- **SR3.2.1** System SHALL prevent brute force attacks via rate limiting
- **SR3.2.2** System SHALL block repeated failed validation attempts
- **SR3.2.3** System SHALL log suspicious activity patterns
- **SR3.2.4** System SHALL implement exponential backoff for retries

---

## Performance Requirements

### PR1: Response Time

#### PR1.1 Page Load Times
- **PR1.1.1** Homepage SHALL load within 2 seconds on 4G connection
- **PR1.1.2** Feature pages SHALL load within 3 seconds
- **PR1.1.3** Static assets SHALL be cached for 7 days
- **PR1.1.4** API responses SHALL complete within 5 seconds for 95% of requests

#### PR1.2 Processing Times
- **PR1.2.1** OCR processing SHALL complete within 5-10 seconds
- **PR1.2.2** AI response generation SHALL complete within 3-5 seconds
- **PR1.2.3** Chart rendering SHALL complete within 1 second
- **PR1.2.4** Voice-to-text conversion SHALL process in real-time

---

### PR2: Throughput

#### PR2.1 Concurrent Users
- **PR2.1.1** System SHALL support minimum 100 concurrent users
- **PR2.1.2** System SHALL queue requests during peak load
- **PR2.1.3** System SHALL maintain response times under load
- **PR2.1.4** System SHALL scale automatically on hosting platforms

#### PR2.2 API Limits
- **PR2.2.1** Gemini Flash SHALL handle 15 requests per minute
- **PR2.2.2** Groq fallback SHALL handle overflow traffic
- **PR2.2.3** Google Cloud Vision SHALL use 1000 requests per month budget
- **PR2.2.4** System SHALL optimize token usage to stay within free tiers

---

### PR3: Resource Utilization

#### PR3.1 Client-Side Processing
- **PR3.1.1** OCR SHALL process on client when possible to reduce server load
- **PR3.1.2** Charts SHALL render client-side using browser capabilities
- **PR3.1.3** Voice recognition SHALL use browser APIs when available
- **PR3.1.4** Period tracker SHALL use browser localStorage only

#### PR3.2 Server-Side Optimization
- **PR3.2.1** Knowledge bases SHALL be loaded in memory at startup
- **PR3.2.2** Vector embeddings SHALL be cached in ChromaDB
- **PR3.2.3** API responses SHALL be compressed (gzip)
- **PR3.2.4** Database queries SHALL use appropriate indexes

---

## Constraints and Assumptions

### C1: Technical Constraints

#### C1.1 Cost Constraints
- **C1.1.1** Entire system MUST operate within free tier limits ($0/month)
- **C1.1.2** Gemini Flash limited to 1500 requests per day
- **C1.1.3** Render.com limited to 750 hours per month
- **C1.1.4** Storage limited to free tier capacities

#### C1.2 Technology Constraints
- **C1.2.1** Frontend MUST be web-based (no native mobile apps)
- **C1.2.2** Backend MUST use Python FastAPI framework
- **C1.2.3** Primary LLM MUST be Google Gemini 1.5 Flash
- **C1.2.4** Deployment MUST use free hosting services

---

### C2: Operational Constraints

#### C2.1 Legal Constraints
- **C2.1.1** System MUST comply with India's DPDP Act 2023
- **C2.1.2** Health features MUST NOT provide medical diagnosis
- **C2.1.3** Legal features MUST NOT constitute legal advice
- **C2.1.4** System MUST display appropriate disclaimers

#### C2.2 Ethical Constraints
- **C2.2.1** GynaeCare MUST NOT provide abortion information
- **C2.2.2** GynaeCare MUST NOT provide sex determination information (illegal in India)
- **C2.2.3** System MUST NOT store sensitive health data
- **C2.2.4** System MUST respect user privacy completely

---

### A1: Assumptions

#### A1.1 User Assumptions
- **A1.1.1** Users have access to smartphone or computer with internet
- **A1.1.2** Users can upload images via browser file picker
- **A1.1.3** Users understand the tool is educational, not professional advice
- **A1.1.4** Users will consult professionals for serious concerns

#### A1.2 Infrastructure Assumptions
- **A1.2.1** Free tier services will remain available throughout project lifecycle
- **A1.2.2** API rate limits are sufficient for expected user traffic
- **A1.2.3** Vercel and Render.com will maintain 95%+ uptime
- **A1.2.4** Google Gemini API will remain in free tier

#### A1.3 Data Assumptions
- **A1.3.1** FSSAI standards are stable and updated annually
- **A1.3.2** WHO medical reference ranges are standardized
- **A1.3.3** Municipal authority contact information is publicly available
- **A1.3.4** Legal documents from IndiaCode.nic.in are accurate

---

## Acceptance Criteria

### AC1: Feature Completeness
- All 5 modules (Product Label, CivicSense, Legal Rights, Lab Analyzer, GynaeCare) are functional
- Each module meets its functional requirements as specified
- User interface is responsive across desktop and mobile browsers
- Multi-language support works for Hindi and English

### AC2: Performance Standards
- System loads within specified time limits on 4G connection
- OCR processing completes within 10 seconds for standard images
- AI responses generate within 5 seconds for typical queries
- System handles 100 concurrent users without degradation

### AC3: Security Compliance
- No personally identifiable health information is stored
- All communications use HTTPS encryption
- Input validation prevents common attacks (XSS, SQL injection)
- System complies with DPDP Act 2023 requirements

### AC4: Usability Standards
- Users can complete tasks with minimal clicks
- Clear disclaimers displayed for health and legal features
- Error messages are clear and actionable
- Help documentation is accessible and comprehensive

### AC5: Deployment Success
- Frontend successfully deployed on Vercel with automatic HTTPS
- Backend successfully deployed on Render.com with health checks
- All APIs are accessible and documented
- System operates within $0/month cost constraint

---

## Glossary

| Term | Definition |
|------|------------|
| **FSSAI** | Food Safety and Standards Authority of India |
| **WHO** | World Health Organization |
| **ICMR** | Indian Council of Medical Research |
| **DPDP Act** | Digital Personal Data Protection Act, 2023 |
| **OCR** | Optical Character Recognition |
| **RAG** | Retrieval Augmented Generation |
| **LLM** | Large Language Model |
| **PHI** | Personal Health Information |
| **PII** | Personally Identifiable Information |
| **API** | Application Programming Interface |
| **CDN** | Content Delivery Network |
| **HTTPS** | Hypertext Transfer Protocol Secure |
| **CORS** | Cross-Origin Resource Sharing |

---

## Document Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | February 2026 | BharatSetu Team | Initial requirements document |

---

**Document Status:** Approved for Hackathon Submission  
**Next Review Date:** Post-Hackathon  
**Contact:** [Team Contact Information]
