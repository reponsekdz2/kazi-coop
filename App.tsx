import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { LoanProvider } from './contexts/LoanContext';

// Layouts
import DashboardLayout from './components/layout/DashboardLayout';
import PublicLayout from './components/layout/PublicLayout';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import JobsPage from './pages/JobsPage';
import CooperativesPage from './pages/CooperativesPage';
import WalletPage from './pages/WalletPage';
import AnalyticsPage from './pages/AnalyticsPage';
import UserAnalyticsPage from './pages/UserAnalyticsPage';
import LearningPage from './pages/LearningPage';
import ProfilePage from './pages/ProfilePage';
import MessagesPage from './pages/MessagesPage';
import InterviewsPage from './pages/InterviewsPage';
import LandingPage from './pages/LandingPage';
import NotFoundPage from './pages/NotFoundPage';
import { UserRole } from './types';


const PrivateRoute: React.FC<{ children: React.ReactElement, roles?: UserRole[] }> = ({ children, roles }) => {
    const { user } = useAuth();
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />; // or a dedicated "access denied" page
    }
    return children;
};

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
        </Route>

        {/* Private Routes */}
        <Route path="/" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="jobs" element={<PrivateRoute roles={[UserRole.SEEKER, UserRole.EMPLOYER]}><JobsPage /></PrivateRoute>} />
          <Route path="cooperatives" element={<PrivateRoute roles={[UserRole.SEEKER, UserRole.COOP_ADMIN]}><CooperativesPage /></PrivateRoute>} />
          <Route path="wallet" element={<PrivateRoute roles={[UserRole.SEEKER]}><WalletPage /></PrivateRoute>} />
          <Route path="analytics" element={<PrivateRoute roles={[UserRole.COOP_ADMIN]}><AnalyticsPage /></PrivateRoute>} />
          <Route path="analytics/user" element={<PrivateRoute roles={[UserRole.EMPLOYER]}><UserAnalyticsPage /></PrivateRoute>} />
          <Route path="learning" element={<PrivateRoute roles={[UserRole.SEEKER]}><LearningPage /></PrivateRoute>} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="interviews" element={<PrivateRoute roles={[UserRole.SEEKER]}><InterviewsPage /></PrivateRoute>} />
        </Route>
        
        {/* Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};


const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <LoanProvider>
            <AppRoutes />
        </LoanProvider>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
