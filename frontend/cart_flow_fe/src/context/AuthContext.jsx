import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // 1. Customer User State
  const [customer, setCustomer] = useState(() => {
    try {
      const saved = localStorage.getItem('cf_customer');
      return saved
        ? JSON.parse(saved)
        : {
            id: 'USR-8821',
            name: 'Vikramaditya Roy',
            email: 'vikram.roy@cartflow.luxury',
            phone: '+91 98765 43210',
            avatar: 'V',
            tier: 'VIP Club Member',
            joined: 'October 2025',
          };
    } catch {
      return null;
    }
  });

  // 2. Admin / Staff State
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem('cf_admin');
      return saved
        ? JSON.parse(saved)
        : {
            id: 'ADM-007',
            name: 'BattleOne Chief Administrator',
            email: 'admin@battleone.cartflow.internal',
            role: 'super-admin', // 'super-admin' | 'supplier' | 'logistics'
            workspace: 'CartFlow Main Retail',
            avatar: 'B',
          };
    } catch {
      return null;
    }
  });

  // 3. Active Admin Perspective / Role for multi-role simulation
  const [adminRole, setAdminRole] = useState(() => {
    return adminUser?.role || 'super-admin';
  });

  useEffect(() => {
    try {
      if (customer) {
        localStorage.setItem('cf_customer', JSON.stringify(customer));
      } else {
        localStorage.removeItem('cf_customer');
      }
    } catch {
      // storage disabled
    }
  }, [customer]);

  useEffect(() => {
    try {
      if (adminUser) {
        localStorage.setItem('cf_admin', JSON.stringify(adminUser));
      } else {
        localStorage.removeItem('cf_admin');
      }
    } catch {
      // storage disabled
    }
  }, [adminUser]);

  // Customer Login / Register
  const loginCustomer = (email, password) => {
    const newCust = {
      id: 'USR-' + Math.floor(1000 + Math.random() * 9000),
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      email,
      phone: '+91 98112 33455',
      avatar: email.charAt(0).toUpperCase(),
      tier: 'Gold Member',
      joined: 'November 2026',
    };
    setCustomer(newCust);
    return newCust;
  };

  const registerCustomer = (name, email, password) => {
    const newCust = {
      id: 'USR-' + Math.floor(1000 + Math.random() * 9000),
      name,
      email,
      phone: '+91 98112 33455',
      avatar: name.charAt(0).toUpperCase(),
      tier: 'New Member',
      joined: 'Today',
    };
    setCustomer(newCust);
    return newCust;
  };

  const logoutCustomer = () => {
    setCustomer(null);
  };

  // Admin Login / Logout
  const loginAdmin = (workspaceKey, secretPasskey, role = 'super-admin') => {
    const newAdmin = {
      id: 'ADM-' + Math.floor(100 + Math.random() * 900),
      name: role === 'supplier' ? 'Vanguard Garments Supplier' : role === 'logistics' ? 'Express Logistics Lead' : 'System Administrator',
      email: `${workspaceKey.toLowerCase()}@cartflow.internal`,
      role,
      workspace: 'CartFlow Flagship',
      avatar: role === 'supplier' ? 'S' : role === 'logistics' ? 'L' : 'B',
    };
    setAdminUser(newAdmin);
    setAdminRole(role);
    return newAdmin;
  };

  const logoutAdmin = () => {
    setAdminUser(null);
  };

  const switchAdminRole = (newRole) => {
    setAdminRole(newRole);
    if (adminUser) {
      setAdminUser((prev) => ({ ...prev, role: newRole }));
    }
  };

  // Backwards-compatible aliases for legacy components
  const user = customer;
  const isAuthenticated = !!customer;
  const isAdmin = !!adminUser;
  const login = loginCustomer;
  const register = registerCustomer;
  const logout = logoutCustomer;

  return (
    <AuthContext.Provider
      value={{
        // Customer
        customer,
        isCustomerLoggedIn: !!customer,
        loginCustomer,
        registerCustomer,
        logoutCustomer,

        // Admin & Operations
        adminUser,
        isAdminLoggedIn: !!adminUser,
        adminRole,
        loginAdmin,
        logoutAdmin,
        switchAdminRole,

        // Legacy compatibility
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
