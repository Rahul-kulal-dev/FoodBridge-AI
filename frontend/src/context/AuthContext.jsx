import React, { createContext, useContext, useState, useEffect } from 'react';
import { getApiUrl } from '../config/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    // Check localStorage first, fallback to window object if any
    return localStorage.getItem('foodbridge_token') || window.__FOODBRIDGE_AUTH_TOKEN__ || null;
  });
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('foodbridge_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Sync token to localStorage and memory global ref
  useEffect(() => {
    if (token) {
      localStorage.setItem('foodbridge_token', token);
      window.__FOODBRIDGE_AUTH_TOKEN__ = token;
    } else {
      localStorage.removeItem('foodbridge_token');
      localStorage.removeItem('foodbridge_user');
      delete window.__FOODBRIDGE_AUTH_TOKEN__;
    }
  }, [token]);

  // Keep localStorage in sync with user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('foodbridge_user', JSON.stringify(user));
    } else if (!token) {
      localStorage.removeItem('foodbridge_user');
    }
  }, [user, token]);

  // Fetch live user profile from MongoDB Atlas backend whenever token changes or on initial mount
  const fetchProfile = async (authToken = token) => {
    if (!authToken) {
      setUser(null);
      setLoading(false);
      return null;
    }

    try {
      const res = await fetch(getApiUrl('/api/users/profile'), {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
          localStorage.setItem('foodbridge_user', JSON.stringify(data.user));
          return data.user;
        }
      }

      // If token invalid/expired (401 or 403), reset auth state
      if (res.status === 401 || res.status === 403) {
        logout();
      }
      return null;
    } catch (err) {
      console.error('Failed to fetch user profile from MongoDB Atlas:', err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfile(token);
    } else {
      setLoading(false);
    }
  }, []);

  const login = (newToken, newUser) => {
    if (newToken) {
      localStorage.setItem('foodbridge_token', newToken);
      window.__FOODBRIDGE_AUTH_TOKEN__ = newToken;
    }
    if (newUser) {
      localStorage.setItem('foodbridge_user', JSON.stringify(newUser));
    }
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('foodbridge_token');
    localStorage.removeItem('foodbridge_user');
    delete window.__FOODBRIDGE_AUTH_TOKEN__;
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    if (updatedUser) {
      localStorage.setItem('foodbridge_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        login,
        logout,
        updateUser,
        fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

