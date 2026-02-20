# HackShield Frontend

Professional B2B SaaS front-end for the HackShield automated pentesting platform.

## Tech Stack

- **React 18** + **TypeScript** (Vite)
- **TailwindCSS** — dark mode first, custom design system
- **React Router v6** — client-side routing
- **Zustand** — lightweight auth + theme state management
- **Axios** — HTTP client with JWT interceptors & auto-refresh
- **React Hook Form + Zod** — form validation
- **Lucide React** — icon library
- **Recharts** — dashboard charts

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- HackShield API running on `http://localhost:9001`

### Installation

```bash
cd frontend
npm install
```

### Configuration

Copy the env template and fill in values:

```bash
cp .env.example .env
```

`.env` variables:

```
VITE_API_URL=http://localhost:9001/api/v1
VITE_APP_NAME=HackShield
```

### Development

```bash
npm run dev
```

App runs on **http://localhost:5173**

The Vite dev server proxies `/api` requests to `http://localhost:9001` automatically.

### Production Build

```bash
npm run build
```

Output in `dist/` — serve with any static file server or nginx.

```bash
npm run preview   # preview the production build locally
```

## Project Structure

```
src/
├── components/
│   ├── ui/          # Button, Input, Card, Modal, Badge, Toast, Spinner, Skeleton, Select
│   ├── layout/      # Navbar, Sidebar, DashboardLayout
│   ├── auth/        # ProtectedRoute, AdminRoute
│   ├── dashboard/   # StatCard, ChartWidget (ScansLineChart, VulnsBarChart, AttackPieChart)
│   └── tables/      # DataTable, Pagination
├── pages/
│   ├── LandingPage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── ForgotPasswordPage.tsx
│   ├── ResetPasswordPage.tsx
│   ├── VerifyEmailPage.tsx
│   ├── DashboardPage.tsx
│   ├── TargetsPage.tsx
│   ├── NewTargetPage.tsx
│   ├── ScansPage.tsx
│   ├── ScanDetailPage.tsx
│   ├── ProfilePage.tsx
│   ├── SettingsPage.tsx
│   └── admin/
│       ├── UsersPage.tsx
│       ├── NewUserPage.tsx
│       └── EditUserPage.tsx
├── hooks/
│   ├── useAuth.ts       # Login, register, logout, profile refresh
│   └── useToast.ts      # Global toast notification system
├── services/
│   ├── api.ts           # Axios instance + JWT interceptors + refresh logic
│   ├── auth.service.ts  # Auth API calls
│   └── user.service.ts  # User management API calls
├── store/
│   ├── authStore.ts     # Zustand auth store (persisted to localStorage)
│   └── themeStore.ts    # Zustand theme store (dark/light)
├── utils/
│   └── formatters.ts    # Date, duration, string formatters
└── types/
    ├── User.ts
    ├── Scan.ts
    ├── Target.ts
    └── index.ts
```

## Pages & Routes

| Route | Auth | Description |
|-------|------|-------------|
| `/` | Public | Landing page with features, pricing, CTA |
| `/login` | Public | Email/username + password login |
| `/register` | Public | Registration with plan selection |
| `/forgot-password` | Public | Request password reset |
| `/reset-password?token=` | Public | Set new password |
| `/verify-email?token=` | Public | Email verification |
| `/dashboard` | User | Stats, charts, recent scans overview |
| `/targets` | User | Target list with search & CRUD actions |
| `/targets/new` | User | Create a new scan target |
| `/scans` | User | Scan history with status filters |
| `/scans/:id` | User | Scan details with vulnerability findings |
| `/profile` | User | Account info, password change, API key |
| `/settings` | User | Theme, notifications, security settings |
| `/admin/users` | Admin | Full user management table |
| `/admin/users/new` | Admin | Create new user |
| `/admin/users/:id` | Admin | Edit user role, plan, status |

## Auth Flow

1. User logs in → access token (15min) + refresh token (7d) stored in `localStorage` via Zustand persist
2. Every Axios request automatically gets `Authorization: Bearer {accessToken}` header
3. On 401 response → Axios interceptor tries `POST /auth/refresh` with the refresh token
4. If refresh succeeds → new access token stored, original request retried
5. If refresh fails → `clearAuth()` called, user redirected to `/login`

## Design System

- **Dark mode default** with toggle (persisted to localStorage)
- **Colors**: `primary-500 (#3B82F6)`, `green-500 (#10B981)`, `red-500 (#EF4444)`, `amber-500 (#F59E0B)`
- **Font**: Inter (Google Fonts)
- **Background dark**: `slate-950 (#0F172A)`
- **Background light**: `slate-50 (#F8FAFC)`

## API Integration

The frontend communicates with the API at `VITE_API_URL`. The following endpoints are integrated:

**Auth** — `/api/v1/auth/{login,register,logout,refresh,verify-email,forgot-password,reset-password}`

**Users** — `/api/v1/users/{me, me/password, me/api-key, me/logout-all, admin CRUD}`

Targets (`/api/v1/targets`) and Scans (`/api/v1/scans`) endpoints are UI-ready with mock data — they will connect to live data once the backend implements them.
