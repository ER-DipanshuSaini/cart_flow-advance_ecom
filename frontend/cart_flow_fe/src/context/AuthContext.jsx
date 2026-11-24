import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('cf_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('cf_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('cf_user');
      }
    } catch {
      // storage disabled
    }
  }, [user]);

  const login = (email, password, role = 'customer') => {
    // Client-side authentication simulation (DRF API ready)
    const newUser = {
      id: role === 'admin' ? 'ADM-001' : 'USR-102',
      name: role === 'admin' ? 'System Administrator' : email.split('@')[0],
      email,
      role, // 'customer' | 'admin'
    };
    setUser(newUser);
    return newUser;
  };

  const register = (name, email, password) => {
    const newUser = {
      id: 'USR-' + Math.floor(100 + Math.random() * 900),
      name,
      email,
      role: 'customer',
    };
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
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
