import { DEFAULT_SAMPLE_COMPLAINTS, getOrderBadgeVariant } from './customerDefaults';

const STORAGE_KEY = 'cf_admin_customers';

const BASE_CUSTOMERS = [
  {
    id: 'USR-8821',
    name: 'Vikramaditya Roy',
    email: 'vikram.roy@cartflow.luxury',
    phone: '+91 98765 43210',
    city: 'Mumbai, Maharashtra',
    joined: 'October 2025',
    lastOrderDate: '23 Nov 2026',
    status: 'Active',
    adminNote: 'Prefers morning delivery slot between 9 AM – 12 PM.',
    addresses: [
      {
        id: 'addr-1',
        label: 'Primary Residence',
        name: 'Vikramaditya Roy',
        phone: '+91 98765 43210',
        address: 'Suite 402, Imperial Heights, Worli',
        landmark: 'Near Sea Face Promenade',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400018',
        country: 'India',
      },
      {
        id: 'addr-2',
        label: 'Office Studio',
        name: 'Vikramaditya Roy',
        phone: '+91 98765 43210',
        address: 'Level 14, One BKC, Bandra East',
        landmark: 'Opp. MCA Club',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400051',
        country: 'India',
      },
    ],
    orders: [
      {
        id: 'CF-99418',
        date: '23 Nov 2026',
        itemsSummary: 'Black Cable Knit Crop Sweater (1), Sky Blue Micro-Check Shirt (1)',
        payment: 'Razorpay',
        total: 4398,
        status: 'In Transit',
      },
      {
        id: 'CF-98102',
        date: '12 Nov 2026',
        itemsSummary: 'Sky Blue Cable Knit Crop Sweater (1)',
        payment: 'Cash on Delivery',
        total: 2299,
        status: 'Delivered',
      },
    ],
    activities: [
      {
        id: 'act-1',
        type: 'ticket',
        title: 'Support Ticket TKT-4821 Raised',
        detail: 'Reported delivery delay on Order CF-99418.',
        timestamp: '24 Nov 2026, 11:20 AM',
      },
      {
        id: 'act-2',
        type: 'order',
        title: 'Placed Order CF-99418',
        detail: 'Paid ₹4,398 via Razorpay (2 items).',
        timestamp: '23 Nov 2026, 04:15 PM',
      },
      {
        id: 'act-3',
        type: 'delivered',
        title: 'Order CF-98102 Delivered',
        detail: 'Delivered via Delhivery Surface to Worli, Mumbai.',
        timestamp: '15 Nov 2026, 01:30 PM',
      },
      {
        id: 'act-4',
        type: 'account',
        title: 'Account Registered',
        detail: 'Customer signed up using vikram.roy@cartflow.luxury.',
        timestamp: '12 Oct 2025, 10:05 AM',
      },
    ],
  },
  {
    id: 'USR-8814',
    name: 'Aarav Singhania',
    email: 'aarav.singhania@gmail.com',
    phone: '+91 98201 44512',
    city: 'New Delhi, Delhi',
    joined: 'January 2026',
    lastOrderDate: '23 Nov 2026',
    status: 'Active',
    adminNote: 'Frequent buyer across formal & linen collections.',
    addresses: [
      {
        id: 'addr-8814-1',
        label: 'Home',
        name: 'Aarav Singhania',
        phone: '+91 98201 44512',
        address: 'B-18, Greater Kailash Part II',
        city: 'New Delhi',
        state: 'Delhi',
        postalCode: '110048',
        country: 'India',
      },
    ],
    orders: [
      {
        id: 'CF-99417',
        date: '23 Nov 2026',
        itemsSummary: 'French Linen Overshirt (2)',
        payment: 'Prepaid (Cards)',
        total: 4598,
        status: 'Processing',
      },
      {
        id: 'CF-97810',
        date: '04 Nov 2026',
        itemsSummary: 'Structured Wool Blazer (1), Pleated Trousers (2)',
        payment: 'Razorpay',
        total: 14852,
        status: 'Delivered',
      },
    ],
    activities: [
      {
        id: 'act-8814-1',
        type: 'order',
        title: 'Placed Order CF-99417',
        detail: 'Prepaid order of ₹4,598 via Card.',
        timestamp: '23 Nov 2026, 02:30 PM',
      },
      {
        id: 'act-8814-2',
        type: 'delivered',
        title: 'Order CF-97810 Delivered',
        detail: 'Delivered to Greater Kailash Part II, New Delhi.',
        timestamp: '08 Nov 2026, 05:10 PM',
      },
      {
        id: 'act-8814-3',
        type: 'account',
        title: 'Account Registered',
        detail: 'Joined CartFlow storefront.',
        timestamp: '19 Jan 2026, 06:40 PM',
      },
    ],
    tickets: [
      {
        id: 'TKT-4690',
        orderId: 'CF-97810',
        affectedItem: 'Structured Wool Blazer (40R)',
        category: 'Return / Exchange Request',
        description: 'Would like to exchange 40R for 42R for a relaxed shoulder drape.',
        status: 'Resolved',
        createdAt: '09 Nov 2026, 10:30 AM',
        timelogs: [
          {
            id: 'log-4690-1',
            status: 'Open',
            actor: 'Aarav Singhania',
            message: 'Requested size exchange from 40R to 42R.',
            timestamp: '09 Nov 2026, 10:30 AM',
          },
          {
            id: 'log-4690-2',
            status: 'Resolved',
            actor: 'CartFlow Support',
            message: '42R dispatched via BlueDart Express. Exchange completed.',
            timestamp: '12 Nov 2026, 04:05 PM',
          },
        ],
      },
    ],
    reviews: [
      {
        id: 'rev-8814-1',
        productTitle: 'Italian Double-Breasted Structured Blazer',
        rating: 5,
        comment: 'Impeccable drape and quick size exchange turnaround.',
        date: '14 Nov 2026',
      },
    ],
  },
  {
    id: 'USR-8799',
    name: 'Kabir Malhotra',
    email: 'kabir.m@outlook.com',
    phone: '+91 99104 77823',
    city: 'Gurugram, Haryana',
    joined: 'March 2026',
    lastOrderDate: '23 Nov 2026',
    status: 'Active',
    adminNote: '',
    addresses: [
      {
        id: 'addr-8799-1',
        label: 'Home',
        name: 'Kabir Malhotra',
        phone: '+91 99104 77823',
        address: 'Tower 4, DLF Magnolias',
        city: 'Gurugram',
        state: 'Haryana',
        postalCode: '122002',
        country: 'India',
      },
    ],
    orders: [
      {
        id: 'CF-99416',
        date: '23 Nov 2026',
        itemsSummary: 'Suede Tassel Loafers (1)',
        payment: 'Cash on Delivery',
        total: 4499,
        status: 'Confirmed',
      },
      {
        id: 'CF-97201',
        date: '18 Oct 2026',
        itemsSummary: 'Riviera Knit Polo (2), Linen Shirt (1)',
        payment: 'Cashfree',
        total: 6791,
        status: 'Delivered',
      },
    ],
    activities: [
      {
        id: 'act-8799-1',
        type: 'order',
        title: 'Placed Order CF-99416',
        detail: 'COD order worth ₹4,499 confirmed.',
        timestamp: '23 Nov 2026, 11:20 AM',
      },
      {
        id: 'act-8799-2',
        type: 'delivered',
        title: 'Order CF-97201 Delivered',
        detail: 'Completed delivery in Gurugram.',
        timestamp: '22 Oct 2026, 03:00 PM',
      },
    ],
    tickets: [
      {
        id: 'TKT-4510',
        orderId: 'CF-97201',
        affectedItem: 'Linen Shirt (L)',
        category: 'Wrong Item / Size',
        description: 'Received size XL instead of L for the Linen Shirt. Need exchange pickup.',
        status: 'Resolved',
        createdAt: '22 Oct 2026, 05:15 PM',
        timelogs: [
          {
            id: 'log-4510-1',
            status: 'Open',
            actor: 'Kabir Malhotra',
            message: 'Ticket raised for Wrong Size on Order CF-97201.',
            timestamp: '22 Oct 2026, 05:15 PM',
          },
          {
            id: 'log-4510-2',
            status: 'In Progress',
            actor: 'CartFlow Support',
            message: 'Reverse pickup scheduled with Delhivery for 23 Oct.',
            timestamp: '22 Oct 2026, 06:40 PM',
          },
          {
            id: 'log-4510-3',
            status: 'Resolved',
            actor: 'CartFlow Support',
            message: 'Replacement size L delivered and exchange ticket closed.',
            timestamp: '25 Oct 2026, 01:15 PM',
          },
        ],
      },
    ],
    reviews: [
      {
        id: 'rev-8799-1',
        productTitle: 'The Riviera Textured Knit Polo',
        rating: 4.5,
        comment: 'Breathable knit texture and holds collar structure nicely.',
        date: '26 Oct 2026',
      },
    ],
  },
  {
    id: 'USR-8762',
    name: 'Rohan Mehra',
    email: 'rohan.mehra@yahoo.in',
    phone: '+91 97412 66309',
    city: 'Bengaluru, Karnataka',
    joined: 'May 2026',
    lastOrderDate: '21 Nov 2026',
    status: 'Active',
    adminNote: '',
    addresses: [
      {
        id: 'addr-8762-1',
        label: 'Home',
        name: 'Rohan Mehra',
        phone: '+91 97412 66309',
        address: '14th Main, Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560038',
        country: 'India',
      },
    ],
    orders: [
      {
        id: 'CF-99415',
        date: '21 Nov 2026',
        itemsSummary: 'Gurkha Trousers (1), Crochet Shirt (1)',
        payment: 'Razorpay (UPI)',
        total: 4698,
        status: 'Delivered',
      },
      {
        id: 'CF-96411',
        date: '02 Oct 2026',
        itemsSummary: 'Oversized Zip Hoodie (2), Textured Sweater (1)',
        payment: 'Razorpay',
        total: 10122,
        status: 'Delivered',
      },
    ],
    activities: [
      {
        id: 'act-8762-1',
        type: 'delivered',
        title: 'Order CF-99415 Delivered',
        detail: 'Delivered by Delhivery Express.',
        timestamp: '24 Nov 2026, 04:15 PM',
      },
      {
        id: 'act-8762-2',
        type: 'review',
        title: 'Submitted Product Review',
        detail: 'Rated Pleated Gurkha Trousers 5.0 stars.',
        timestamp: '25 Nov 2026, 10:12 AM',
      },
    ],
  },
  {
    id: 'USR-8741',
    name: 'Devansh Kapur',
    email: 'devansh.kapur@gmail.com',
    phone: '+91 98332 10945',
    city: 'Pune, Maharashtra',
    joined: 'June 2026',
    lastOrderDate: '20 Nov 2026',
    status: 'Active',
    adminNote: '',
    addresses: [
      {
        id: 'addr-8741-1',
        label: 'Residence',
        name: 'Devansh Kapur',
        phone: '+91 98332 10945',
        address: 'Lane 7, Koregaon Park',
        city: 'Pune',
        state: 'Maharashtra',
        postalCode: '411001',
        country: 'India',
      },
    ],
    orders: [
      {
        id: 'CF-99414',
        date: '20 Nov 2026',
        itemsSummary: 'Wool Minimalist Overcoat (1)',
        payment: 'Prepaid (Cards)',
        total: 6499,
        status: 'Delivered',
      },
    ],
    activities: [
      {
        id: 'act-8741-1',
        type: 'delivered',
        title: 'Order CF-99414 Delivered',
        detail: 'Delivered to Koregaon Park, Pune.',
        timestamp: '23 Nov 2026, 12:40 PM',
      },
    ],
  },
  {
    id: 'USR-8719',
    name: 'Tarun Khurana',
    email: 'tarun.khurana@gmail.com',
    phone: '+91 98188 55210',
    city: 'Chandigarh, Punjab',
    joined: 'August 2026',
    lastOrderDate: '19 Nov 2026',
    status: 'Active',
    adminNote: '',
    addresses: [
      {
        id: 'addr-8719-1',
        label: 'Home',
        name: 'Tarun Khurana',
        phone: '+91 98188 55210',
        address: 'House 214, Sector 9-C',
        city: 'Chandigarh',
        state: 'Punjab',
        postalCode: '160009',
        country: 'India',
      },
    ],
    orders: [
      {
        id: 'CF-99413',
        date: '19 Nov 2026',
        itemsSummary: 'Riviera Knit Polo (2)',
        payment: 'Razorpay (UPI)',
        total: 4398,
        status: 'Confirmed',
      },
    ],
    activities: [
      {
        id: 'act-8719-1',
        type: 'order',
        title: 'Placed Order CF-99413',
        detail: 'Paid ₹4,398 via UPI.',
        timestamp: '19 Nov 2026, 03:45 PM',
      },
    ],
  },
  {
    id: 'USR-8695',
    name: 'Sameer Varma',
    email: 'sameer.varma@proton.me',
    phone: '+91 98490 33128',
    city: 'Hyderabad, Telangana',
    joined: 'November 2025',
    lastOrderDate: '18 Nov 2026',
    status: 'Active',
    adminNote: 'Corporate gifting buyer.',
    addresses: [
      {
        id: 'addr-8695-1',
        label: 'Office',
        name: 'Sameer Varma',
        phone: '+91 98490 33128',
        address: 'Road No. 12, Banjara Hills',
        city: 'Hyderabad',
        state: 'Telangana',
        postalCode: '500034',
        country: 'India',
      },
    ],
    orders: [
      {
        id: 'CF-99412',
        date: '18 Nov 2026',
        itemsSummary: 'Pleated Gurkha Trousers (3), Linen Shirts (2)',
        payment: 'Cashfree',
        total: 12495,
        status: 'Delivered',
      },
    ],
    activities: [
      {
        id: 'act-8695-1',
        type: 'delivered',
        title: 'Order CF-99412 Delivered',
        detail: 'Delivered to Banjara Hills, Hyderabad.',
        timestamp: '21 Nov 2026, 02:20 PM',
      },
    ],
  },
  {
    id: 'USR-8650',
    name: 'Nikhil Deshmukh',
    email: 'nikhil.d@gmail.com',
    phone: '+91 98220 91456',
    city: 'Ahmedabad, Gujarat',
    joined: 'October 2026',
    lastOrderDate: '04 Nov 2026',
    status: 'Blocked',
    adminNote: 'Account blocked due to repeated COD refusals at doorstep.',
    addresses: [
      {
        id: 'addr-8650-1',
        label: 'Home',
        name: 'Nikhil Deshmukh',
        phone: '+91 98220 91456',
        address: '12 Gulmohar Park, Satellite',
        city: 'Ahmedabad',
        state: 'Gujarat',
        postalCode: '380015',
        country: 'India',
      },
    ],
    orders: [
      {
        id: 'CF-97108',
        date: '04 Nov 2026',
        itemsSummary: 'Black Cable Knit Sweater (1)',
        payment: 'Cash on Delivery',
        total: 2499,
        status: 'Cancelled',
      },
    ],
    activities: [
      {
        id: 'act-8650-1',
        type: 'blocked',
        title: 'Account Blocked by Admin',
        detail: 'COD verification failure after multiple attempts.',
        timestamp: '09 Nov 2026, 05:15 PM',
      },
      {
        id: 'act-8650-2',
        type: 'order',
        title: 'Order CF-97108 Cancelled',
        detail: 'Order marked cancelled after RTO.',
        timestamp: '08 Nov 2026, 01:00 PM',
      },
    ],
  },
];

