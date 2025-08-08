# Overview

SAARthi is a Smart AI Test & Learning Companion designed to help nursing students practice and prepare for their Pharmacology, Pathology, and Genetics exams. The application provides an interactive testing platform where students can answer MCQs and upload handwritten answers for AI-powered feedback. Built as a single-page web application with a slide-based UI, SAARthi aims to provide personalized, mentor-like guidance throughout the learning process.

## Recent Updates (January 2025)
- Enhanced mobile responsiveness across all components with proper touch interactions
- Added beautiful, smooth animations using Framer Motion throughout the application
- Implemented character verification with specific answer requirements (dosa/masala dosa only)
- Improved UI design with gradient backgrounds, glass morphism effects, and modern styling
- Added enhanced progress tracking with animated progress bar showing completion percentage
- Optimized touch interactions and sizing for mobile devices (44px minimum touch targets)
- Added soothing background animations and improved visual hierarchy
- Enhanced image upload interface with better drag-and-drop support and visual feedback
- **NEW**: Implemented SAARthi popup system with clean, formatted analysis display
- **NEW**: Enhanced MCQ feedback showing correct answers when wrong option is selected
- **NEW**: Added multiple image upload support (up to 5 images per question)
- **NEW**: Improved AI analysis format with structured feedback on correctness, length, and formatting
- **NEW**: Enhanced touch/mouse navigation throughout the application

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript, using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and CSS variables
- **Animations**: Framer Motion for smooth slide transitions and interactive elements
- **State Management**: TanStack React Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Component Structure**: Slide-based UI with individual components for different question types (MCQ, Image Upload, Fun Breaks, Summary)

## Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints for session management and question submissions
- **File Handling**: Multer for image upload processing with 5MB size limits
- **Error Handling**: Centralized error middleware with structured JSON responses
- **Development**: Hot module replacement via Vite integration

## Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Design**: 
  - Users table for authentication
  - Test sessions for tracking student progress
  - Question responses for storing answers and AI feedback
- **Session Storage**: In-memory storage implementation with interface for future database integration
- **File Storage**: Memory-based multer storage for uploaded images

## Authentication and Authorization
- **Current Implementation**: Basic user schema with username/password fields
- **Session Management**: Express sessions with connect-pg-simple for PostgreSQL session storage
- **Security**: No authentication currently implemented in routes (development phase)

## External Dependencies

### AI Services
- **Google Gemini AI**: Primary AI service for analyzing MCQ answers and handwritten image content
- **Use Cases**: 
  - MCQ feedback generation with personalized, mentor-like responses
  - Handwritten answer analysis using OCR and content evaluation
  - Scoring based on marking schemes and educational criteria

### Database Services
- **Neon Database**: Serverless PostgreSQL database for production deployment
- **Connection**: Uses @neondatabase/serverless driver for connection pooling

### UI and Design Dependencies
- **Radix UI**: Comprehensive set of accessible, unstyled UI primitives
- **Lucide React**: Icon library for consistent iconography
- **Font Awesome**: Additional icon resources loaded via CDN
- **Google Fonts**: Inter font family for typography

### Development and Build Tools
- **Vite**: Build tool with development server and hot reload
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind CSS integration
- **TypeScript**: Static type checking across the entire codebase

### File Processing
- **Multer**: Middleware for handling multipart/form-data and file uploads
- **Image Processing**: Base64 encoding for AI service integration

### Animation and Interaction
- **Framer Motion**: Animation library for slide transitions and micro-interactions
- **React Hook Form**: Form state management with validation
- **Date-fns**: Date manipulation utilities