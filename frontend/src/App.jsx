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
import ErrorBoundary from './components/layout/ErrorBoundary';

// Lazy Loaded Pages
const LandingPage = lazy(() => import('./pages/landing/LandingPage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const SignupPage = lazy(() => import('./pages/auth/SignupPage'));
const DashboardOverview = lazy(() => import('./pages/Dashboard'));
const TaskView = lazy(() => import('./components/tasks/TaskView'));
const ProfilePage = lazy(() => import('./pages/Profile'));
const ActivityPage = lazy(() => import('./pages/Activity'));
const SettingsPage = lazy(() => import('./pages/Settings'));
const TeamPage = lazy(() => import('./pages/Team'));

const PageLoader = () => (
  <div className="min-h-screen flex flex-col items-center justify-center themed-bg gap-4">
    <div className="relative">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
        <div className="absolute inset-0 bg-indigo-600/10 blur-xl rounded-full animate-pulse" />
    </div>
    <p className="text-sm font-bold opacity-40 animate-pulse tracking-widest uppercase themed-text">Initializing TaskFlow</p>
  </div>
);

function App() {
  React.useEffect(() => {
    const theme = localStorage.getItem('theme') || 'light';
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <AuthProvider>
      <Toaster
        position="bottom-right"
        gutter={12}
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(255,255,255,0.85)',
            color: '#1e293b',
            padding: '14px 18px',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)',
            fontSize: '14px',
            fontWeight: '500',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.6)',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#f43f5e', secondary: '#fff' },
          },
        }}
      />
      <LogoutConfirmation />
      <ErrorBoundary>
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
                <Route path="team" element={<TeamPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Route>
  
              {/* Catch All */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Router>
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default App;