function computeTotals(customer) {
  const orders = Array.isArray(customer.orders) ? customer.orders : [];
  const validOrders = orders.filter((o) => o.status !== 'Cancelled');
  const totalSpent = validOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const lastOrderDate = orders[0]?.date || customer.lastOrderDate || '—';
  return {
    ...customer,
    ordersCount: orders.length,
    totalSpent,
    lastOrderDate,
  };
}

function mergeLiveCustomer(list) {
  try {
    const savedCustomer = JSON.parse(localStorage.getItem('cf_customer') || 'null');
    if (!savedCustomer) return list;

    const savedOrders = JSON.parse(localStorage.getItem('cf_customer_orders') || '[]');
    const savedAddresses = JSON.parse(localStorage.getItem('cf_saved_addresses') || '[]');
    const savedComplaints = JSON.parse(localStorage.getItem('cf_customer_complaints') || '[]');
    const savedReviews = JSON.parse(localStorage.getItem('cf_product_reviews') || '[]');

    const idx = list.findIndex(
      (c) => c.id === savedCustomer.id || c.email === savedCustomer.email
    );
    const existing = idx >= 0 ? list[idx] : null;

    const mappedOrders =
      Array.isArray(savedOrders) && savedOrders.length > 0
        ? savedOrders.map((o) => ({
            id: o.id,
            date: o.date,
            itemsSummary: (o.items || []).map((i) => `${i.title} (${i.qty})`).join(', '),
            payment: o.gatewayResponse?.gateway || o.paymentMethod || 'Prepaid',
            total: Number(o.total) || 0,
            status: o.status,
          }))
        : existing?.orders || [];

    const mappedAddresses =
      Array.isArray(savedAddresses) && savedAddresses.length > 0
        ? savedAddresses
        : existing?.addresses || [];

    const primaryAddr = mappedAddresses[0];

    const resolvedComplaints =
      Array.isArray(savedComplaints) && savedComplaints.length > 0
        ? savedComplaints
        : existing?.tickets?.length > 0
        ? existing.tickets
        : DEFAULT_SAMPLE_COMPLAINTS;

    // Build rich combined timeline from live orders, complaints, and reviews
    const dynamicActivities = [];
    resolvedComplaints.forEach((t) => {
      dynamicActivities.push({
        id: `tkt-${t.id}`,
        type: 'ticket',
        title: `Support Ticket ${t.id} (${t.status})`,
        detail: `${t.category} on Order ${t.orderId}`,
        timestamp: t.createdAt,
      });
    });
    if (Array.isArray(savedReviews)) {
      savedReviews.forEach((r) => {
        dynamicActivities.push({
          id: `rev-${r.id}`,
          type: 'review',
          title: `Reviewed ${r.productTitle || 'Product'} (${Number(r.rating).toFixed(1)}★)`,
          detail: r.comment || 'Submitted verified buyer rating.',
          timestamp: r.date || r.createdAt || 'Recent',
        });
      });
    }
    mappedOrders.forEach((o) => {
      dynamicActivities.push({
        id: `ord-${o.id}`,
        type: o.status === 'Delivered' ? 'delivered' : o.status === 'Cancelled' ? 'blocked' : 'order',
        title: `Order ${o.id} — ${o.status}`,
        detail: `₹${Number(o.total).toLocaleString('en-IN')} via ${o.payment}`,
        timestamp: o.date,
      });
    });

    const baseActivities = existing?.activities || [];
    const seenIds = new Set(dynamicActivities.map((a) => a.id));
    const mergedActivities = [
      ...dynamicActivities,
      ...baseActivities.filter((a) => !seenIds.has(a.id) && a.type === 'account'),
    ];

    const liveCustomer = computeTotals({
      id: savedCustomer.id || existing?.id || 'USR-8821',
      name: savedCustomer.name || existing?.name,
      email: savedCustomer.email || existing?.email,
      phone: savedCustomer.phone || existing?.phone || '',
      profilePic: savedCustomer.profilePic || existing?.profilePic || '',
      city: primaryAddr ? `${primaryAddr.city}, ${primaryAddr.state}` : existing?.city || 'Mumbai',
      joined: savedCustomer.joined || existing?.joined || 'October 2025',
      status: existing?.status || 'Active',
      adminNote: existing?.adminNote || '',
      addresses: mappedAddresses,
      orders: mappedOrders,
      tickets: resolvedComplaints,
      reviews:
        Array.isArray(savedReviews) && savedReviews.length > 0
          ? savedReviews
          : existing?.reviews || [],
      activities: mergedActivities,
    });

    if (idx >= 0) {
      const next = [...list];
      next[idx] = liveCustomer;
      return next;
    }
    return [liveCustomer, ...list];
  } catch {
    return list;
  }
}

