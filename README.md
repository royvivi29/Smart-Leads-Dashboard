# Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the MERN stack and TypeScript.

## 🚀 Live Demo
- **Frontend (Vercel):** [https://smart-leads-dashboard-iota.vercel.app](https://smart-leads-dashboard-iota.vercel.app)
- **Backend API (Render):** [https://smart-leads-dashboard-7u9i.onrender.com/api/health](https://smart-leads-dashboard-7u9i.onrender.com/api/health)

## Tech Stack

| Layer      | Tech                                     |
|------------|------------------------------------------|
| Frontend   | React, TypeScript, TailwindCSS v4, Vite  |
| Backend    | Node.js, Express, TypeScript             |
| Database   | MongoDB, Mongoose                        |
| Auth       | JWT, bcrypt                              |
| Validation | Zod                                      |
| Infra      | Docker, Docker Compose, Nginx            |

## Features

- **JWT Authentication** — Register, Login, Protected Routes
- **Leads CRUD** — Create, Read, Update, Delete leads
- **Advanced Filtering** — Filter by status, source, search by name/email (combinable)
- **Debounced Search** — 400ms debounce on search input
- **Pagination** — Server-side with 10 records per page
- **Role-Based Access** — Admin (full access) and Sales (no delete)
- **CSV Export** — Export filtered leads as CSV
- **Dark Mode** — Toggle with system preference detection + localStorage persistence
- **Responsive UI** — Mobile-friendly dashboard

---

## Project Structure

```
smart-leads-dashboard/             ← Root of the project
├── .env.example                    ← Environment variable template
├── docker-compose.yml              ← Multi-container Docker orchestration
├── README.md                       ← Project documentation (this file)
│
├── client/                         ← React + TypeScript frontend (Vite)
│   ├── Dockerfile                  ← Docker build config for client
│   ├── nginx.conf                  ← Nginx config (serves built React app)
│   ├── index.html                  ← Root HTML entry point
│   ├── vite.config.ts              ← Vite bundler configuration
│   ├── tsconfig.json               ← TypeScript root config
│   ├── tsconfig.app.json           ← TypeScript config for app source
│   ├── tsconfig.node.json          ← TypeScript config for Node tooling
│   ├── eslint.config.js            ← ESLint linting rules
│   ├── package.json                ← Frontend dependencies & scripts
│   ├── package-lock.json           ← Locked dependency tree
│   ├── .gitignore                  ← Files to exclude from git
│   └── src/                        ← All application source code
│       ├── main.tsx                ← React app entry point (renders <App />)
│       ├── App.tsx                 ← Root component — routing & layout
│       ├── index.css               ← Global CSS styles & Tailwind base
│       │
│       ├── components/             ← Reusable UI components
│       │   ├── ConfirmModal.tsx    ← Confirmation dialog modal
│       │   ├── FilterBar.tsx       ← Filter controls (status, source, search)
│       │   ├── LeadForm.tsx        ← Create / edit lead form
│       │   ├── LeadsTable.tsx      ← Leads data table with actions
│       │   ├── Navbar.tsx          ← Top navigation bar
│       │   ├── Pagination.tsx      ← Page navigation controls
│       │   └── ProtectedRoute.tsx  ← Auth guard wrapper for private routes
│       │
│       ├── context/                ← React context providers
│       │   ├── AuthContext.tsx     ← Authenticated user state & actions
│       │   └── ThemeContext.tsx    ← Dark/light mode state & toggle
│       │
│       ├── hooks/                  ← Custom React hooks
│       │   ├── useDebounce.ts      ← Debounce any value (400ms default)
│       │   └── useLeads.ts         ← Fetch, filter & paginate leads
│       │
│       ├── pages/                  ← Route-level page components
│       │   ├── LoginPage.tsx       ← User login page
│       │   ├── RegisterPage.tsx    ← User registration page
│       │   ├── DashboardPage.tsx   ← Main leads dashboard
│       │   ├── CreateLeadPage.tsx  ← New lead creation page
│       │   ├── EditLeadPage.tsx    ← Edit existing lead page
│       │   └── LeadDetailPage.tsx  ← Single lead detail view
│       │
│       ├── services/               ← External service communication
│       │   └── api.ts              ← Axios instance + all API call functions
│       │
│       └── types/                  ← TypeScript type definitions
│           └── index.ts            ← Shared interfaces: Lead, User, etc.
│
└── server/                         ← Node.js + Express + TypeScript backend
    ├── Dockerfile                  ← Docker build config for server
    ├── tsconfig.json               ← TypeScript compiler config
    ├── package.json                ← Backend dependencies & scripts
    ├── package-lock.json           ← Locked dependency tree
    ├── .env                        ← Local environment variables (not in git)
    ├── .gitignore                  ← Files to exclude from git
    └── src/                        ← All server source code
        ├── index.ts                ← Express app entry — server bootstrap
        ├── seed.ts                 ← DB seeder: creates demo admin & sales users
        │
        ├── controllers/            ← Business logic for each route
        │   ├── authController.ts   ← Register, login, get current user
        │   └── leadController.ts   ← CRUD + export for leads
        │
        ├── middleware/             ← Express middleware functions
        │   ├── auth.ts             ← JWT verification & role extraction
        │   ├── errorHandler.ts     ← Global error response formatter
        │   └── validate.ts         ← Zod schema request body validator
        │
        ├── models/                 ← Mongoose database schemas
        │   ├── User.ts             ← User schema (name, email, password, role)
        │   └── Lead.ts             ← Lead schema (name, email, status, source…)
        │
        ├── routes/                 ← Express route definitions
        │   ├── authRoutes.ts       ← /api/auth  — register, login, me
        │   └── leadRoutes.ts       ← /api/leads — CRUD + CSV export
        │
        ├── types/                  ← TypeScript type definitions
        │   └── index.ts            ← Express Request extensions & shared types
        │
        ├── utils/                  ← Utility / helper modules
        │   ├── AppError.ts         ← Custom operational error class
        │   └── token.ts            ← JWT sign & verify helpers
        │
        └── validators/             ← Zod validation schemas
            └── index.ts            ← Lead & auth request validation schemas
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm

### 1. Clone and install

```bash
git clone https://github.com/royvivi29/Smart-Leads-Dashboard
cd smart-leads-dashboard

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Environment setup

Copy `.env.example` to `server/.env`:

```bash
cp .env.example server/.env
```

Edit the values as needed (especially `JWT_SECRET` for production).

**Available environment variables:**

| Variable      | Description                          | Default                                    |
|---------------|--------------------------------------|--------------------------------------------|
| `MONGODB_URI` | MongoDB connection string            | `mongodb://localhost:27017/smart-leads`    |
| `JWT_SECRET`  | Secret key for signing JWT tokens    | `your-super-secret-jwt-key-change-me`      |
| `PORT`        | Port the Express server listens on   | `5000`                                     |
| `NODE_ENV`    | Environment mode                     | `development`                              |
| `VITE_API_URL`| Base URL for frontend API calls      | `/api`                                     |

### 3. Seed the database (optional)

```bash
cd server
npm run seed
```

This creates demo users:
- **Admin**: `admin@smartleads.com` / `admin123`
- **Sales**: `sales@smartleads.com` / `sales123`

### 4. Run development servers

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

The frontend runs at `http://localhost:5173` with API requests proxied to `http://localhost:5000`.

---

## Docker

```bash
docker-compose up --build
```

Access the app at `http://localhost:3000`.

**Docker services:**

| Service  | Container Name        | Port Mapping  | Description                     |
|----------|-----------------------|---------------|---------------------------------|
| `mongo`  | smart-leads-mongo     | 27017 → 27017 | MongoDB 7 database              |
| `server` | smart-leads-server    | 5000 → 5000   | Express API server              |
| `client` | smart-leads-client    | 3000 → 80     | React app served via Nginx      |

---

## API Documentation

### Auth

| Method | Endpoint             | Access | Body                               |
|--------|----------------------|--------|------------------------------------|
| POST   | `/api/auth/register` | Public | `{ name, email, password, role }`  |
| POST   | `/api/auth/login`    | Public | `{ email, password }`              |
| GET    | `/api/auth/me`       | Auth   | —                                  |

### Leads

| Method | Endpoint                | Access     | Description          |
|--------|-------------------------|------------|----------------------|
| GET    | `/api/leads`            | Auth       | List (filter/page)   |
| GET    | `/api/leads/:id`        | Auth       | Single lead          |
| POST   | `/api/leads`            | Auth       | Create lead          |
| PUT    | `/api/leads/:id`        | Auth       | Update lead          |
| DELETE | `/api/leads/:id`        | Admin only | Delete lead          |
| GET    | `/api/leads/export/csv` | Auth       | CSV export           |

### Query Parameters for `GET /api/leads`

| Param    | Type   | Values                                      |
|----------|--------|---------------------------------------------|
| `page`   | number | Page number (default: 1)                    |
| `limit`  | number | Records per page (default: 10, max: 50)     |
| `status` | string | `New`, `Contacted`, `Qualified`, `Lost`     |
| `source` | string | `Website`, `Instagram`, `Referral`          |
| `search` | string | Search by name or email                     |
| `sortBy` | string | `latest` (default), `oldest`                |

### Response Format

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

---

## License

MIT
