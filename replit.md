# Nuture Student Insurance Platform

## Overview

Nuture is a comprehensive student health insurance platform designed specifically for NUTM (Nigerian University of Technology and Management) students. The platform provides affordable healthcare coverage with features including policy management, claims submission and tracking, referral programs, weekly health quizzes, and health education resources.

**Current Architecture (Updated November 2025):** The application is now built as a **fully client-side React application** that runs entirely in the browser without requiring a backend server. All data is stored using browser localStorage and mock data files.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (November 2025)

### Migration to Client-Side Only Architecture
- **Removed backend dependency**: Application no longer requires Flask backend server
- **Removed authentication**: Clerk authentication has been removed - app is fully accessible without login
- **localStorage persistence**: User data (subscriptions, claims, referrals) now stored in browser localStorage
- **Mock data**: All insurance plans, health tips, and quiz questions loaded from static mock data files

## System Architecture

### Frontend Architecture

**Framework:** React with TypeScript
- Vite as the build tool and development server (runs on port 5000)
- React Router for client-side routing
- TanStack Query (React Query) for state management (even with mock data, for consistency)
- No authentication system - fully open access

**UI Component System:**
- Tailwind CSS v4 for styling with custom design tokens
- Radix UI for accessible, unstyled component primitives
- Custom component library built on Radix primitives (buttons, cards, forms, etc.)
- Dark mode as the default theme with custom color scheme featuring brand green (#00A859)

**State Management:**
- Mock data loaded from `frontend/lib/mockData.ts`
- localStorage for persisting user subscriptions, claims, and referrals
- React hooks for local UI state
- No server state - all data is local

**Data Architecture:**
- **mockData.ts**: Contains all static data (plans, health tips, quiz questions)
- **mockStorage helper**: Provides localStorage CRUD operations for user data
  - `getSubscription()`: Retrieve active subscription
  - `saveSubscription()`: Save new subscription
  - `getClaims()`: Get all user claims
  - `saveClaim()`: Save new claim
  - `getReferrals()`: Get all referrals
  - `saveReferral()`: Save new referral
  - `getQuizScores()`: Get quiz scores

### Mock Data Structure

**Insurance Plans:**
- 3 plans: Basic (₦500,000/mo), Standard (₦1,000,000/mo), Premium (₦1,500,000/mo)
- Plan IDs: 'basic', 'standard', 'premium'
- Each plan includes coverage limit, features list, and tier information

**Health Tips:**
- 20+ health tips across categories: General, Fitness, Nutrition, Mental Health, Hygiene
- Client-side category filtering

**Quiz Questions:**
- 150+ health-related quiz questions
- Categories: General Health, Nutrition, Mental Health, Fitness, Disease Prevention
- Multiple choice format (A, B, C, D)

### Page Implementations

**Plans Page (`/plans`):**
- Displays 3 insurance plans from mockPlans array
- Links to checkout with plan ID in URL
- No backend API calls

**Checkout Page (`/checkout/:planId`):**
- Displays selected plan details
- Payment form (mock - no actual payment processing)
- Saves subscription to localStorage on completion
- Redirects to dashboard after purchase

**Dashboard Page (`/dashboard`):**
- Shows active subscription from localStorage
- Displays claims and referrals from localStorage
- Quick action buttons for common tasks
- Renewal reminders based on subscription end date

**Health Tips Page (`/health-tips`):**
- Displays health tips from mockHealthTips array
- Client-side category filtering
- No API calls

### Data Persistence

**localStorage Keys:**
- `nuture_subscription`: User's active subscription (JSON)
- `nuture_claims`: Array of user claims (JSON)
- `nuture_referrals`: Array of user referrals (JSON)
- `nuture_quiz_scores`: User quiz scores (JSON)

**Data Retention:**
- Data persists across browser sessions
- Clearing browser data will reset all user information
- No server backup - purely client-side storage

### Legacy Backend Files (Not Used)

The `api/` directory contains the original Flask backend code but is **NOT ACTIVE**:
- Flask API routes are present but not running
- SQLite database files may exist but are not used
- Backend workflow has been removed from the project
- All functionality is now in the frontend

### Development Setup

**Requirements:**
- Bun (package manager)
- No backend dependencies needed
- No database setup required
- No authentication configuration needed

**Running the Application:**
1. Workflow: "Frontend" runs `cd frontend && bun run dev`
2. Server listens on port 5000
3. Open browser to view application
4. All features work without backend

### External Dependencies (Minimal)

**Frontend Libraries:**
- React Router DOM for navigation
- Lucide React for icons
- Tailwind CSS for styling with @tailwindcss/vite plugin
- TanStack Query for state management patterns
- Radix UI for accessible components

**No Authentication:**
- Clerk has been removed
- No login/signup functionality
- All pages are publicly accessible

**No Payment Processing:**
- Mock checkout flow only
- No real payment integration
- Subscriptions saved directly to localStorage

**No Backend Services:**
- No API server
- No database server
- No email service
- Fully self-contained frontend application

### Design Principles

**Client-Side First:**
- All logic runs in the browser
- No network requests to backend APIs
- Fast, responsive user experience
- Works offline (after initial load)

**Simple Data Model:**
- Plan IDs match tier names: basic, standard, premium
- Subscriptions store planId, startDate, endDate, autoRenew
- Claims track status: pending, approved, rejected
- Referrals track completion status

**Mock Data Quality:**
- Realistic Nigerian Naira pricing (₦)
- Authentic health tips and quiz questions
- Production-ready UI/UX design
- Professional branding and styling

### Future Enhancement Paths

If backend is needed in future:
1. Original Flask API code exists in `api/` directory
2. Database schemas already defined
3. Can migrate localStorage data to database
4. Can add Clerk authentication back
5. Can integrate real payment processing (Paystack/Flutterwave)

Current focus: Fully functional client-side demo application
