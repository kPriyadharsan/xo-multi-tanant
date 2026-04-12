<div align="center">

  <h1>🌌 XO — Multi-Tenant Task Management</h1>

  <p>
    A premium, production-grade <strong>Multi-Tenant SaaS Task Management</strong> platform built on the MERN stack.<br/>
    Designed with glassmorphism UI, real-time socket sync, AI-powered task generation, and strict organizational data isolation baked into every layer.
  </p>

  <p>
    <a href="#-key-features"><strong>Explore Features »</strong></a>
    &nbsp;·&nbsp;
    <a href="#-getting-started">Quick Setup</a>
    &nbsp;·&nbsp;
    <a href="#-api-reference">API Reference</a>
    &nbsp;·&nbsp;
    <a href="#-docker-deployment">Docker</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node" />
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="Mongo" />
    <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white" alt="Socket.io" />
    <img src="https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  </p>

</div>

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🛡️ **Strict Multi-Tenancy** | Database-level organizational data isolation. Every query is scoped by `organizationId` — cross-tenant data leakage is architecturally impossible. |
| 🤖 **AI Task Generation** | Powered by **Google Gemini 1.5 Flash**. Describe a task in plain English and the AI generates a fully structured task (title, description, priority, tags) instantly. |
| ⚡ **Real-Time Sync** | **Socket.io** rooms scoped per organization. Task updates and activity logs propagate live to all online members without a page refresh. |
| 📊 **Dynamic Dashboard** | Live metrics, Recharts-powered task breakdown charts, priority distribution, and a personalized team workflow overview. |
| 📝 **Advanced Task Board** | Full CRUD task management with `status` (todo / in-progress / completed), `priority` (low / medium / high), `tags`, `subtasks`, and multi-user assignment. |
| 🔍 **Activity Audit Log** | Every `CREATED_TASK`, `UPDATED_TASK`, and `DELETED_TASK` event is recorded and visible only to members within the same organization. |
| 👤 **Profile & Settings** | Users can update their profile, manage account preferences, and view their organizational membership. |
| 🔐 **RBAC Authorization** | Role-Based Access Control — `admin` members can manage all tasks; `member` users can only act on tasks they created or are assigned to. |
| 🖼️ **Cloudinary Uploads** | Avatar and media uploads handled via Cloudinary integration. |
| 💎 **Premium UI/UX** | Glassmorphism design, Framer Motion animations, Lucide icons, responsive layouts, and dark-mode-ready aesthetics. |
| 🐳 **Docker Ready** | Full-stack container orchestration via `docker-compose.yml` — spin up the entire app with one command. |

---

## 🛠️ Tech Architecture

| Layer | Stack |
|-------|-------|
| **Frontend** | React 19 (Vite), Tailwind CSS, Zustand, Framer Motion, Recharts, React Router v6, Axios |
| **Backend** | Node.js, Express.js, Socket.io, Mongoose ODM |
| **Database** | MongoDB Atlas (Cloud) or Local MongoDB |
| **AI** | Google Generative AI — Gemini 1.5 Flash |
| **Auth** | JWT (Access Token) + Refresh Token, Bcrypt password hashing |
| **Security** | Helmet headers, CORS, express-rate-limit (100 req / 15 min), cookie-parser |
| **Storage** | Cloudinary (avatar & file uploads) |
| **DevOps** | Docker, docker-compose, nodemon (dev), concurrently (monorepo scripts) |

---

## 🗂️ Folder Structure

```text
multi-tenant-saas/
├── package.json              # Root monorepo scripts
├── docker-compose.yml        # Full-stack Docker orchestration
│
├── backend/                  # Express REST API + Socket.io server
│   ├── server.js             # Entry point — Express, Socket.io, middleware mounts
│   ├── .env.example          # Environment variable template
│   ├── config/
│   │   └── db.js             # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Register, login, token management
│   │   ├── taskController.js      # Task CRUD with org-scoped queries & RBAC
│   │   ├── activityController.js  # Activity log retrieval
│   │   └── aiController.js        # Gemini AI task generation endpoint
│   ├── models/
│   │   ├── User.js           # User schema (name, email, role, organization ref)
│   │   ├── Organization.js   # Tenant schema
│   │   ├── Task.js           # Task schema (status, priority, subtasks, tags, assignees)
│   │   └── ActivityLog.js    # Immutable audit log schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── taskRoutes.js
│   │   ├── activityRoutes.js
│   │   └── aiRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT verification → attaches req.user
│   │   └── errorMiddleware.js # Global error handler
│   └── utils/
│       ├── ai.js              # Gemini API wrapper
│       └── logger.js          # Activity log helper
│
└── frontend/                 # React SPA (Vite)
    ├── vite.config.js
    └── src/
        ├── App.jsx            # Route definitions (lazy-loaded pages)
        ├── context/
        │   └── AuthContext.jsx     # Global auth state & token management
        ├── api/               # Axios instance with auth interceptors
        ├── store/             # Zustand global state (tasks, auth)
        ├── routes/
        │   └── ProtectedRoute.jsx
        ├── components/
        │   ├── layout/        # Navbar, Sidebar, DashboardLayout
        │   ├── dashboard/     # TaskCharts, stats cards
        │   ├── tasks/         # TaskView, TaskCard, TaskModal
        │   └── ui/            # Reusable UI primitives
        └── pages/
            ├── landing/       # Public landing page
            ├── auth/          # LoginPage, SignupPage
            ├── Dashboard.jsx
            ├── Activity.jsx
            ├── Profile.jsx
            └── Settings.jsx
```

