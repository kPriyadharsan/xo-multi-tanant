<div align="center">
  <img src="https://images.unsplash.com/photo-1540350394557-8d14678e7f91?auto=format&fit=crop&q=80&w=2000" alt="XO Dashboard Preview" width="100%" style="border-radius: 12px;" />

  <br />
  <br />

  <h1>🌌 XO Multi-Tenant Task Management</h1>

  <p>
    A premium, high-performance Multi-Tenant Task Management system built with the MERN stack. Designed with beautiful glassmorphism, real-time sync, and strict organizational data isolation.
  </p>

  <p>
    <a href="#-key-features"><strong>Explore Features »</strong></a>
    <br />
    <br />
    <a href="#-getting-started">View Setup</a> · <a href="#-docker-deployment">Docker Config</a> · <a href="#-validating-multi-tenant-isolation">Architecture</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node" />
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="Mongo" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  </p>
</div>

---

## ✨ Key Features

* **🛡️ Strict Multi-Tenancy**: Complete data isolation. Organizations cannot see or interact with each other's data, enforced securely at the database query level.
* **⚡ Dynamic & Live Dashboard**: View real-time activity metrics, task breakdowns, charts, and a personalized overview of your team's workflow.
* **📝 Advanced Task Boards**: Built for productivity—organize robust tasks alongside specific priorities, statuses, tags, and subtasks mapped to assignees.
* **🔍 Activity Audit Logs**: Every task creation, status update, and deletion is recorded on a comprehensive activity log viewable only by members of your organization.
* **💎 Premium UI/UX Aesthetics**: Developed with a modern glassmorphism design ethos, dynamic Framer Motion animations, soft gradients, and clean Lucide iconography.
* **🐳 Docker Ready**: Effortless deployment environment utilizing full-stack container orchestration.

## 🛠 Tech Architecture

| Core Layer     | Technology Stack                                                           |
|----------------|----------------------------------------------------------------------------|
| **Frontend**   | React (Vite), Tailwind CSS, Zustand, Framer Motion, Recharts               |
| **Backend**    | Node.js, Express.js, Socket.io (Real-time), Mongoose (ODM)                 |
| **Database**   | MongoDB Cloud (Atlas) or Local Mongo Database                              |
| **Security**   | JWT Authentication, Bcrypt Hashing, Helmet Headers, Rate Limiting Middleware|

---

## 🚦 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/en/) (v18+)
- [MongoDB Atlas](https://www.mongodb.com/atlas) Account (or local instance)

### 1. Environment Setup

Create a `.env` file within the `/backend` directory and add your private configurations:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_cluster_uri
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d
```

### 2. Run the Backend Server

```bash
cd backend
npm install
npm run dev
```

### 3. Run the Frontend Client

Open a new terminal window for the React app:

```bash
cd frontend
npm install
npm run dev
```

> Application boots up on **`http://localhost:5173`** locally.

---

## 🐳 Docker Deployment

The application includes scalable `Dockerfile` configurations and a `docker-compose.yml` for unified bootstrapping.

```bash
# Build and run the entire stack seamlessly
docker-compose up --build
```

---

## 🧪 Validating Multi-Tenant Isolation

To truly test our architecture's strict SaaS multi-tenancy capabilities:

1. **User A**: Register as `Alice` and initiate a Workspace explicitly named `Alpha Corp`.
2. **Populate Data**: Create tasks, switch states, and view the populated charts.
3. **User B**: Open an Incognito Window. Register as `Bob` and establish an organization named `Beta LLC`.
4. **Data Privacy**: As `Bob`, view the dashboard and logs. They will be **clean**—none of Alice's tasks or activities leak across bounds.
5. **Enforced Security**: If Bob tries to access an endpoint simulating Alice's task ID via Postman, the backend server automatically shuts the request down with an `Unauthorized` block.

---

## 🌟 Contributing & Folder Structure

XO incorporates an intuitive directory skeleton optimized for large-scale MERN deployments:

```text
├── frontend/             # Single Page React Application interface
│   ├── src/
│   │   ├── components/   # Independent UI elements (Cards, Modals)
│   │   ├── pages/        # Router View Pages (Dashboard, Settings, Auth)
│   │   ├── store/        # Global Zustand states (Auth, Tasks)
│   │   └── api/          # Axios HTTP intercepts
├── backend/              # Fast Express RESTful Service
│   ├── controllers/      # Route logics tailored to API endpoints
│   ├── models/           # Mongoose ODM Schemas
│   ├── routes/           # Express Routers
│   └── middleware/       # JWT RBAC verification & Error interceptors
└── docker-compose.yml    # Root Docker container configurations
```

<br />

<div align="center">
  <sub>Built with ❤️ by the XO Operations team. Enjoy shipping software faster.</sub>
</div>
