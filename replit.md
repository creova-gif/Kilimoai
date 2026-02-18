# KILIMO AI

## Overview
KILIMO AI is a Swahili-language agriculture app built with React + TypeScript + Vite. It provides AI-powered farming insights, crop diagnosis, market prices, and more for farmers. The app uses Supabase as its backend.

## Tech Stack
- **Frontend**: React 18, TypeScript, Vite 6
- **Styling**: Tailwind CSS v4 (pre-compiled CSS), Radix UI components
- **Backend**: Supabase (external, hosted)
- **State Management**: React hooks
- **UI Libraries**: Radix UI, Lucide icons, Framer Motion, Recharts, Sonner (toasts)

## Project Structure
- `/src` - Main source code
  - `/src/components` - React components (auth, dashboard, AI features, etc.)
  - `/src/utils` - Utility functions (Supabase client, analytics, crash reporting)
  - `/src/hooks` - Custom React hooks
  - `/src/assets` - Image assets
  - `/src/index.css` - Pre-compiled Tailwind CSS
- `/index.html` - Entry HTML file
- `/vite.config.ts` - Vite configuration (port 5000, host 0.0.0.0)
- `/tsconfig.json` - TypeScript configuration
- `/package.json` - Dependencies and scripts

## Development
- **Dev server**: `npm run dev` (runs on port 5000)
- **Build**: `npm run build` (outputs to `/build`)

## Deployment
- Static deployment with build output in `/build` directory

## Recent Changes
- 2026-02-18: Initial Replit setup
  - Fixed package.json (removed invalid Node.js built-in packages)
  - Configured Vite for Replit (port 5000, host 0.0.0.0, allowedHosts)
  - Added root-level tsconfig.json with relaxed settings
  - Renamed crash-reporting.ts to .tsx (contained JSX)
  - Set up deployment configuration
