import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import DashboardLayout from './components/layout/DashboardLayout';

// Pages
import LandingPage from './pages/landing/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import DashboardOverview from './pages/Dashboard';
import TaskView from './components/tasks/TaskView';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes with Main Navbar */}
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
            {/* Analytics, Team, Settings could go here */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>

          {/* Catch All */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
