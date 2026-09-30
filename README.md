# Smart Automation Web Application

A production-quality Smart Automation Platform designed for effortless business process orchestration, visual workflow builder, multi-step approvals, automatic task distribution, rule-based automation, real-time notifications, and exportable reports.

---

## 🚀 Technology Stack

- **Frontend**: React 18, Vite 6, Tailwind CSS, React Router v6, Axios, Lucide React
- **Backend**: Node.js, Express.js (MVC Architecture: Routes → Middleware → Controllers → Services → Models)
- **Security**: Helmet, CORS, JWT, Bcrypt, Express Rate Limit
- **Database**: PostgreSQL / Supabase
- **Exports**: CSV and PDF reporting

---

## 📁 Folder Structure

```text
smart-automation/
│
├── frontend/                     # React + Vite + Tailwind Client
│   ├── src/
│   │   ├── components/           # Reusable UI component library
│   │   ├── pages/                # Route page components
│   │   ├── layouts/              # App layouts (Dashboard, Auth, etc.)
│   │   ├── hooks/                # Custom React hooks (realtime, auth)
│   │   ├── context/              # Context API providers (Auth, UI)
│   │   ├── services/             # Axios API services
│   │   ├── utils/                # Helper utilities
│   │   ├── routes/               # Protected & public route definitions
│   │   ├── App.jsx               # Root application entry
│   │   └── main.jsx              # DOM render bootstrap
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env.example
│
├── backend/                      # Express.js REST API
│   ├── src/
│   │   ├── config/               # Environment & integration configs
│   │   ├── controllers/          # Request handlers
│   │   ├── middleware/           # Auth, validation, error handlers
│   │   ├── models/               # Data access layer
│   │   ├── routes/               # API route definitions
│   │   ├── services/             # Business & automation logic
│   │   ├── utils/                # Standardized response & helpers
│   │   ├── validators/           # Schema & input validators
│   │   ├── app.js                # Express app setup & middleware
│   │   └── server.js             # HTTP server listener
│   ├── package.json
│   └── .env.example
│
├── database/                     # SQL schemas, migrations, seed data
│   ├── migrations/               # Versioned migration scripts
│   ├── schema.sql                # Complete relational schema
│   ├── seed.sql                  # Initial seed data for development
│   └── README.md
│
├── README.md
└── .gitignore
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
NODE_ENV=development
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=super_secret_jwt_key_smart_automation
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🛠️ Quickstart

### 1. Backend Setup & Run
```bash
cd backend
npm install
npm run dev
# Running on http://localhost:5000 (Health check: http://localhost:5000/api/health)
```

### 2. Frontend Setup & Run
```bash
cd frontend
npm install
npm run dev
# Running on http://localhost:5173
```

---

## 📡 API Overview (Phase 1 Foundation)
- `GET /api/health` — Verifies API health and operational status
