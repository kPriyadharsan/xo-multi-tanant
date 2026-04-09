# 🌌 XO Multi-Tenant SaaS Task Management

A premium, high-performance Multi-Tenant Task Management system built with the MERN stack (MongoDB, Express, React, Node.js). Featuring strict data isolation, real-time activity tracking, and a sleek modern UI.

![Aesthetic Dashboard Preview](https://images.unsplash.com/photo-1540350394557-8d14678e7f91?auto=format&fit=crop&q=80&w=2000)

## 🚀 Key Features

- **Strict Multi-Tenancy**: Complete data isolation between organizations using MongoDB ObjectId references.
- **Dynamic Dashboard**: Real-time task statistics, weekly activity charts, and personalized organizational greetings.
- **Activity Log Architecture**: Detailed event tracking (Creation, Updates, Deletions) per organization.
- **Advanced Task Management**: Subtasks, multi-user assignments, priorities, and status tracking.
- **Scalable Auth**: JWT-based authentication with organization-level access control.
- **Premium UI/UX**: Built with Framer Motion animations, Lucide Icons, and Glassmorphism aesthetics.

---

## 🛠 Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Zustand (State Management), Lucide React.
- **Backend**: Node.js, Express, Mongoose (MongoDB ODM).
- **Security**: JWT, BcryptJS, Helmet, Express-Rate-Limit.
- **DevOps**: Docker, Docker Compose, Nodemon.

---

## 🏗 Project Structure

```text
├── frontend/             # React + Vite Application
│   ├── src/
│   │   ├── components/   # Reusable UI & Logical components
│   │   ├── store/        # Zustand state stores
│   │   └── pages/        # Main application views
├── backend/              # Node.js + Express API
│   ├── models/           # Mongoose schemas
│   ├── controllers/      # Route logic
│   ├── middleware/       # Auth & Error handling
│   └── config/           # Database & Provider configs
└── docker-compose.yml    # Full stack orchestration
```

---

## 🚦 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)
- [Optional] Docker Desktop

### 2. Environment Setup
Create a `.env` file in the **backend** directory:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_cluster_uri
JWT_SECRET=your_secret_key
JWT_EXPIRE=30d
```

### 3. Installation & Local Development

**Run the Backend:**
```bash
cd backend
npm install
npm run dev
```

**Run the Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## 🐳 Docker Deployment
Run the entire stack with a single command:
```bash
docker-compose up --build
```

---

## 📖 How to Use

1. **Sign Up (Create Workspace)**: 
   - Navigate to the frontend UI (`http://localhost:5173` locally).
   - Click "Create Workspace" and fill in your details, including an **Organization Name**. The first user created for an organization is designated as the `admin`.
2. **Dashboard**: 
   - Upon logging in, you'll see a dynamic dashboard with statistics and interactive activity charts based on the real tasks for your organization.
3. **Tasks Board**: 
   - Create, edit, and assign tasks. Subtasks can be tracked for progress.
4. **Activity Logs**: 
   - Every creation, update, or deletion of a task is recorded and viewable in the Activity page, showing exactly who performed the action.

---

## 🧪 Testing Multi-Tenancy & Data Isolation

To truly test the multi-tenant architecture, try the following:

1. **User A**: Sign up as `Alice` and set Organization to `Alpha Corp`.
2. **Create Data**: Create a few tasks as Alice. Verify they appear on the dashboard and in the activity logs.
3. **User B**: Open a private/incognito window. Sign up as `Bob` and set Organization to `Beta LLC`.
4. **Verify Isolation**: As Bob, check the dashboard, tasks, and activity logs. You should see an empty state—**none of Alice's tasks or activities will be visible**.
5. **Cross-Tenant Prevention**: Even using direct API testing tools (like Postman) with Bob's JWT, any attempt to access Alice's task IDs will be rejected by the backend controller's ownership checks.

---

## 🔒 Security & Data Isolation
The application uses a **Shared Database, Shared Schema** approach with discriminant fields. Every document (Task, User, ActivityLog) stores an `organization` ID. The backend middleware enforces strict filtering:
- Users can only see tasks within their organization.
- Cross-tenant data leaks are prevented at the database query level.

---

## 📝 License
Distributed under the MIT License. See `LICENSE` for more information.
