# 🚀 TaskFlow — Multi-Tenant SaaS Task Manager

[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%209-47A248?logo=mongodb&logoColor=white)](https://mongoosejs.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.x-010101?logo=socket.io)](https://socket.io/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](https://docker.com/)

**TaskFlow** is a production-grade, multi-tenant Task Management SaaS platform built for high-collaboration teams. It features strict per-organization data isolation, Role-Based Access Control (RBAC), real-time notifications via Socket.io, Gemini AI task enrichment, and a polished dark-mode UI.

---

## 🏗️ Architecture Overview

Built on the **MERN** stack with a focus on scalability, security, and developer experience:

| Layer | Stack |
|---|---|
| **Frontend** | React 19 (Vite) · Framer Motion · Vanilla CSS (dark mode) |
| **Backend** | Node.js · Express 5 · Socket.io 4 |
| **Database** | MongoDB Atlas · Mongoose 9 |
| **AI** | Google Gemini Pro (`@google/generative-ai`) |
| **File Storage** | Cloudinary (avatar / attachment uploads) |
| **Security** | JWT (httpOnly Cookies) · Helmet · CORS · Per-user Rate Limiting |
| **DevOps** | Docker · Docker Compose |

---

## 🔥 Core Features

### 🏢 1. Strict Multi-Tenancy
- Every database query is automatically scoped to `req.user.organization` — the **Golden Rule**.
- Users can never read, write, or delete data belonging to another tenant.
- Supports two onboarding modes: **Create a new workspace** or **Join an existing one** (requires Workspace Name + ID verification).

### 🛡️ 2. Role-Based Access Control (RBAC)
| Role | Capabilities |
|---|---|
| **Admin** | Full control — manage users, roles, all tasks, org settings, activity logs |
| **Manager** | Oversee all team tasks and activity; restricted from billing/admin settings |
| **Member** | Create & manage own tasks, collaborate with the team |

### 🔔 3. Real-Time Notification System
- In-app notifications pushed live via **Socket.io** (no polling).
- Notifications for task assignments, status changes, and team events.
- Mark as read / mark all as read support with unread badge counter.
- Persisted in MongoDB (`Notification` model) for retrieval after reconnect.

### 🤖 4. Gemini AI Task Enrichment
- Describe a task briefly → Gemini expands it into a full description, suggests tags, and sets a priority level.
- Dedicated `aiLimiter` middleware enforces **50 AI requests per user per hour** to control API costs.

### 📊 5. Activity & Audit Logs
- Every critical action (create / update / delete task, role changes) is logged with timestamp, user, and IP address.
- Audit trail is **per-user IP tracked** — users behind shared NAT get individual records.
- Viewable in the dedicated **Activity** page (Admin/Manager only).

### 🔒 6. Tiered, Per-User Rate Limiting
| Limiter | Window | Limit | Scope |
|---|---|---|---|
| `apiLimiter` | 15 min | 200 requests | Per IP + User ID |
| `authLimiter` | 1 hour | 20 attempts | Per IP (brute-force guard) |
| `aiLimiter` | 1 hour | 50 requests | Per IP + User ID |

### 🌙 7. Premium Dark Mode UI
- Full dark-mode theme implemented via CSS custom properties — zero flash on load.
- Apple-inspired minimalist design with smooth Framer Motion animations and glassmorphism effects.
- All components (Dashboard, Team, Activity, Notifications, Profile, Settings) are theme-aware.

### 🖼️ 8. Cloudinary File Uploads
- Avatar images and any future attachments are uploaded to Cloudinary via `multer`.
- URLs are stored on the `User` document after a successful upload.

---

## 🛠️ Technical Deep-Dive

### Authentication & Authorization Flow
```
[Client] → POST /api/auth/login
         → authController validates credentials
         → JWT signed & set as httpOnly cookie (SameSite=Strict)
         → [protect middleware] verifies token + hydrates req.user & req.user.organization
         → [authorize(roles)] guards role-sensitive endpoints
```

### Socket.io Real-Time Flow
```
[Server] io.to(organizationId).emit('notification', payload)
         ↓
[Client] socket.on('notification', handler)
         → Updates notification store (React context / Zustand)
         → Badge counter increments instantly
```

### Data Isolation Pattern
Every controller follows this pattern:
```js
// Example: fetch tasks only for this tenant
const tasks = await Task.find({ organization: req.user.organization });
```
No controller ever queries without the organization scope.

---

## 📂 Project Structure

```
Multi-tenant APP/
├── docker-compose.yml          # Orchestrates backend + frontend containers
├── backend/
│   ├── server.js               # Express + Socket.io entry point
│   ├── config/                 # DB connection helpers
│   ├── controllers/
│   │   ├── authController.js   # Register (create/join org), Login, Logout
│   │   ├── taskController.js   # CRUD + AI enrichment trigger
│   │   ├── userController.js   # Profile, avatar upload, role management
│   │   ├── notificationController.js # Get, mark-read, mark-all-read
│   │   ├── activityController.js     # Audit log retrieval
│   │   └── aiController.js     # Gemini prompt handler
│   ├── models/
│   │   ├── User.js             # name, email, password, role, organization, avatar, ipHistory
│   │   ├── Organization.js     # name, slug, owner
│   │   ├── Task.js             # title, description, status, priority, tags, assignee, organization
│   │   ├── Notification.js     # recipient, type, message, isRead, organization
│   │   └── ActivityLog.js      # action, user, ip, organization, createdAt
│   ├── middleware/
│   │   ├── authMiddleware.js   # protect + authorize(roles)
│   │   ├── rateLimiter.js      # apiLimiter, authLimiter, aiLimiter
│   │   └── errorMiddleware.js  # Global error handler
│   ├── routes/                 # auth, tasks, users, notifications, activity, ai
│   ├── utils/                  # AI helper, logger utilities
│   ├── Dockerfile
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── App.jsx             # Router setup + protected routes
    │   ├── api/                # Axios instance + service modules
    │   ├── components/
    │   │   ├── layout/         # Sidebar, Navbar, NotificationBell
    │   │   ├── dashboard/      # Stats cards, charts
    │   │   ├── tasks/          # TaskCard, TaskModal, CreateTaskForm
    │   │   └── ui/             # Button, Modal, Badge, LogoutModal
    │   ├── context/            # AuthContext (user + org state)
    │   ├── store/              # Notification store (Zustand)
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   ├── Team.jsx
    │   │   ├── Activity.jsx
    │   │   ├── Profile.jsx
    │   │   ├── Settings.jsx
    │   │   ├── auth/           # LoginPage, SignupPage (create/join mode)
    │   │   └── landing/        # LandingPage
    │   └── routes/             # ProtectedRoute, RoleRoute wrappers
    └── Dockerfile
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+
- **MongoDB** (Local instance or MongoDB Atlas)
- **Google Gemini API Key**
- **Cloudinary Account** (for avatar uploads)

### 1. Clone the Repository
```bash
git clone <repo-url>
cd Multi-tenant-APP
```

### 2. Backend Setup
```bash
cd backend
cp .env.example .env
# Fill in the values in .env
npm install
npm run dev        # Starts on http://localhost:5000
```

**`.env` Reference:**
```env
NODE_ENV=development
PORT=5000

MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/task_manager

JWT_SECRET=your_super_secret_key
JWT_EXPIRE=30d
REFRESH_TOKEN_SECRET=your_refresh_secret

GEMINI_API_KEY=AIzaSy...

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev        # Starts on http://localhost:5173
```

### 4. Docker (Optional — Full Stack)
```bash
# From the project root, with .env values set
docker-compose up --build
```

---

## 🔑 Key API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | ❌ | Create or join an organization |
| `POST` | `/api/auth/login` | ❌ | Login and receive JWT cookie |
| `POST` | `/api/auth/logout` | ✅ | Clear session cookie |
| `GET` | `/api/tasks` | ✅ | Get all tasks (org-scoped) |
| `POST` | `/api/tasks` | ✅ Member+ | Create a new task |
| `PUT` | `/api/tasks/:id` | ✅ Member+ | Update a task |
| `DELETE` | `/api/tasks/:id` | ✅ Admin | Delete a task |
| `GET` | `/api/users` | ✅ Admin | List all org members |
| `PUT` | `/api/users/:id/role` | ✅ Admin | Update a user's role |
| `GET` | `/api/notifications` | ✅ | Get notifications for current user |
| `PUT` | `/api/notifications/read-all` | ✅ | Mark all notifications as read |
| `GET` | `/api/activity` | ✅ Admin/Mgr | Get org activity logs |
| `POST` | `/api/ai/enrich` | ✅ | Gemini task enrichment |

---

## 🔐 Security Highlights

- **httpOnly Cookies**: JWT is never exposed to JavaScript — XSS-safe.
- **Helmet.js**: Sets secure HTTP headers on every response.
- **Per-user Rate Limiting**: Rate limits are keyed by `IP + UserID`, so shared NAT networks don't penalize innocent users.
- **RBAC Middleware**: Every sensitive route is guarded by `authorize(['admin'])` or `authorize(['admin', 'manager'])`.
- **Input Sanitization**: Mongoose schema validation acts as the last line of defense.
- **IP Audit Trail**: User IP addresses are logged on critical actions for compliance.

---

## 🤝 Contributing

This platform is designed to be extensible. To add a new feature:

1. **Backend**: Add your Mongoose model, controller, and route. Always scope queries with `{ organization: req.user.organization }`.
2. **Frontend**: Add a new page/component. Use `AuthContext` to access the current user and organization.
3. **Real-time**: Emit events from the backend via `req.io.to(organizationId).emit(...)` and consume them in the frontend notification store.

---

*Built with ❤️ by Priyadharsan K*
