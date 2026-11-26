import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import {
  User,
  Package,
  MapPin,
  Shield,
  LogOut,
  ArrowRight,
  Heart,
  Ticket
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { PRODUCTS } from '../../data/products';
import {
  DEFAULT_SAMPLE_ORDERS,
  DEFAULT_SAMPLE_COMPLAINTS,
  INITIAL_SAVED_ADDRESSES,
  getTicketTimelogs,
  formatDateTime,
} from '../../data/customerDefaults';
import { useLocalStorageState } from '../../hooks/useLocalStorageState';
import { useToasts } from '../../hooks/useToasts';
import { Button, ToastContainer } from '../../components/ui';
import { INITIAL_MOCK_REVIEWS } from '../../components/ui/Reviews/ProductReviews';
import OrdersTab from './components/OrdersTab';
import WishlistTab from './components/WishlistTab';
import TicketsTab from './components/TicketsTab';
import ProfileTab from './components/ProfileTab';
import AddressesTab from './components/AddressesTab';
import SecurityTab from './components/SecurityTab';
import OrderSupportModals from './components/OrderSupportModals';
import './CustomerDashboard.css';

const VALID_TABS = ['orders', 'wishlist', 'tickets', 'profile', 'addresses', 'security'];

export default function CustomerDashboard() {
  const { customer, logoutCustomer, updateCustomer } = useAuth();
  const { addToCart, cartItems } = useCart();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState(() => {
    const tabParam = searchParams.get('tab');
    return VALID_TABS.includes(tabParam) ? tabParam : 'orders';
  });

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (VALID_TABS.includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const { toasts, addToast, removeToast } = useToasts();

  // Shared persisted customer states via reusable hook
  const [orders, setOrders] = useLocalStorageState('cf_customer_orders', DEFAULT_SAMPLE_ORDERS);
  const [wishlistItems, setWishlistItems] = useLocalStorageState('cf_wishlist', () => PRODUCTS.slice(0, 3));
  const [reviews, setReviews] = useLocalStorageState('cf_product_reviews', []);
  const [complaints, setComplaints] = useLocalStorageState('cf_customer_complaints', DEFAULT_SAMPLE_COMPLAINTS);
  const [addresses, setAddresses] = useLocalStorageState('cf_saved_addresses', INITIAL_SAVED_ADDRESSES);

  // Seed defaults cleanly if localStorage held empty array for orders/complaints on initial demo visit
  useEffect(() => {
    if (Array.isArray(orders) && orders.length === 0) {
      setOrders(DEFAULT_SAMPLE_ORDERS);
    }
  }, []);

  useEffect(() => {
    if (Array.isArray(complaints) && complaints.length === 0) {
      setComplaints(DEFAULT_SAMPLE_COMPLAINTS);
    }
  }, []);

  // Profile Form State (email is fixed/readOnly)
  const [profileForm, setProfileForm] = useState({
    name: customer?.name || '',
    phone: customer?.phone || '',
    profilePic: customer?.profilePic || '',
  });

  useEffect(() => {
    setProfileForm({
      name: customer?.name || '',
      phone: customer?.phone || '',
      profilePic: customer?.profilePic || '',
    });
  }, [customer]);

  // Support & Review Modals State
  const [reviewModal, setReviewModal] = useState({ open: false, orderId: '', item: null });
  const [complaintModal, setComplaintModal] = useState({ open: false, order: null });
  const [cancelModal, setCancelModal] = useState({ open: false, order: null });
  const [activeTicketId, setActiveTicketId] = useState(null);

  const activeTicket = useMemo(
    () => complaints.find((t) => t.id === activeTicketId) || null,
    [complaints, activeTicketId]
  );

  // KPIs
  const totalSpent = useMemo(
    () =>
      orders
        .filter((o) => o.status !== 'Cancelled')
        .reduce((sum, o) => sum + (Number(o.total) || 0), 0),
    [orders]
  );
  const defaultAddress = addresses[0] || null;

  const handleLogout = () => {
    logoutCustomer();
    navigate('/login');
  };

  // Profile Handlers
  const handleProfilePicChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      addToast('error', 'Image Too Large', 'Please choose an image smaller than 2 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setProfileForm((prev) => ({ ...prev, profilePic: dataUrl }));
      updateCustomer({ profilePic: dataUrl });
      addToast('success', 'Photo Updated', 'Your profile photo has been updated.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveProfilePic = () => {
    setProfileForm((prev) => ({ ...prev, profilePic: '' }));
    updateCustomer({ profilePic: '' });
    addToast('info', 'Photo Removed', 'Profile photo has been reset to your initials.');
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) {
      addToast('error', 'Name Required', 'Please enter your full name.');
      return;
    }
    updateCustomer({
      name: profileForm.name.trim(),
      phone: profileForm.phone.trim(),
      profilePic: profileForm.profilePic,
    });
    addToast('success', 'Profile Updated', 'Your name and phone number have been saved.');
  };

  // Product Redirect
  const handleOpenProduct = (productId) => {
    if (productId) navigate(`/product/${productId}`);
  };

  // Order Handlers
  const handleViewReceipt = (order) => {
    navigate('/order-confirmation', {
      state: {
        orderId: order.id,
        items: order.items.map((item, idx) => ({
          id: item.id || idx,
          title: item.title,
          variant: item.size || 'Standard',
          price: item.price,
          quantity: item.qty || 1,
          imageUrl: item.image,
        })),
        subtotal: order.subtotal || order.total,
        shippingFee: order.shippingFee ?? 0,
        taxFee: order.taxFee ?? 0,
        couponDiscount: order.couponDiscount ?? 0,
        totalAmount: order.total,
        paymentMethod: order.paymentMethod || 'cod',
        gatewayResponse: order.gatewayResponse || {
          gateway: 'CartFlow Checkout',
          transactionId: `TXN-${order.id}`,
          method: 'Standard',
          paymentState: order.status === 'Cancelled' ? 'Refunded' : 'Captured',
          status: 'SUCCESS',
        },
        deliveryAddress: order.deliveryAddress || defaultAddress || {
          name: customer?.name || 'Customer',
          address: 'Saved Delivery Address',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400018',
        },
        estimatedDeliveryDate: order.estimatedDelivery,
        createdAt: order.createdAt || order.date,
      },
    });
  };

  const handleConfirmCancelOrder = ({ reason, note }) => {
    const orderId = cancelModal.order?.id;
    if (!orderId) return;
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
            ...o,
            status: 'Cancelled',
            cancelReason: reason,
            cancelNote: note.trim(),
            cancelledAt: new Date().toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            }),
            courier: `Order cancelled (${reason})`,
          }
          : o
      )
    );
    setCancelModal({ open: false, order: null });
    addToast('info', 'Order Cancelled', `Order ${orderId} cancelled: ${reason}`);
  };

  const handleBuyAgain = (item, idx) => {
    addToCart(
      {
        id: item.id || `reorder-${idx}`,
        title: item.title,
        price: item.price,
        imageUrl: item.image,
      },
      1,
      item.size || 'Standard'
    );
    addToast('success', 'Added to Bag', `${item.title} added to your shopping bag.`);
  };

  // Review & Complaint Handlers
  const getItemReview = (orderId, productId) =>
    reviews.find((r) => r.orderId === orderId && r.productId === productId) || null;

  const handleSubmitReview = ({ rating, comment, images }) => {
    const productId = reviewModal.item?.id;
    const customerName = customer?.name || 'Verified Buyer';
    const newReview = {
      id: `rev-${Date.now()}`,
      orderId: reviewModal.orderId,
      productId,
      productTitle: reviewModal.item?.title,
      userId: customer?.id,
      userName: customerName,
      avatar: customerName.charAt(0).toUpperCase(),
      rating,
      comment,
      images: images || [],
      verifiedBuyer: true,
      helpfulCount: 1,
      date: 'Just now',
    };

    // Track reviewed order items & sync with ProductReviews storage for that product
    setReviews((prev) => [newReview, ...prev]);
    if (productId) {
      try {
        const key = `cf_reviews_p_${productId}`;
        const savedRaw = localStorage.getItem(key);
        const existing = savedRaw ? JSON.parse(savedRaw) : INITIAL_MOCK_REVIEWS;
        localStorage.setItem(key, JSON.stringify([newReview, ...existing]));
      } catch {
        // Ignore storage errors
      }
    }

    setReviewModal({ open: false, orderId: '', item: null });
    addToast('success', 'Review Submitted', 'Thank you! Your review is now live on the product page.');
  };

  const handleSubmitComplaint = (complaintForm) => {
    const orderId = complaintModal.order?.id;
    if (!orderId) return;
    if (!complaintForm.description.trim()) {
      addToast('error', 'Message Required', 'Please briefly explain the issue.');
      return;
    }
    const ticketId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowStr = formatDateTime();
    const newTicket = {
      id: ticketId,
      orderId,
      affectedItem: complaintForm.affectedItem || 'Entire Order',
      category: complaintForm.category,
      description: complaintForm.description.trim(),
      attachments: complaintForm.attachments || [],
      status: 'Open',
      createdAt: nowStr,
      timelogs: [
        {
          id: `log-${Date.now()}`,
          status: 'Open',
          actor: customer?.name || 'Customer',
          message: `Ticket raised for Order ${orderId} - ${complaintForm.category}.`,
          timestamp: nowStr,
          attachments: complaintForm.attachments || [],
        },
      ],
    };
    setComplaints((prev) => [newTicket, ...prev]);
    setComplaintModal({ open: false, order: null });
    addToast('success', 'Ticket Raised', `Ticket ${ticketId} created for Order ${orderId}.`);
  };

  const handleAddTicketReply = ({ message, attachments }) => {
    if (!activeTicket) return;
    const nowStr = formatDateTime();
    const newLog = {
      id: `log-${Date.now()}`,
      status: activeTicket.status,
      actor: customer?.name || 'Customer',
      message,
      attachments: attachments || [],
      timestamp: nowStr,
    };
    setComplaints((prev) =>
      prev.map((t) =>
        t.id === activeTicket.id
          ? { ...t, timelogs: [...getTicketTimelogs(t), newLog] }
          : t
      )
    );
    addToast('success', 'Update Added', 'Your message has been added to the ticket timelog.');
  };

  // Wishlist Handlers
  const handleMoveWishlistToCart = (item) => {
    addToCart(
      {
        id: item.id,
        title: item.title,
        price: item.price,
        imageUrl: item.imageUrl,
      },
      1,
      item.sizes?.[0] || 'Standard'
    );
    addToast('success', 'Added to Bag', `${item.title} added to your shopping bag.`);
  };

  const handleRemoveFromWishlist = (productId) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== productId));
    addToast('info', 'Removed', 'Item removed from your wishlist.');
  };

  // Address Handlers
  const handleSaveAddress = ({ isDefault, isEdit, ...cleanAddr }) => {
    setAddresses((prev) => {
      const filtered = prev.filter((a) => a.id !== cleanAddr.id);
      if (isDefault) return [cleanAddr, ...filtered];
      if (isEdit) return prev.map((a) => (a.id === cleanAddr.id ? cleanAddr : a));
      return [...filtered, cleanAddr];
    });
    addToast('success', isEdit ? 'Address Updated' : 'Address Added', 'Your saved addresses have been updated.');
  };

  const handleDeleteAddress = (id) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    addToast('info', 'Address Removed', 'Delivery address has been deleted.');
  };

  const handleSetDefaultAddress = (id) => {
    setAddresses((prev) => {
      const target = prev.find((a) => a.id === id);
      return target ? [target, ...prev.filter((a) => a.id !== id)] : prev;
    });
    addToast('success', 'Default Updated', 'Primary delivery address updated.');
  };

  const sidebarItems = [
    { id: 'orders', label: 'My Orders', icon: Package, count: orders.length },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, count: wishlistItems.length },
    { id: 'tickets', label: 'Raised Tickets', icon: Ticket, count: complaints.length },
    { id: 'profile', label: 'Profile Details', icon: User },
    { id: 'addresses', label: 'Saved Addresses', icon: MapPin, count: addresses.length },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="cf-store-container cf-customer-dashboard-wrap">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Header Profile Banner */}
      <div className="cf-cust-header-banner">
        <div className="cf-cust-profile-cell">
          <div className="cf-cust-avatar-large">
            {customer?.profilePic ? (
              <img src={customer.profilePic} alt={customer?.name || 'User'} className="cf-cust-avatar-img" />
            ) : (
              customer?.avatar || customer?.name?.charAt(0) || 'C'
            )}
          </div>
          <div className="cf-cust-user-info">
            <div className="cf-cust-name-row">
              <h1 className="cf-cust-name">{customer?.name || 'CartFlow User'}</h1>
            </div>
            <p className="cf-cust-email-line">
              {customer?.email || 'customer@cartflow.in'}
              {customer?.phone ? ` • ${customer.phone}` : ''}
            </p>
          </div>
        </div>

        <div className="cf-cust-stats-strip">
          <div className="cf-cust-stat-item">
            <span className="cf-cust-stat-val">{orders.length}</span>
            <span className="cf-cust-stat-label">Orders</span>
          </div>
          <div className="cf-cust-stat-divider" />
          <div className="cf-cust-stat-item">
            <span className="cf-cust-stat-val">₹{totalSpent.toLocaleString('en-IN')}</span>
            <span className="cf-cust-stat-label">Total Spent</span>
          </div>
          <div className="cf-cust-stat-divider" />
          <div className="cf-cust-stat-item">
            <span className="cf-cust-stat-val">{wishlistItems.length}</span>
            <span className="cf-cust-stat-label">Wishlist</span>
          </div>
          <div className="cf-cust-stat-divider" />
          <div className="cf-cust-stat-item">
            <span className="cf-cust-stat-val">{complaints.length}</span>
            <span className="cf-cust-stat-label">Tickets</span>
          </div>
          <div className="cf-cust-stat-divider" />
          <Button
            variant="outline"
            size="sm"
            icon={LogOut}
            onClick={handleLogout}
            className="cf-cust-logout-btn"
          >
            Sign Out
          </Button>
        </div>
      </div>

      {/* Dashboard Split Layout */}
      <div className="cf-cust-layout-grid">
        <aside className="cf-cust-sidebar">
          <div className="cf-cust-nav-menu">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`cf-cust-nav-link ${activeTab === item.id ? 'is-active' : ''}`}
                  onClick={() => handleTabChange(item.id)}
                >
                  <Icon size={17} />
                  <span>{item.label}</span>
                  {item.count !== undefined && (
                    <span className="cf-cust-nav-count">{item.count}</span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="cf-cust-concierge-card">
            <h4>Shopping Bag ({cartItems.length})</h4>
            <p>Ready to checkout or explore new arrivals in the store?</p>
            <Link to={cartItems.length > 0 ? '/cart' : '/shop'} className="cf-cust-concierge-link">
              {cartItems.length > 0 ? 'Go to Cart' : 'Browse Store'} <ArrowRight size={13} />
            </Link>
          </div>
        </aside>

        <main className="cf-cust-content-area">
          {activeTab === 'orders' && (
            <OrdersTab
              orders={orders}
              complaints={complaints}
              getItemReview={getItemReview}
              onOpenProduct={handleOpenProduct}
              onOpenReview={(orderId, item) => setReviewModal({ open: true, orderId, item })}
              onViewReview={(productId) =>
                navigate(`/product/${productId}?view=user-review#cf-reviews-anchor`)
              }
              onOpenComplaint={(order) => setComplaintModal({ open: true, order })}
              onOpenTicket={setActiveTicketId}
              onViewReceipt={handleViewReceipt}
              onCancelOrder={(order) => setCancelModal({ open: true, order })}
              onBuyAgain={handleBuyAgain}
            />
          )}

          {activeTab === 'wishlist' && (
            <WishlistTab
              wishlistItems={wishlistItems}
              onOpenProduct={handleOpenProduct}
              onMoveToCart={handleMoveWishlistToCart}
              onRemove={handleRemoveFromWishlist}
            />
          )}

          {activeTab === 'tickets' && (
            <TicketsTab
              complaints={complaints}
              onOpenTicket={setActiveTicketId}
              onGoToOrders={() => handleTabChange('orders')}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileTab
              customer={customer}
              profileForm={profileForm}
              setProfileForm={setProfileForm}
              defaultAddress={defaultAddress}
              onProfilePicChange={handleProfilePicChange}
              onRemoveProfilePic={handleRemoveProfilePic}
              onSaveProfile={handleSaveProfile}
              onManageAddresses={() => handleTabChange('addresses')}
            />
          )}

          {activeTab === 'addresses' && (
            <AddressesTab
              customer={customer}
              addresses={addresses}
              onSaveAddress={handleSaveAddress}
              onDeleteAddress={handleDeleteAddress}
              onSetDefaultAddress={handleSetDefaultAddress}
            />
          )}

          {activeTab === 'security' && (
            <SecurityTab
              customer={customer}
              onPasswordUpdated={() =>
                addToast('success', 'Password Updated', 'Your account password has been changed.')
              }
              onLogout={handleLogout}
            />
          )}
        </main>
      </div>

      <OrderSupportModals
        reviewModal={reviewModal}
        onCloseReview={() => setReviewModal({ open: false, orderId: '', item: null })}
        onSubmitReview={handleSubmitReview}
        complaintModal={complaintModal}
        onCloseComplaint={() => setComplaintModal({ open: false, order: null })}
        onSubmitComplaint={handleSubmitComplaint}
        onUploadError={(msg) => addToast('error', 'Upload Error', msg)}
        cancelModal={cancelModal}
        onCloseCancel={() => setCancelModal({ open: false, order: null })}
        onConfirmCancel={handleConfirmCancelOrder}
        activeTicket={activeTicket}
        onCloseTicket={() => setActiveTicketId(null)}
        onAddTicketReply={handleAddTicketReply}
      />
    </div>
  );
}