export function loadAdminCustomers() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const baseById = Object.fromEntries(BASE_CUSTOMERS.map((b) => [b.id, b]));
    const parsed = saved
      ? JSON.parse(saved).map((c) => {
          const base = baseById[c.id];
          return {
            ...c,
            tickets: Array.isArray(c.tickets) && c.tickets.length > 0 ? c.tickets : base?.tickets || [],
            reviews: Array.isArray(c.reviews) && c.reviews.length > 0 ? c.reviews : base?.reviews || [],
          };
        })
      : BASE_CUSTOMERS.map(computeTotals);
    return mergeLiveCustomer(Array.isArray(parsed) && parsed.length > 0 ? parsed : BASE_CUSTOMERS.map(computeTotals));
  } catch {
    return BASE_CUSTOMERS.map(computeTotals);
  }
}

export function saveAdminCustomers(customers) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
  } catch {
    // ignore storage errors
  }
}

export function syncUpdatedCustomerToStore(updated) {
  try {
    const savedCustomer = JSON.parse(localStorage.getItem('cf_customer') || 'null');
    if (savedCustomer && (savedCustomer.id === updated.id || savedCustomer.email === updated.email)) {
      localStorage.setItem(
        'cf_customer',
        JSON.stringify({
          ...savedCustomer,
          name: updated.name,
          phone: updated.phone,
          avatar: updated.name ? updated.name.trim().charAt(0).toUpperCase() : savedCustomer.avatar,
        })
      );
      if (Array.isArray(updated.addresses)) {
        localStorage.setItem('cf_saved_addresses', JSON.stringify(updated.addresses));
      }
      if (Array.isArray(updated.tickets)) {
        localStorage.setItem('cf_customer_complaints', JSON.stringify(updated.tickets));
      }
    }
  } catch {
    // ignore storage errors
  }
}

export { getOrderBadgeVariant };
