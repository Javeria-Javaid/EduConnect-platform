import { createContext, useContext, useMemo, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
             headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
             const userData = await res.json();
             setUser(userData);
          } else {
             localStorage.removeItem('token');
             setUser(null);
          }
        } catch (error) {
          console.error("Auth check failed", error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = (userData) => {
    // userData should include token and user details
    if (userData.token) {
        localStorage.setItem('token', userData.token);
    }
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    // Fixed: redirect to /login instead of /auth (which doesn't exist)
    window.location.href = '/login';
  };

  const updateUser = (newData) => {
    setUser(prev => prev ? { ...prev, ...newData } : newData);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      role: user?.role ?? null,
      login,
      logout,
      updateUser,
      loading
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

