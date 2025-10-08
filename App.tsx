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
// FIX: Added missing import for CooperativesPage.
import CooperativesPage from './pages/CooperativesPage';
import WalletPage from './pages/WalletPage';
import AnalyticsPage from './pages/AnalyticsPage';
import LearningPage from './pages/LearningPage';
import SettingsPage from './pages/SettingsPage';
import LandingPage from './pages/LandingPage';
import MessagesPage from './pages/MessagesPage';
import InterviewsPage from './pages/InterviewsPage';
import UserAnalyticsPage from './pages/UserAnalyticsPage';
import LearningModulePage from './pages/LearningModulePage';
import HelpCenterPage from './pages/HelpCenterPage';
import CareerPathPage from './pages/CareerPathPage'; // Import the new page
import AdminContentPage from './pages/AdminContentPage'; // Import new Admin page
import MyApplicationsPage from './pages/MyApplicationsPage'; // Import new Applications page
// FIX: Added missing import for UserRole.
import { UserRole } from './types';

// FIX: Added `children: React.ReactNode` to the props type to resolve type errors.
const PrivateRoute: React.FC<{ children: React.ReactNode; allowedRoles?: UserRole[] }> = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />; // Or an unauthorized page
  }
  return <>{children}</>;
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

const AuthRoutes: React.FC = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Private Routes */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/jobs" element={<PrivateRoute><JobsPage /></PrivateRoute>} />
        <Route path="/applications" element={<PrivateRoute allowedRoles={[UserRole.SEEKER]}><MyApplicationsPage /></PrivateRoute>} />
        <Route path="/interviews" element={<PrivateRoute><InterviewsPage /></PrivateRoute>} />
        <Route path="/cooperatives" element={<PrivateRoute><CooperativesPage /></PrivateRoute>} />
        <Route path="/wallet" element={<PrivateRoute><WalletPage /></PrivateRoute>} />
        <Route path="/learning" element={<PrivateRoute><LearningPage /></PrivateRoute>} />
        <Route path="/learning/:moduleId" element={<PrivateRoute><LearningModulePage /></PrivateRoute>} />
        <Route path="/messages" element={<PrivateRoute><MessagesPage /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
        <Route path="/help" element={<PrivateRoute><HelpCenterPage /></PrivateRoute>} />
        <Route path="/career-path" element={<PrivateRoute><CareerPathPage /></PrivateRoute>} />
        
        {/* Employer/Admin only routes */}
        <Route path="/analytics" element={<PrivateRoute allowedRoles={[UserRole.EMPLOYER]}><AnalyticsPage /></PrivateRoute>} />
        <Route path="/user-analytics" element={<PrivateRoute allowedRoles={[UserRole.EMPLOYER]}><UserAnalyticsPage /></PrivateRoute>} />
        <Route path="/content-management" element={<PrivateRoute allowedRoles={[UserRole.EMPLOYER]}><AdminContentPage /></PrivateRoute>} />

        {/* Wildcard for private routes, redirects to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

const App: React.FC = () => {
  const basename = getBasename();

  return (
    <AppProvider>
      <Router basename={basename}>
        <AuthRoutes />
      </Router>
    </AppProvider>
  );
};

export default App;