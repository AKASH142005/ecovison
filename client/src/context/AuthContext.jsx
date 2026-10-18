import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('ecovision_token') || null);
  const [demoUsers, setDemoUsers] = useState([]);
  const [aggregations, setAggregations] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshAggregations = async () => {
    try {
      const res = await api.getProfileAggregations();
      if (res && res.success) {
        setAggregations(res);
      }
    } catch (e) {
      console.warn('Could not load profile aggregations:', e.message);
    }
  };

  // Initialize session and fetch demo users
  useEffect(() => {
    async function initAuth() {
      try {
        const demosRes = await api.getDemoUsers();
        if (demosRes.success) {
          setDemoUsers(demosRes.demoUsers || []);
        }

        if (token) {
          try {
            const meRes = await api.getMe();
            if (meRes.success && meRes.user) {
              setUser(meRes.user);
              refreshAggregations();
            }
          } catch (e) {
            console.warn('Session expired or invalid, auto-logging into customer demo account');
            await autoLoginDefault(demosRes.demoUsers);
          }
        } else {
          // Default to citizen customer
          await autoLoginDefault(demosRes.demoUsers);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    }

    async function autoLoginDefault(demos = []) {
      const defaultUser = demos.find(u => u.role === 'customer') || { role: 'customer' };
      try {
        const switchRes = await api.switchDemoRole(defaultUser.role || 'customer');
        if (switchRes.success) {
          localStorage.setItem('ecovision_token', switchRes.token);
          setToken(switchRes.token);
          setUser(switchRes.user);
          refreshAggregations();
        }
      } catch (e) {
        // Fallback default
        setUser({
          id: 'usr_customer_1',
          name: 'Kavitha Ramachandran',
          email: 'customer@ecovision.tn',
          role: 'customer',
          district: 'Chennai'
        });
      }
    }

    initAuth();
  }, []);

  const switchRole = async (targetRole) => {
    try {
      const res = await api.switchDemoRole(targetRole);
      if (res.success) {
        localStorage.setItem('ecovision_token', res.token);
        setToken(res.token);
        setUser(res.user);
        refreshAggregations();
        return res.user;
      }
    } catch (err) {
      console.error('Failed to switch role:', err);
      throw err;
    }
  };

  const login = async (email, password) => {
    const res = await api.login(email, password);
    if (res.success) {
      localStorage.setItem('ecovision_token', res.token);
      setToken(res.token);
      setUser(res.user);
      refreshAggregations();
      return res.user;
    }
  };

  const register = async (userData) => {
    const res = await api.register(userData);
    if (res.success) {
      localStorage.setItem('ecovision_token', res.token);
      setToken(res.token);
      setUser(res.user);
      refreshAggregations();
      return res.user;
    }
  };

  const logout = () => {
    localStorage.removeItem('ecovision_token');
    setToken(null);
    setAggregations(null);
    // Reset to Customer Citizen
    switchRole('customer');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        demoUsers,
        aggregations,
        refreshAggregations,
        loading,
        switchRole,
        login,
        register,
        logout,
        isCustomer: user?.role === 'customer',
        isDealer: user?.role === 'dealer',
        isFactory: user?.role === 'factory',
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
