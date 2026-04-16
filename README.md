# 🚀 TaskFlow: Multi-Tenant SaaS Platform

TaskFlow is a high-performance, enterprise-grade multi-tenant Task Management SaaS designed for high-collaboration teams. It features strict data isolation, sophisticated Role-Based Access Control (RBAC), and Gemini AI integration.

## 🏗️ Architecture Overview

The platform is built on a modern **MERN** stack with a focus on scalability and security:

- **Frontend**: React (Vite) + Tailwind CSS + Framer Motion
- **Backend**: Node.js + Express
- **Database**: MongoDB (Mongoose)
- **Real-time**: Socket.io for live updates
- **AI**: Google Gemini Pro integration

---

## 🔥 Key Features

### 🏢 1. Strict Multi-Tenancy
- **Data Isolation**: Every request is scoped to an `organization`. Users can *never* access data from another tenant.
- **Dynamic Organization Creation**: New organizations are created on-the-fly during registration.
- **Slug-based Routing**: Built for future support of custom subdomains.

### 🛡️ 2. Advanced RBAC (Role-Based Access Control)
- **Admin**: The organization owner. Can manage users, change roles, delete any task, and view full activity logs.
- **Manager**: Empowered to oversee all team tasks and activity but restricted from billing and global admin settings.
- **Member**: Can create tasks, work on assigned tasks, and collaborate with colleagues.

### 🤖 3. Gemini AI Task Specialist
- **Auto-Generation**: Describe a task briefly, and Gemini will expand it into a detailed description, suggest relevant tags, and set appropriate priority levels.
- **Smart Enrichment**: Enhances productivity by reducing manual data entry for project leads.

### 📊 4. Real-time Activity Tracking
- **Audit Logs**: Every critical action (Creating, Updating, Deleting tasks) is logged with a timestamp and user ID.
- **Socket.io Integration**: Changes are broadcasted across the organization for a live, collaborative feel.

---

## 🛠️ Technical Workflow

### Authentication & Authorization
1. **JWT in Cookies**: Secure, `httpOnly` cookies handle session management to prevent XSS attacks.
2. **Middleware Chain**:
   - `protect`: Verifies the JWT and attaches the `user` and their `organization` to the request object.
   - `authorize(roles)`: Checks if the logged-in user has the necessary permissions for the specific endpoint.

### Data Flow
- **Filtering**: Every database query in the controller includes `{ organization: req.user.organization }`. This is the "Golden Rule" of the backend.
- **Population**: Uses MongoDB `.populate()` to provide rich object data while maintaining a flat database structure for performance.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Google Gemini API Key

### Backend Setup
1. Navigate to `/backend`
2. Create a `.env` file (see `.env.example`):
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_secret
   GEMINI_API_KEY=your_key
   ```
3. Run `npm install`
4. Run `npm run dev`

### Frontend Setup
1. Navigate to `/frontend`
2. Run `npm install`
3. Run `npm run dev` (Access via `http://localhost:5173`)

---

## 📂 Project Structure

```text
├── backend/
│   ├── controllers/    # Business logic (tasks, users, auth)
│   ├── models/         # Mongoose Schemas (Multitenant-ready)
│   ├── middleware/     # RBAC & Auth protection
│   ├── routes/         # API Endpoint definitions
│   └── utils/          # AI & Logging helpers
├── frontend/
│   ├── src/
│   │   ├── api/        # Axios interceptors & services
│   │   ├── components/ # Reusable UI & Task components
│   │   ├── context/    # Global Auth & State
│   │   ├── pages/      # Dashboard, Team, Identity pages
│   │   └── routes/     # Protected Route wrapper
```

## 🤝 Contribution
The platform is designed to be extensible. To add a new feature, ensure you follow the multi-tenant pattern by always referencing `req.user.organization` in your logic.

---

*Built with ❤️ by the priyadharsan k*
