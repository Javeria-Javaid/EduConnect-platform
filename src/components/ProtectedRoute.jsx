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

  // Debug: Log current auth state
  console.log('🔍 ProtectedRoute:', {
    path: location.pathname,
    isAuthenticated,
    role,
    allowedRoles
  });

  // Redirect to login if not authenticated, preserving intended destination
  if (!isAuthenticated) {
    console.log('🚫 Redirecting to login - not authenticated');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access if roles are specified
  if (allowedRoles.length > 0 && (!role || !allowedRoles.includes(role))) {
    console.log('❌ Access Denied - Role mismatch:', {
      userRole: role,
      allowedRoles,
      path: location.pathname
    });
    return <Navigate to="/unauthorized" replace />;
  }

  console.log('✅ Access Granted');

  // User is authenticated and has required role, render child routes
  return <Outlet />;
};

export default ProtectedRoute;

