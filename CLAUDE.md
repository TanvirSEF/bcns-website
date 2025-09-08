# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Next.js 15** website for the Bangladesh Child Neurology Society (BCNS) built with React 19, TypeScript, and Tailwind CSS. The application features a dual-layout architecture with public pages and authenticated admin/user dashboards.

## Key Commands

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint linting
- `pnpm lint:fix` - Run ESLint with auto-fix
- `pnpm type-check` - Run TypeScript type checking without emitting files

## Architecture Overview

### Directory Structure

- `app/` - Next.js App Router structure with nested layouts
  - `(main)/` - Public pages (about, activities, contact, login, etc.)
  - `admin/` - Admin dashboard with protected routes
- `components/` - Reusable React components
  - `admin/` - Admin-specific components (charts, navigation, etc.)
  - `dashboard/` - User dashboard components
  - `ui/` - shadcn/ui components (via components.json config)
- `lib/` - Utilities and core logic
  - `auth-context.tsx` - Authentication state management with localStorage
  - `api.ts` - API client functions
  - `utils.ts` - Utility functions
- `types/` - TypeScript type definitions
  - `api.ts` - API interfaces (User, Event, Document, etc.)
  - `membership.ts` - Membership-related types
- `data/` - Static data files (committee-members.json)
- `hooks/` - Custom React hooks
- `public/` - Static assets

### Key Features

1. **Authentication System**
   - JWT-based authentication with localStorage persistence
   - React Context (`AuthProvider`) for global auth state
   - Protected routes with automatic redirect to login
   - `useAuth()` and `useRequireAuth()` hooks for components

2. **UI Framework**
   - shadcn/ui components (New York style with Slate base color)
   - Radix UI primitives for accessibility
   - Lucide icons
   - Tailwind CSS with CSS variables enabled

3. **Data Management**
   - API client in `lib/api.ts` for backend communication
   - Type-safe interfaces in `types/api.ts`
   - Local data files for static content (committee members)

4. **Layout System**
   - Route groups for different page sections
   - Separate layouts for main site vs admin dashboard
   - Error boundary wrapping with `ErrorBoundary` component

### Important Technical Details

- **Path Aliases**: `@/` maps to root directory (configured in tsconfig.json)
- **Component Library**: Uses shadcn/ui with components configured via components.json
- **State Management**: React Context for auth, no external state management library
- **Styling**: Tailwind CSS with custom configuration, Geist fonts
- **Build Tool**: Next.js 15 with Turbopack for dev mode
- **Package Manager**: Uses pnpm (evidenced by pnpm-lock.yaml)

### Authentication Flow

The auth system uses `AuthProvider` context with:
- Token storage in localStorage
- User profile caching with API refresh
- Automatic logout on API failures
- Route protection via `useRequireAuth()`

### Component Patterns

- Functional components with TypeScript
- Custom hooks for reusable logic
- Error boundaries for graceful error handling
- Form components likely use controlled inputs with validation

When working on this codebase:
- Follow the existing shadcn/ui component patterns
- Use the established auth hooks rather than direct localStorage access
- Maintain the route group structure for new pages
- Add new API interfaces to `types/api.ts` before implementing