---

## 🚦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) **v18+**
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (or a local MongoDB instance)
- A [Google AI Studio](https://aistudio.google.com/) API key (for Gemini AI feature)
- A [Cloudinary](https://cloudinary.com/) account (for file uploads)

---

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/your-username/xo-multi-tenant.git
cd xo-multi-tenant

# Install all dependencies (backend + frontend) in one command
npm run install:all
```

### 2. Configure Environment Variables

Copy the example file and fill in your credentials:

```bash
cp backend/.env.example backend/.env
```

```env
# backend/.env

# Server
NODE_ENV=development
PORT=5000

# Database
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/task_manager

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d
REFRESH_TOKEN_SECRET=your_refresh_token_secret

# Google Gemini AI
GEMINI_API_KEY=AIzaSy...

# Cloudinary (File Uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Run the Development Servers

**Option A — Run both together (recommended):**

```bash
# From the project root
npm run dev
```

**Option B — Run separately:**

```bash
# Terminal 1 — Backend API (http://localhost:5000)
npm run dev:backend

# Terminal 2 — Frontend (http://localhost:5173)
npm run dev:frontend
```

> The React app will be available at **`http://localhost:5173`**
> The API server will run at **`http://localhost:5000`**

---

## 🐳 Docker Deployment

The app ships with `Dockerfile` configurations for both services and a root `docker-compose.yml`.

```bash
# Build and start the entire stack
docker-compose up --build

# Or using the npm shortcut
npm run docker:up
```

> Ensure your production environment variables (`MONGO_URI`, `JWT_SECRET`, `GEMINI_API_KEY`, Cloudinary keys) are set before running in production mode.

---

## 🔌 API Reference

All protected routes require a `Bearer <token>` in the `Authorization` header.

### Auth — `/api/auth`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/register` | Public | Register user & create/join organization |
| `POST` | `/login` | Public | Login and receive JWT |

### Tasks — `/api/tasks`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/` | Private | Get tasks for the user's organization |
| `POST` | `/` | Private | Create a new task |
| `PUT` | `/:id` | Private | Update a task (owner or admin) |
| `DELETE` | `/:id` | Private | Delete a task (owner or admin) |

### Activity Logs — `/api/logs`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/` | Private | Retrieve activity log for the organization |

### AI — `/api/ai`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/generate` | Private | Generate task details from a plain-English prompt via Gemini |

---

## 🧪 Validating Multi-Tenant Isolation

To verify the architecture enforces strict tenancy:

1. **Register as Alice** — Create an organization called `Alpha Corp`. Add several tasks and observe the populated dashboard and charts.
2. **Register as Bob** — Open an **Incognito Window**. Register under a separate organization `Beta LLC`.
3. **Verify isolation** — Bob's dashboard and activity logs will be **completely empty** — none of Alice's data leaks across the tenant boundary.
4. **Test RBAC** — Use Postman to attempt a `DELETE /api/tasks/:alice_task_id` with Bob's JWT. The server responds with `401 Not authorized for this organization`.
5. **Test AI generation** — Click "Generate with AI" on the task creation modal, enter a prompt like *"Set up CI/CD pipeline for the new service"*, and watch Gemini return a fully structured task.

---

## 🔐 Security Model

- **JWT verification** on every protected route via `authMiddleware.js` — the decoded token injects `req.user` with `id`, `role`, and `organization`.
- **Organization scoping** — every database query filters by `req.user.organization`, making cross-tenant access structurally impossible, not just policy-enforced.
- **RBAC** — `admin` role has full org-wide task access; `member` role is limited to tasks they created or are assigned to.
- **Rate limiting** — 100 requests per 15-minute window per IP on all `/api/` routes.
- **Helmet** — sets secure HTTP headers on every response.
- **Bcrypt** — passwords are hashed before storage; plaintext is never persisted.

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start backend + frontend concurrently |
| `npm run dev:backend` | Start Express server only (nodemon) |
| `npm run dev:frontend` | Start Vite dev server only |
| `npm run install:all` | Install dependencies for both workspaces |
| `npm run docker:up` | Build & run the full Docker stack |

---

<div align="center">
  <sub>Built with ❤️ — XO Operations. Ship faster, scale safely.</sub>
</div>
