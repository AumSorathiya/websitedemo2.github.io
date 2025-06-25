# StyleHub Fashion Platform

## Overview

StyleHub is a modern e-commerce fashion platform built as a full-stack web application with complete database integration. The application features a comprehensive clothing store with PostgreSQL backend, REST API endpoints, and dynamic content loading. The platform showcases real fashion products from the database, handles newsletter subscriptions, manages shopping cart functionality, and provides an engaging interface for online fashion shopping.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **UI Framework**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom theme variables
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM and full schema
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Storage**: DatabaseStorage implementation with comprehensive CRUD operations
- **API**: RESTful endpoints for courses, enrollments, newsletters, testimonials, and statistics

### Development Environment
- **Package Manager**: npm
- **Development Server**: tsx for TypeScript execution
- **Build Process**: Vite for frontend, esbuild for backend bundling
- **Database Migrations**: Drizzle Kit for schema management

## Key Components

### Database Schema
- **Users Table**: Complete user management with authentication and profile information
- **Products Table**: Fashion product catalog with pricing, ratings, categories, and designer relationships
- **Cart Table**: Customer shopping cart tracking with item management
- **Newsletters Table**: Email subscription management with subscription status
- **Testimonials Table**: Customer reviews and ratings with approval workflow
- **Schema Location**: `shared/schema.ts` with Drizzle ORM definitions and relations
- **Validation**: Zod schemas for type-safe data validation and API input validation

### Frontend Components
- **Navigation**: Responsive navigation with mobile menu support
- **Hero Section**: Animated statistics and call-to-action for fashion platform
- **Features**: Fashion service highlights (Premium Quality, Fast Delivery, Easy Returns)
- **Products**: Fashion product catalog with add-to-cart functionality
- **About**: Company information and fashion platform statistics
- **Testimonials**: Customer feedback section with fashion reviews
- **Newsletter**: Email subscription for fashion updates
- **Footer**: Site navigation and contact information

### UI Component Library
- Complete shadcn/ui component set including:
  - Form components (Input, Button, Select, etc.)
  - Layout components (Card, Sheet, Dialog, etc.)
  - Navigation components (Accordion, Tabs, etc.)
  - Feedback components (Toast, Alert, etc.)

### Storage Interface
- **Current Implementation**: PostgreSQL database storage (DatabaseStorage class)
- **Interface Design**: IStorage interface with comprehensive CRUD operations
- **CRUD Operations**: Full management for users, products, cart items, newsletters, and testimonials
- **Database Integration**: Real-time data persistence with proper error handling

## Data Flow

1. **Client Requests**: React components make API calls using TanStack Query
2. **API Layer**: Express.js routes handle HTTP requests with error middleware
3. **Data Layer**: Storage interface abstracts database operations
4. **Response Flow**: JSON responses with comprehensive error handling
5. **State Management**: Client-side caching and synchronization via TanStack Query

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: react, react-dom, @types/react
- **Routing**: wouter for lightweight client-side routing
- **State Management**: @tanstack/react-query for server state
- **Database**: drizzle-orm, @neondatabase/serverless
- **Validation**: zod for runtime type checking

### UI and Styling
- **Component Library**: @radix-ui/* packages for accessible components
- **Styling**: tailwindcss, autoprefixer, postcss
- **Utilities**: clsx, tailwind-merge for conditional styling
- **Icons**: Font Awesome via CDN

### Development Tools
- **Build Tools**: vite, esbuild, tsx
- **Database Tools**: drizzle-kit for migrations
- **Type Checking**: typescript with strict configuration
- **Replit Integration**: @replit/vite-plugin-* for development environment

## Deployment Strategy

### Production Build Process
1. **Frontend Build**: Vite bundles React application to `dist/public`
2. **Backend Build**: esbuild bundles Express server to `dist/index.js`
3. **Asset Serving**: Express serves static files in production mode

### Environment Configuration
- **Development**: Vite dev server with HMR and TypeScript compilation
- **Production**: Node.js serves bundled application
- **Database**: PostgreSQL connection via environment variable (DATABASE_URL)

### Replit-Specific Features
- **Autoscale Deployment**: Configured for automatic scaling
- **Port Configuration**: External port 80 mapped to local port 5000
- **Development Workflow**: Parallel task execution with wait-for-port

### Session Management
- **Current**: In-memory storage for development
- **Production Ready**: Interface supports PostgreSQL session store (connect-pg-simple)

## Changelog

```
Changelog:
- June 22, 2025: Initial setup with HTML/CSS/JavaScript website
- June 22, 2025: Added complete PostgreSQL database integration
  * Created comprehensive database schema with 5 tables
  * Implemented DatabaseStorage with full CRUD operations
  * Added REST API endpoints for all data operations
  * Integrated real-time data loading in frontend
  * Added newsletter subscription and course enrollment functionality
  * Seeded database with sample courses, users, and testimonials
- June 22, 2025: Transformed into fashion e-commerce platform
  * Converted from learning platform to clothing store
  * Updated all UI text and branding to StyleHub
  * Modified product data to fashion items (t-shirts, jeans, dresses, jackets)
  * Changed enrollment system to shopping cart functionality
  * Updated testimonials to fashion-focused reviews
  * Adapted statistics to show customers, products, and brands
- June 22, 2025: Implemented high-tech 3D UI and checkout system
  * Added cyber-punk theme with neon colors and glass morphism
  * Implemented 3D holographic product displays with animations
  * Added advanced shopping cart with localStorage persistence
  * Created comprehensive checkout modal with customer information forms
  * Integrated email system for order confirmations to mdsorathiya56@gmail.com
  * Added toast notifications and smooth 3D animations throughout
  * Enhanced with futuristic typography (Orbitron) and particle effects
- June 22, 2025: Redesigned to clean, modern, user-friendly interface
  * Simplified from complex 3D design to clean minimalist approach
  * Updated color scheme to modern blues, grays, and accent colors
  * Replaced futuristic fonts with clean Inter typography
  * Maintained all e-commerce functionality with improved usability
  * Enhanced accessibility and user experience for broader appeal
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
Design preference: Clean, simple, and attractive interface that's user-friendly and appealing to most people.
UI Philosophy: Minimalist design over complex 3D effects for better usability.
```