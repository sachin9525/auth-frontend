# auth-frontend

A React + Vite authentication frontend application with Tailwind CSS styling. This project includes login/signup pages, dashboard routing, protected routes, and an admin section.

## Features

- React 18 with functional components
- Vite development environment
- Tailwind CSS styling
- React Router DOM navigation
- Authentication context and protected routes
- Admin dashboard support
- Axios for API calls
- Toast notifications with `react-hot-toast`

## Requirements

- Node.js 18+ (or compatible LTS version)
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd auth-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

## Development

Run the Vite development server:

```bash
npm run dev
```

Open the local development URL shown in the terminal.

## Build

Build the production bundle:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Project Structure

- `src/`
  - `App.jsx` - Root app component and routes
  - `main.jsx` - Application entry file
  - `index.css` - Global styles
  - `api/` - API request utilities
    - `admin.js`
    - `auth.js`
  - `components/` - Reusable UI and route components
    - `AdminRoute.jsx`
    - `ProtectedRoute.jsx`
    - `UI.jsx`
    - `admin/UserDetailModal.jsx`
  - `context/` - React context providers
    - `AuthContext.jsx`
    - `ThemeContext.jsx`
  - `pages/` - Application pages
    - `AuthPage.jsx`
    - `DashboardPage.jsx`
    - `LoginPage.jsx`
    - `SignupPage.jsx`
    - `admin/AdminDashboard.jsx`

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production files
- `npm run preview` - Preview production build locally

## Dependencies

- `react`
- `react-dom`
- `react-router-dom`
- `axios`
- `react-hot-toast`
- `lucide-react`

## Dev Dependencies

- `vite`
- `@vitejs/plugin-react`
- `tailwindcss`
- `postcss`
- `autoprefixer`

## Notes

This repository is configured as a private frontend app with no backend included. Update API endpoints in `src/api/auth.js` and `src/api/admin.js` as needed for your authentication backend.