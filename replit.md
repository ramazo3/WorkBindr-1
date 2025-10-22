# WorkBindr 2.0 - Decentralized Business Platform

## Overview

WorkBindr 2.0 is a decentralized business productivity platform that combines AI assistance with blockchain technology to enable micro-app development and monetization. The platform allows users to build, deploy, and monetize micro-applications while maintaining data ownership through decentralized architecture. It features an AI assistant for workflow automation, a marketplace for discovering micro-apps, and developer tools for building and integrating custom applications.

**Current Status**: Production-ready MVP with functional AI assistant, micro-app marketplace, developer portal, dashboard with real-time data display, and Cloud Run deployment support.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client uses React with TypeScript, built with Vite for fast development and production builds. The UI is constructed using shadcn/ui components with Radix UI primitives for accessibility and Tailwind CSS for styling. State management is handled through TanStack Query for server state and React hooks for local state. The application uses Wouter for client-side routing, providing a lightweight alternative to React Router.

### Backend Architecture
The server is built with Express.js and TypeScript, following a RESTful API pattern. The application uses a dual storage system: in-memory storage (MemStorage) for development and database-backed storage (DbStorage) for production deployments. Routes are organized in a modular structure with proper error handling middleware. The server integrates OpenAI's API for AI assistant functionality and includes logging middleware for API request monitoring.

### Data Storage Solutions
The application uses Drizzle ORM with PostgreSQL dialect for database schema definition. Database schemas are shared between client and server through the `/shared` directory. The production implementation uses `DbStorage` class which connects to PostgreSQL via Neon Database serverless adapter. Development environment uses `MemStorage` for faster iteration. Connection pooling is handled through Neon Database serverless adapter with WebSocket support.

### Storage Implementation
- **Development**: MemStorage (in-memory) for rapid development
- **Production**: DbStorage (PostgreSQL) for data persistence
- Storage interface (`IStorage`) ensures consistent API across implementations
- Automatic storage selection based on NODE_ENV environment variable

### Authentication and Authorization
Authentication is implemented as a dual system supporting both Replit Auth and Google OAuth 2.0. The architecture supports session-based authentication with PostgreSQL session storage via connect-pg-simple. Users can sign in using either Replit accounts or Google accounts. Wallet-based authentication is planned for blockchain integration, with reputation scoring tied to user activities.

### External Service Integrations
The platform integrates with OpenAI's API for AI assistant capabilities, supporting both chat completions and business insight generation. Blockchain integration is architected for future implementation with wallet address storage in user profiles. The system is designed to support micro-transaction processing through smart contracts and reputation scoring based on platform contributions.

### Cloud Run Deployment
The application is containerized using Docker with multi-stage builds for optimal performance. The Dockerfile includes:
- Build stage: Compiles Vite frontend and esbuild backend
- Production stage: Runs with minimal dependencies, non-root user
- WebSocket support for Neon Database connections
- Health checks for Cloud Run monitoring
- Automatic port configuration (reads from PORT environment variable)

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
- Neon Database serverless adapter for PostgreSQL (with ws package for WebSocket support)
- OpenAI SDK for AI integration
- Passport.js for authentication (Replit Auth + Google OAuth)
- connect-pg-simple for PostgreSQL session management

**Development Tools:**
- TypeScript for type safety
- ESBuild for server bundling
- PostCSS with Autoprefixer for CSS processing
- Replit development plugins for IDE integration

**Database:**
- PostgreSQL with Drizzle migrations
- Connection via DATABASE_URL environment variable
- Schema versioning through Drizzle ORM
- Supports both Neon Database (serverless) and Google Cloud SQL

**AI Services:**
- OpenAI GPT-4o for chat completions
- Business query analysis and insight generation
- Client-side API integration with browser compatibility

## Recent Changes (October 2025)

**Cloud Run Deployment Support:**
✓ Created production-ready Dockerfile with multi-stage builds
✓ Implemented DbStorage class for PostgreSQL persistence
✓ Added automatic storage selection (MemStorage for dev, DbStorage for production)
✓ Configured WebSocket support for Neon Database serverless
✓ Added health checks for Cloud Run monitoring
✓ Created comprehensive database schema SQL file
✓ Built database migration tools (export_data.sql, import_data.sql)
✓ Added deployment documentation (CLOUD_RUN_DEPLOYMENT.md)
✓ Configured proper .dockerignore for optimal image size
✓ Set up environment variable management for production

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

**Database Schema:**
The application uses the following PostgreSQL tables:
- sessions: Authentication session storage
- users: User accounts with reputation scores
- micro_apps: Micro-application marketplace
- transactions: Transaction history
- ai_messages: AI conversation history
- platform_stats: Real-time platform statistics
- projects: Project management data
- tasks: Task tracking (linked to projects)
- donors: Donor management records
- governance_proposals: DAO voting proposals
- developer_settings: Developer preferences and API keys

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
- Cloud Run deployment with PostgreSQL database persistence

## Deployment Notes

**Environment Variables Required:**
- DATABASE_URL: PostgreSQL connection string (Neon or Cloud SQL)
- OPENAI_API_KEY: OpenAI API key for AI features
- GOOGLE_CLIENT_ID: Google OAuth client ID
- GOOGLE_CLIENT_SECRET: Google OAuth secret
- CUSTOM_DOMAIN: Custom domain (e.g., itinerecloud.com)
- NODE_ENV: Set to "production" for Cloud Run

**Pre-deployment Checklist:**
1. Initialize database schema using database_schema.sql
2. Set all required environment variables in Cloud Run
3. Update Google OAuth redirect URIs for production domain
4. Verify DATABASE_URL connection from Cloud Run
5. Test health endpoint after deployment
6. Configure custom domain DNS records

**Storage Behavior:**
- Development (NODE_ENV=development): Uses MemStorage (data resets on restart)
- Production (NODE_ENV=production): Uses DbStorage (persistent PostgreSQL)

## Files Created for Deployment

- `Dockerfile`: Multi-stage Docker build configuration
- `.dockerignore`: Files to exclude from Docker build
- `database_schema.sql`: Complete PostgreSQL schema
- `export_data.sql`: Data export script
- `import_data.sql`: Data import script
- `migration_guide.md`: Database migration documentation
- `CLOUD_RUN_DEPLOYMENT.md`: Comprehensive deployment guide
- `server/dbStorage.ts`: PostgreSQL storage implementation
- `cloudbuild.yaml`: Optional Google Cloud Build configuration
