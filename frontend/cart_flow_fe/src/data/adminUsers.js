const ADMIN_USERS_STORAGE_KEY = 'cf_admin_users_v2';
const ADMIN_SESSIONS_STORAGE_KEY = 'cf_admin_sessions_v1';
const ADMIN_PASSWORD_STORAGE_KEY = 'cf_admin_password_v1';

export const ADMIN_STATUSES = [
  { value: 'Active', label: 'Active', variant: 'completed' },
  { value: 'Inactive', label: 'Inactive', variant: 'neutral' },
  { value: 'Suspended', label: 'Suspended', variant: 'failed' },
];

export const ADMIN_ROLES = [
  {
    value: 'Super Admin',
    label: 'Super Admin',
    variant: 'primary',
    description: 'Full access across workspace, users, catalog, orders, and settings',
  },
  {
    value: 'Catalog Manager',
    label: 'Catalog Manager',
    variant: 'processing',
    description: 'Manage products, variants, pricing, and storefront catalogs',
  },
  {
    value: 'Orders & Logistics',
    label: 'Orders & Logistics',
    variant: 'warning',
    description: 'Process orders, dispatch shipments, and print courier manifests',
  },
  {
    value: 'Support Lead',
    label: 'Support Lead',
    variant: 'completed',
    description: 'View customer profiles, order history, and resolve support tickets',
  },
];

const SEED_ADMIN_USERS = [
  {
    id: 'adm-101',
    firstName: 'CartFlow',
    lastName: 'Admin',
    email: 'admin@cartflow.in',
    phone: '+91 98200 11001',
    profilePic: '',
    role: 'Super Admin',
    status: 'Active',
    isRoot: true,
    lastActive: 'Just now',
    createdAt: '01 Oct 2026',
  },
  {
    id: 'adm-102',
    firstName: 'Ananya',
    lastName: 'Verma',
    email: 'ananya.verma@cartflow.in',
    phone: '+91 98204 55192',
    profilePic: '',
    role: 'Catalog Manager',
    status: 'Active',
    isRoot: false,
    lastActive: '18 mins ago',
    createdAt: '14 Oct 2026',
  },
  {
    id: 'adm-103',
    firstName: 'Siddharth',
    lastName: 'Rao',
    email: 'siddharth.rao@cartflow.in',
    phone: '+91 98112 78430',
    profilePic: '',
    role: 'Orders & Logistics',
    status: 'Active',
    isRoot: false,
    lastActive: '1 hr ago',
    createdAt: '22 Oct 2026',
  },
  {
    id: 'adm-104',
    firstName: 'Neha',
    lastName: 'Kapoor',
    email: 'neha.kapoor@cartflow.in',
    phone: '+91 99103 44218',
    profilePic: '',
    role: 'Support Lead',
    status: 'Inactive',
    isRoot: false,
    lastActive: '3 days ago',
    createdAt: '03 Nov 2026',
  },
  {
    id: 'adm-105',
    firstName: 'Karan',
    lastName: 'Malhotra',
    email: 'karan.m@cartflow.in',
    phone: '+91 97650 31890',
    profilePic: '',
    role: 'Catalog Manager',
    status: 'Suspended',
    isRoot: false,
    lastActive: '12 Nov 2026',
    createdAt: '09 Nov 2026',
  },
];

export function getRoleMeta(role) {
  return ADMIN_ROLES.find((r) => r.value === role) || ADMIN_ROLES[0];
}

export function getAdminStatusMeta(status) {
  return ADMIN_STATUSES.find((s) => s.value === status) || ADMIN_STATUSES[0];
}

export function loadAdminUsers() {
  try {
    const saved = localStorage.getItem(ADMIN_USERS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // ignore storage errors
  }
  return SEED_ADMIN_USERS.map((u) => ({ ...u }));
}

export function saveAdminUsers(list) {
  try {
    localStorage.setItem(ADMIN_USERS_STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore storage errors
  }
}

export function getCurrentAdminUser() {
  const users = loadAdminUsers();
  return users.find((u) => u.isRoot) || users[0] || SEED_ADMIN_USERS[0];
}

const SEED_ADMIN_SESSIONS = [
  {
    id: 'sess-101',
    title: 'Current Active Session',
    description: 'Chrome 131 on Windows 11 • IP 103.84.212.19 • Mumbai, IN',
    timestamp: 'Active now',
    tone: 'order',
  },
  {
    id: 'sess-102',
    title: 'Admin Console Sign-In',
    description: 'Chrome 131 on Windows 11 • IP 103.84.212.19 • Mumbai, IN',
    timestamp: 'Today, 09:42 AM',
    tone: 'account',
  },
  {
    id: 'sess-103',
    title: 'Admin Console Sign-In',
    description: 'Safari on macOS • IP 49.36.118.44 • Bengaluru, IN',
    timestamp: 'Yesterday, 07:15 PM',
    tone: 'account',
  },
  {
    id: 'sess-104',
    title: 'Password Policy Verified',
    description: 'Two-factor workspace token & PBKDF2 hash verified',
    timestamp: '22 Nov 2026, 11:20 AM',
    tone: 'address',
  },
];

export function loadAdminSessions() {
  try {
    const saved = localStorage.getItem(ADMIN_SESSIONS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore storage errors
  }
  return SEED_ADMIN_SESSIONS.map((s) => ({ ...s }));
}

export function appendAdminSessionEvent(title, description, tone = 'account') {
  const nowText = new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  const current = loadAdminSessions();
  const next = [
    { id: `sess-${Date.now()}`, title, description, timestamp: nowText, tone },
    ...current,
  ].slice(0, 15);
  try {
    localStorage.setItem(ADMIN_SESSIONS_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore storage errors
  }
  return next;
}

export function getStoredAdminPassword() {
  try {
    return localStorage.getItem(ADMIN_PASSWORD_STORAGE_KEY) || 'Admin@123';
  } catch {
    return 'Admin@123';
  }
}

export function saveAdminPassword(nextPassword) {
  try {
    localStorage.setItem(ADMIN_PASSWORD_STORAGE_KEY, nextPassword);
  } catch {
    // ignore storage errors
  }
}
