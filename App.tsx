import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { useAuth } from './contexts/AuthContext';

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
import LearningPage from './pages/LearningPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import LandingPage from './pages/LandingPage';
import MessagesPage from './pages/MessagesPage';
import InterviewsPage from './pages/InterviewsPage';
import UserAnalyticsPage from './pages/UserAnalyticsPage';
import LearningModulePage from './pages/LearningModulePage';
import { UserRole } from './types';

const PrivateRoute: React.FC<{ allowedRoles?: UserRole[] }> = ({ allowedRoles }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />; // Or an unauthorized page
  }
  return <DashboardLayout />;
};

const getBasename = () => {
    // This more specific regex looks for a canonical UUID v4 at the start of the path.
    // e.g., /98850db7-58f9-4950-a572-d55bd4028b4c/...
    const match = window.location.pathname.match(
        /^\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i
    );
    if (match && match[1]) {
        return `/${match[1]}`;
    }
    // Fallback for local dev or other environments where the path is just "/"
    return '/';
};


const App: React.FC = () => {
  const basename = getBasename();

  return (
    <AppProvider>
      <Router basename={basename}>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Private Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/interviews" element={<InterviewsPage />} />
            <Route path="/cooperatives" element={<CooperativesPage />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/learning" element={<LearningPage />} />
            <Route path="/learning/:moduleId" element={<LearningModulePage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            
            {/* Employer/Admin only routes */}
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/user-analytics" element={<UserAnalyticsPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;