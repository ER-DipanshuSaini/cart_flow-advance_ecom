import React, { useEffect, useMemo, useState } from 'react';
import {
  ShieldCheck,
  Plus,
  Search,
  Edit2,
  UserCheck,
  UserX,
  UserMinus,
  Users,
  X,
  AlertTriangle,
  Camera,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  Input,
  MetricCard,
  Modal,
  Select,
  Table,
  ToastContainer,
} from '../../components/ui';
import { useToasts } from '../../hooks/useToasts';
import {
  ADMIN_ROLES,
  ADMIN_STATUSES,
  getAdminStatusMeta,
  getRoleMeta,
  loadAdminUsers,
  saveAdminUsers,
} from '../../data/adminUsers';
import {
  STOREFRONT_IMAGE_ACCEPT,
  validateStorefrontImageFiles,
} from '../../data/inventoryProducts';
import './AdminConsole.css';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getInitials(firstName = '', lastName = '') {
  const f = String(firstName || '').trim().charAt(0);
  const l = String(lastName || '').trim().charAt(0);
  return `${f}${l}`.toUpperCase() || 'A';
}

function buildInitialUserForm(user) {
  if (user) {
    return {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      profilePic: user.profilePic || '',
      role: user.role || 'Catalog Manager',
      status: ADMIN_STATUSES.some((s) => s.value === user.status) ? user.status : 'Active',
    };
  }
  return {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profilePic: '',
    role: 'Catalog Manager',
    status: 'Active',
  };
}

