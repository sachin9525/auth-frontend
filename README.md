# 🔐 auth-frontend

Production-ready authentication frontend built with React, Vite, Tailwind CSS, and secure routing.

## 🚀 What’s Included

- ✅ React 18 + Vite   
- ✅ Tailwind CSS styling
- ✅ Client-side auth flow with protected routes
- ✅ Admin-only dashboard access
- ✅ Axios API integration
- ✅ Toast notifications with `react-hot-toast`
- ✅ Theme support via context

## 📁 Project Structure

```
auth-frontend/
├── src/
│   ├── api/
│   │   ├── admin.js
│   │   └── auth.js
│   ├── components/
│   │   ├── AdminRoute.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── UI.jsx
│   │   └── admin/UserDetailModal.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── pages/
│   │   ├── AuthPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── SignupPage.jsx
│   │   └── admin/AdminDashboard.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## 🔧 Requirements

- Node.js 18+ or compatible LTS
- npm or yarn

## 💾 Installation

```bash
git clone <repository-url>
cd auth-frontend
npm install
```

or with Yarn:

```bash
yarn install
```

## ▶️ Development

Start the local development server:

```bash
npm run dev
```

## 📦 Build

Generate a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## 🔐 Authentication Flow

- Sign up / sign in pages
- Protected dashboard route
- Admin-only route control via `AdminRoute`
- Auth state persisted in React Context
- API calls handled through `src/api/auth.js` and `src/api/admin.js`

## 🧩 API Integration

The frontend expects a backend authentication API with endpoints similar to:

- `POST /api/auth/signup`
- `POST /api/auth/signin`
- `POST /api/auth/refresh-token`
- `POST /api/auth/signout`
- `GET /api/auth/me`
- `GET /api/admin/users`
- `PATCH /api/admin/users/:id/role`
- `PATCH /api/admin/users/:id/status`
- `DELETE /api/admin/users/:id`

Update the request URLs in `src/api/auth.js` and `src/api/admin.js` as needed.

## 💡 Password Requirements

This frontend assumes strong password validation from the backend. Recommended rules:

- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (@$!%*?&#^)

## 🧪 Scripts

- `npm run dev` — Start Vite development server
- `npm run build` — Build production assets
- `npm run preview` — Preview production build locally

## 📦 Dependencies

- `react`
- `react-dom`
- `react-router-dom`
- `axios`
- `react-hot-toast`
- `lucide-react`

## 🧰 Dev Dependencies

- `vite`
- `@vitejs/plugin-react`
- `tailwindcss`
- `postcss`
- `autoprefixer`

## 📌 Notes

This repository contains only the frontend client. The backend authentication API must be implemented separately. Update environment values, API hosts, and auth endpoints in `src/api` as needed.`