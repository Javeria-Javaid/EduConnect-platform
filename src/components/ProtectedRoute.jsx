import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * ProtectedRoute Component
 * 
 * Protects routes by checking authentication and role-based access.
 * 
 * @param {Array<string>} allowedRoles - Array of roles allowed to access the route
 * @returns {JSX.Element} - Either renders child routes via Outlet or redirects
 * 
 * Behavior:
 * - If not authenticated: redirects to /login with return location
 * - If authenticated but wrong role: redirects to /unauthorized
 * - If authenticated and correct role: renders child routes
 */
const ProtectedRoute = ({ allowedRoles = [] }) => {
  const location = useLocation();
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && (!role || !allowedRoles.includes(role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

