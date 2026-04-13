import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

// Components
import Navbar from './components/layout/Navbar';
import DashboardLayout from './components/layout/DashboardLayout';
import LogoutConfirmation from './components/layout/LogoutConfirmation';

// Lazy Loaded Pages
const LandingPage = lazy(() => import('./pages/landing/LandingPage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const SignupPage = lazy(() => import('./pages/auth/SignupPage'));
const DashboardOverview = lazy(() => import('./pages/Dashboard'));
const TaskView = lazy(() => import('./components/tasks/TaskView'));
const ProfilePage = lazy(() => import('./pages/Profile'));
const ActivityPage = lazy(() => import('./pages/Activity'));
const SettingsPage = lazy(() => import('./pages/Settings'));

const PageLoader = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
    <div className="relative">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
        <div className="absolute inset-0 bg-indigo-600/10 blur-xl rounded-full animate-pulse" />
    </div>
    <p className="text-sm font-bold text-slate-400 animate-pulse tracking-widest uppercase">Initializing TaskFlow</p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#1e293b',
            padding: '16px',
            borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
            fontSize: '14px',
            fontWeight: '600'
          },
        }}
      />
      <LogoutConfirmation />
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<><Navbar /><LandingPage /></>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            {/* Protected Dashboard Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardOverview />} />
              <Route path="tasks" element={<TaskView />} />
              <Route path="activity" element={<ActivityPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>

            {/* Catch All */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
