# WorkBindr 2.0 - Decentralized Business Platform

## Overview

WorkBindr 2.0 is a decentralized business productivity platform that combines AI assistance with blockchain technology to enable micro-app development and monetization. The platform allows users to build, deploy, and monetize micro-applications while maintaining data ownership through decentralized architecture. It features an AI assistant for workflow automation, a marketplace for discovering micro-apps, and developer tools for building and integrating custom applications.

**Current Status**: Working MVP with functional AI assistant, micro-app marketplace, developer portal, and dashboard with real-time data display.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client uses React with TypeScript, built with Vite for fast development and production builds. The UI is constructed using shadcn/ui components with Radix UI primitives for accessibility and Tailwind CSS for styling. State management is handled through TanStack Query for server state and React hooks for local state. The application uses Wouter for client-side routing, providing a lightweight alternative to React Router.

### Backend Architecture
The server is built with Express.js and TypeScript, following a RESTful API pattern. The application uses an in-memory storage implementation (MemStorage) that can be easily replaced with a database-backed solution. Routes are organized in a modular structure with proper error handling middleware. The server integrates OpenAI's API for AI assistant functionality and includes logging middleware for API request monitoring.

### Data Storage Solutions
The application uses Drizzle ORM with PostgreSQL dialect for database schema definition and migrations. Database schemas are shared between client and server through the `/shared` directory. The current implementation includes an in-memory storage layer for development, with production-ready PostgreSQL schema definitions. Connection pooling is handled through Neon Database serverless adapter.

### Authentication and Authorization
Authentication is currently implemented as a mock system using a default user profile. The architecture supports session-based authentication with connect-pg-simple for PostgreSQL session storage. Wallet-based authentication is planned for blockchain integration, with reputation scoring tied to user activities.

### External Service Integrations
The platform integrates with OpenAI's API for AI assistant capabilities, supporting both chat completions and business insight generation. Blockchain integration is architected for future implementation with wallet address storage in user profiles. The system is designed to support micro-transaction processing through smart contracts and reputation scoring based on platform contributions.

## External Dependencies

**Frontend Dependencies:**
- React 18 with TypeScript for UI development
- Vite for build tooling and development server
- TanStack Query for server state management
- Wouter for client-side routing
- shadcn/ui component library with Radix UI primitives
- Tailwind CSS for styling
- Lucide React for icons

**Backend Dependencies:**
- Express.js for API server
- Drizzle ORM for database operations
- Neon Database serverless adapter for PostgreSQL
- OpenAI SDK for AI integration
- connect-pg-simple for session management

**Development Tools:**
- TypeScript for type safety
- ESBuild for server bundling
- PostCSS with Autoprefixer for CSS processing
- Replit development plugins for IDE integration

**Database:**
- PostgreSQL with Drizzle migrations
- Connection via DATABASE_URL environment variable
- Schema versioning through migration files

**AI Services:**
- OpenAI GPT-4o for chat completions
- Business query analysis and insight generation
- Client-side API integration with browser compatibility

## Recent Changes (August 2025)

**MVP Implementation:**
✓ Created working dashboard with micro-app showcase
✓ Implemented AI Assistant with OpenAI GPT-4o integration
✓ Built marketplace modal for discovering new micro-apps
✓ Developed developer portal with API documentation and LLM selection
✓ Added real-time transaction tracking and reputation system
✓ Built interactive Project Management micro-app with Kanban board
✓ Implemented Donor Management system with analytics dashboard
✓ Created Web3 governance system with proposal voting
✓ Added simulated wallet connection functionality
✓ Fixed all TypeScript compilation errors and LSP diagnostics
✓ Successfully integrated OpenAI API key for production functionality

**Authentication & Branding Updates:**
✓ Migrated to PostgreSQL database with proper schema and session management
✓ Implemented dual authentication system (Replit Auth + Google OAuth)
✓ Integrated custom WorkBindr logo throughout platform (header, landing, favicon)
✓ Configured custom domain support for itinerecloud.com
✓ Fixed Google OAuth configuration with proper callback URLs and error handling
✓ Added production-ready deployment configuration

**Key Features Live:**
- 7 interactive micro-apps (Customer Hub, Smart Invoicing, Task Flow, AI Assistant, Analytics Hub, Doc Manager, Donor Manager)
- Multi-LLM developer support (GPT-4o, Claude 3.5 Sonnet, Gemini Pro, DeepSeek Coder)
- Interactive Project Management with drag-and-drop Kanban boards
- Comprehensive Donor Management with contribution tracking
- DAO governance system with reputation-weighted voting
- Simulated Web3 wallet connection and blockchain interactions
- Real-time platform statistics (active micro-apps, daily transactions, data nodes, contributors)
- User reputation scoring system
- Transaction history with blockchain-style verification
- Responsive design with modern UI components
- Dual authentication options for enhanced user accessibility
- Professional branding with custom WorkBindr logo
- Custom domain configuration for production deployment