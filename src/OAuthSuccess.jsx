import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';

const OAuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth(); // We might need to adjust AuthContext to handle just setting user/token directly or reuse login logic

  useEffect(() => {
    const token = searchParams.get('token');
    const role = searchParams.get('role');

    if (token && role) {
      // Store token
      localStorage.setItem('token', token);
      
      // Trigger a state update in AuthContext if possible, or just force a reload/re-check
      // Since our AuthContext checks token on mount, a simple navigation might not trigger a re-fetch unless we manually set state.
      // Let's manually fetch 'me' or just reload the page to be safe and simple, 
      // OR better: use a method from AuthContext to set the state.
      
      // Ideally we should call a method in AuthContext to validate the token and set the user.
      // But for now, let's assume the token is valid and we redirect.
      // The AuthContext will pick it up on next mount/refresh or we can trigger a check.
      
      // We'll force a window reload to ensure AuthContext picks up the new token
      window.location.href = getDashboardRoute(role);
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate]);

  const getDashboardRoute = (role) => {
    switch (role) {
      case 'admin':
        return '/dashboard';
      case 'teacher':
        return '/teacher/dashboard';
      case 'parent':
        return '/parent/dashboard';
      case 'vendor':
        return '/vendor/dashboard';
      default:
        return '/dashboard';
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Authenticating...</h2>
        <p>Please wait while we redirect you to your dashboard.</p>
      </div>
    </div>
  );
};

export default OAuthSuccess;