export default function AdminUsersPage() {
  const [adminUsers, setAdminUsers] = useState(loadAdminUsers);
  const { toasts, addToast, removeToast } = useToasts(3200);

  // Filters & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  // Add / Edit Modal
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(() => buildInitialUserForm(null));
  const [formErrors, setFormErrors] = useState({});

  // Suspend Warning Modal
  const [suspendTarget, setSuspendTarget] = useState(null);

  useEffect(() => {
    saveAdminUsers(adminUsers);
  }, [adminUsers]);

  const activeSuperAdminCount = useMemo(
    () =>
      adminUsers.filter((u) => u.role === 'Super Admin' && u.status === 'Active').length,
    [adminUsers]
  );

  const metrics = useMemo(() => {
    const activeCount = adminUsers.filter((u) => u.status === 'Active').length;
    const inactiveCount = adminUsers.filter((u) => u.status === 'Inactive').length;
    const suspendedCount = adminUsers.filter((u) => u.status === 'Suspended').length;
    return {
      total: adminUsers.length,
      activeCount,
      inactiveCount,
      suspendedCount,
    };
  }, [adminUsers]);

  const hasActiveFilters =
    searchQuery.trim() !== '' || roleFilter !== 'all' || statusFilter !== 'all';

  const clearFilters = () => {
    setSearchQuery('');
    setRoleFilter('all');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  const filteredUsers = useMemo(() => {
    return adminUsers.filter((u) => {
      if (roleFilter !== 'all' && u.role !== roleFilter) return false;
      if (statusFilter !== 'all' && u.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
        return (
          fullName.includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.phone || '').toLowerCase().includes(q) ||
          u.role.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [adminUsers, searchQuery, roleFilter, statusFilter]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  const isProtectedSuperAdmin = (user) =>
    Boolean(user?.isRoot) ||
    (user?.role === 'Super Admin' && user?.status === 'Active' && activeSuperAdminCount <= 1);

  const openAddModal = () => {
    setEditingUser(null);
    setForm(buildInitialUserForm(null));
    setFormErrors({});
    setFormModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setForm(buildInitialUserForm(user));
    setFormErrors({});
    setFormModalOpen(true);
  };

  const handleProfileUpload = async (e) => {
    const input = e.target;
    const rawFiles = Array.from(input.files || []);
    input.value = '';
    if (rawFiles.length === 0) return;

    const { validUrls, invalidTypeCount, oversizedCount } =
      await validateStorefrontImageFiles(rawFiles.slice(0, 1), {
        maxFileMb: 5,
        targetRatio: null,
      });

    if (invalidTypeCount > 0) {
      addToast('warning', 'Unsupported Format', 'Only JPG, JPEG, PNG, and WEBP images are supported.');
      return;
    }
    if (oversizedCount > 0) {
      addToast('warning', 'File Too Large', 'Profile photo must be 5MB or smaller.');
      return;
    }
    if (validUrls[0]) {
      setForm((prev) => ({ ...prev, profilePic: validUrls[0] }));
    }
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    const cleanFirst = form.firstName.trim();
    const cleanLast = form.lastName.trim();
    const cleanEmail = form.email.trim().toLowerCase();
    const cleanPhone = form.phone.trim();
    const nextErrors = {};

    if (!cleanFirst) nextErrors.firstName = 'First name is required.';
    if (!cleanLast) nextErrors.lastName = 'Last name is required.';
    if (!cleanEmail || !EMAIL_RE.test(cleanEmail)) {
      nextErrors.email = 'Enter a valid work email address.';
    } else {
      const duplicate = adminUsers.some(
        (u) =>
          (!editingUser || u.id !== editingUser.id) &&
          u.email.toLowerCase() === cleanEmail
      );
      if (duplicate) nextErrors.email = 'An admin account with this email already exists.';
    }
    if (!cleanPhone) nextErrors.phone = 'Phone number is required.';

    if (Object.keys(nextErrors).length > 0) {
      setFormErrors(nextErrors);
      return;
    }

    if (editingUser) {
      const protectedUser = isProtectedSuperAdmin(editingUser);
      if (protectedUser && (form.role !== 'Super Admin' || form.status !== 'Active')) {
        addToast(
          'warning',
          'Root Super Admin Protected',
          'Cannot demote or change status of the root / last active Super Admin.'
        );
        return;
      }

      setAdminUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                firstName: cleanFirst,
                lastName: cleanLast,
                email: cleanEmail,
                phone: cleanPhone,
                profilePic: form.profilePic,
                role: form.role,
                status: form.status,
              }
            : u
        )
      );
      addToast('success', 'Admin Updated', `${cleanFirst} ${cleanLast} updated cleanly.`);
    } else {
      const nowDate = new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
      const created = {
        id: `adm-${Date.now()}`,
        firstName: cleanFirst,
        lastName: cleanLast,
        email: cleanEmail,
        phone: cleanPhone,
        profilePic: form.profilePic,
        role: form.role,
        status: form.status,
        isRoot: false,
        lastActive: 'Invited (Not signed in)',
        createdAt: nowDate,
      };
      setAdminUsers((prev) => [created, ...prev]);
      addToast('success', 'Admin Added', `${cleanFirst} ${cleanLast} added as ${form.role}.`);
    }

    setFormModalOpen(false);
  };

  const handleRequestSuspendToggle = (user) => {
    if (user.status === 'Suspended') {
      setAdminUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, status: 'Active' } : u))
      );
      addToast('success', 'Account Reactivated', `${user.firstName} ${user.lastName} can now log in.`);
      return;
    }

    if (isProtectedSuperAdmin(user)) {
      addToast(
        'warning',
        'Action Blocked',
        'The root / last active Super Admin account cannot be suspended.'
      );
      return;
    }

    setSuspendTarget(user);
  };

  const handleConfirmSuspend = () => {
    if (!suspendTarget) return;
    setAdminUsers((prev) =>
      prev.map((u) => (u.id === suspendTarget.id ? { ...u, status: 'Suspended' } : u))
    );
    addToast(
      'warning',
      'Admin Suspended',
      `${suspendTarget.firstName} ${suspendTarget.lastName} has been suspended and cannot log in.`
    );
    setSuspendTarget(null);
  };

  const columns = [
    {
      key: 'srNo',
      label: 'Sr. No.',
      width: '74px',
      render: (_, __, rowIndex) => (
        <span className="cf-admin-inv-sub" style={{ fontWeight: 600 }}>
          {(currentPage - 1) * pageSize + rowIndex + 1}
        </span>
      ),
    },
    {
      key: 'firstName',
      label: 'Profile',
      render: (_, row) => (
        <div className="cf-admin-cust-cell">
          <div className="cf-admin-cust-avatar">
            {row.profilePic ? (
              <img src={row.profilePic} alt={`${row.firstName} ${row.lastName}`} />
            ) : (
              <span>{getInitials(row.firstName, row.lastName)}</span>
            )}
          </div>
          <div style={{ minWidth: 0 }}>
            <div className="cf-admin-user-name-row">
              <strong style={{ color: 'var(--cf-text-main)', fontSize: '0.84rem' }}>
                {row.firstName} {row.lastName}
              </strong>
              {row.isRoot && (
                <Badge size="sm" variant="primary">
                  Root
                </Badge>
              )}
            </div>
            <div className="cf-admin-inv-sub">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (val) => <span className="cf-admin-inv-reviews">{val || '-'}</span>,
    },
    {
      key: 'role',
      label: 'Role',
      render: (val) => {
        const meta = getRoleMeta(val);
        return <Badge variant={meta.variant}>{meta.label}</Badge>;
      },
    },
    {
      key: 'lastActive',
      label: 'Last Active',
      render: (val) => <span className="cf-admin-inv-reviews">{val || '-'}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => {
        const meta = getAdminStatusMeta(val);
        return (
          <Badge dot variant={meta.variant}>
            {meta.label}
          </Badge>
        );
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (_, row) => {
        const locked = isProtectedSuperAdmin(row);
        const isSuspended = row.status === 'Suspended';
        return (
          <div
            style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="cf-admin-icon-action-btn"
              onClick={() => openEditModal(row)}
              title="Edit Admin User"
              aria-label={`Edit ${row.firstName} ${row.lastName}`}
            >
              <Edit2 size={14} />
            </button>
            <button
              type="button"
              className={`cf-admin-icon-action-btn ${!isSuspended && !locked ? 'is-warn-hover' : ''}`}
              disabled={locked}
              onClick={() => handleRequestSuspendToggle(row)}
              title={
                locked
                  ? 'Root Super Admin cannot be suspended'
                  : isSuspended
                    ? 'Activate Account'
                    : 'Suspend Account'
              }
              aria-label={
                isSuspended
                  ? `Activate ${row.firstName} ${row.lastName}`
                  : `Suspend ${row.firstName} ${row.lastName}`
              }
            >
              {isSuspended ? <UserCheck size={14} /> : <UserX size={14} />}
            </button>
          </div>
        );
      },
    },
  ];

  const editingProtected = editingUser ? isProtectedSuperAdmin(editingUser) : false;

  return (
    <div className="cf-admin-content-inner">
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Page Header */}
      <div className="cf-bo-page-header">
        <div>
          <h1 className="cf-bo-page-title">Admin Users & Access</h1>
          <p className="cf-bo-page-subtitle">
            Manage workspace administrators, contact details, roles, and account status.
          </p>
        </div>
        <Button size="sm" variant="primary" icon={Plus} onClick={openAddModal}>
          Add Admin User
        </Button>
      </div>

      {/* 4 Clean KPI Cards */}
      <div className="cf-bo-kpi-grid">
        <MetricCard
          title="Total Admin Users"
          value={metrics.total}
          subtext="Workspace team accounts"
          icon={Users}
          highlighted
        />
        <MetricCard
          title="Active Accounts"
          value={metrics.activeCount}
          subtext="Can sign in to console"
          icon={UserCheck}
        />
        <MetricCard
          title="Inactive Accounts"
          value={metrics.inactiveCount}
          subtext="Idle / dormant admins"
          icon={UserMinus}
        />
        <MetricCard
          title="Suspended"
          value={metrics.suspendedCount}
          subtext="Login access blocked"
          icon={UserX}
        />
      </div>

      {/* Directory Table Card */}
      <Card>
        <Card.Header
          title="Team Directory"
          subtitle={`${filteredUsers.length} admin account(s) • Click any row to edit details`}
          action={
            hasActiveFilters && (
              <Button size="sm" variant="outline" icon={X} onClick={clearFilters}>
                Clear Filters
              </Button>
            )
          }
        />

        <div className="cf-admin-filter-toolbar">
          <div className="cf-admin-search-wrap">
            <Input
              placeholder="Search name, email, phone, role..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              icon={Search}
            />
          </div>
          <div className="cf-admin-filter-selects">
            <Select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
              options={[
                { value: 'all', label: 'All Roles' },
                ...ADMIN_ROLES.map((r) => ({ value: r.value, label: r.label })),
              ]}
            />
            <Select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              options={[
                { value: 'all', label: 'All Statuses' },
                ...ADMIN_STATUSES.map((s) => ({ value: s.value, label: s.label })),
              ]}
            />
          </div>
        </div>

        <Card.Body style={{ padding: 0 }}>
          <Table
            className="is-embedded"
            columns={columns}
            data={paginatedUsers}
            keyField="id"
            onRowClick={openEditModal}
            emptyMessage="No admin users match your current filters."
            pagination={{
              currentPage,
              pageSize,
              totalItems: filteredUsers.length,
              onPageChange: setCurrentPage,
              onPageSizeChange: (nextSize) => {
                setPageSize(nextSize);
                setCurrentPage(1);
              },
              pageSizeOptions: [6, 10, 20],
            }}
          />
        </Card.Body>
      </Card>

      {/* Professional Add / Edit Admin User Modal */}
      <Modal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        icon={ShieldCheck}
        title={
          editingUser
            ? `Edit Admin • ${editingUser.firstName} ${editingUser.lastName}`
            : 'Add New Admin User'
        }
        maxWidth="760px"
      >
        <form onSubmit={handleSaveUser} className="cf-admin-form-stack">
          <div className="cf-admin-user-modal-layout">
            {/* Left: Google-style Hover Avatar Picker */}
            <div className="cf-admin-user-avatar-col">
              <label
                className="cf-admin-google-avatar-picker"
                title="Click to upload profile photo"
              >
                {form.profilePic ? (
                  <img src={form.profilePic} alt="Profile preview" />
                ) : (
                  <span className="cf-admin-google-avatar-initials">
                    {getInitials(form.firstName, form.lastName)}
                  </span>
                )}
                <span className="cf-admin-google-avatar-hover">
                  <Camera size={22} />
                  <span>{form.profilePic ? 'Change' : 'Upload'}</span>
                </span>
                <input
                  type="file"
                  accept={STOREFRONT_IMAGE_ACCEPT}
                  className="cf-admin-hidden-file-input"
                  onChange={handleProfileUpload}
                />
              </label>

              <div className="cf-admin-user-avatar-meta">
                <small>JPG, PNG, WEBP • Max 5MB</small>
                {form.profilePic && (
                  <button
                    type="button"
                    className="cf-admin-avatar-remove-link"
                    onClick={() => setForm((prev) => ({ ...prev, profilePic: '' }))}
                  >
                    Remove photo
                  </button>
                )}
              </div>
            </div>

            {/* Right: Profile Details */}
            <div className="cf-admin-form-stack">
              <div className="cf-admin-user-modal-row">
                <Input
                  label="First Name"
                  required
                  placeholder="e.g., Priya"
                  value={form.firstName}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, firstName: e.target.value }));
                    if (formErrors.firstName) setFormErrors((er) => ({ ...er, firstName: '' }));
                  }}
                  error={formErrors.firstName}
                />
                <Input
                  label="Last Name"
                  required
                  placeholder="e.g., Sharma"
                  value={form.lastName}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, lastName: e.target.value }));
                    if (formErrors.lastName) setFormErrors((er) => ({ ...er, lastName: '' }));
                  }}
                  error={formErrors.lastName}
                />
              </div>

              <div className="cf-admin-user-modal-row">
                <Input
                  label="Work Email"
                  type="email"
                  required={!editingUser}
                  disabled={Boolean(editingUser)}
                  placeholder="e.g., priya.sharma@cartflow.in"
                  value={form.email}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, email: e.target.value }));
                    if (formErrors.email) setFormErrors((er) => ({ ...er, email: '' }));
                  }}
                  helperText={editingUser ? 'Email cannot be changed after creation' : undefined}
                  error={formErrors.email}
                />
                <Input
                  label="Phone Number"
                  required
                  placeholder="e.g., +91 98204 55192"
                  value={form.phone}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, phone: e.target.value }));
                    if (formErrors.phone) setFormErrors((er) => ({ ...er, phone: '' }));
                  }}
                  error={formErrors.phone}
                />
              </div>

              <div className="cf-admin-user-modal-row">
                <Select
                  label="Role"
                  disabled={editingProtected}
                  value={form.role}
                  onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
                  options={ADMIN_ROLES.map((r) => ({ value: r.value, label: r.label }))}
                  helperText={getRoleMeta(form.role).description}
                />
                <Select
                  label="Account Status"
                  disabled={editingProtected}
                  value={form.status}
                  onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
                  options={ADMIN_STATUSES.map((s) => ({ value: s.value, label: s.label }))}
                />
              </div>

              {form.status === 'Suspended' && (
                <div className="cf-shopify-status-warn-box is-danger">
                  <p className="cf-shopify-status-warn-main">
                    Suspended accounts cannot log in to the CartFlow Admin Console.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="cf-shopify-status-modal-actions">
            <Button type="button" variant="outline" size="sm" onClick={() => setFormModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editingUser ? 'Save Changes' : 'Create Admin'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Suspend Warning Confirmation Modal */}
      <Modal
        isOpen={Boolean(suspendTarget)}
        onClose={() => setSuspendTarget(null)}
        icon={AlertTriangle}
        title="Suspend Admin Account?"
        subtitle={
          suspendTarget
            ? `${suspendTarget.firstName} ${suspendTarget.lastName} (${suspendTarget.email})`
            : ''
        }
        maxWidth="460px"
      >
        <div className="cf-admin-form-stack">
          <div className="cf-shopify-status-warn-box is-danger">
            <p className="cf-shopify-status-warn-main">
              Suspending this admin will immediately block them from logging in to the CartFlow Admin Console.
            </p>
            <p className="cf-shopify-status-warn-tip">
              Any active session will be invalidated. You can reactivate this account anytime from the directory.
            </p>
          </div>
          <div className="cf-shopify-status-modal-actions">
            <Button type="button" variant="outline" size="sm" onClick={() => setSuspendTarget(null)}>
              Cancel
            </Button>
            <Button type="button" variant="danger" size="sm" onClick={handleConfirmSuspend}>
              Yes, Suspend Admin
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
