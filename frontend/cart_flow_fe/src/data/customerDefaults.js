export const INITIAL_SAVED_ADDRESSES = [
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
];

export const INDIAN_STATES = [
  'Maharashtra',
  'Delhi',
  'Karnataka',
  'Telangana',
  'Tamil Nadu',
  'Gujarat',
  'Rajasthan',
  'West Bengal',
  'Uttar Pradesh',
  'Punjab',
  'Haryana',
  'Kerala',
  'Madhya Pradesh',
  'Other',
];

export const COMPLAINT_CATEGORIES = [
  'Delivery Delay',
  'Damaged / Defective Item',
  'Wrong Item / Size',
  'Missing Item',
  'Quality Issue',
  'Return / Exchange Request',
  'Refund / Payment Issue',
  'Address / Contact Update',
  'Other',
];

export const CANCEL_ORDER_REASONS = [
  'Ordered by mistake',
  'Need to change size / variant',
  'Need to update delivery address',
  'Delivery taking too long',
  'Found a better price elsewhere',
  'Payment / Checkout issue',
  'Changed my mind',
  'Other',
];

export const EMPTY_ADDRESS_FORM = {
  id: null,
  label: 'Home',
  name: '',
  phone: '',
  address: '',
  landmark: '',
  city: '',
  state: 'Maharashtra',
  postalCode: '',
  country: 'India',
  isDefault: false,
};

export const DEFAULT_SAMPLE_ORDERS = [
  {
    id: 'CF-99418',
    date: '23 Nov 2026',
    total: 4398,
    status: 'In Transit',
    courier: 'BlueDart Express • AWB: 8847291039',
    estimatedDelivery: '26 Nov 2026',
    currentStage: 3,
    paymentMethod: 'razorpay',
    gatewayResponse: {
      gateway: 'Razorpay',
      transactionId: 'pay_Rzp88472910',
      method: 'UPI / Card',
      paymentState: 'Captured',
      status: 'SUCCESS',
    },
    deliveryAddress: INITIAL_SAVED_ADDRESSES[0],
    subtotal: 4398,
    shippingFee: 0,
    taxFee: 220,
    couponDiscount: 0,
    items: [
      {
        id: 1,
        title: 'Black Cable Knit Crop Sweater – Mock Neck',
        size: 'L',
        price: 2499,
        qty: 1,
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 3,
        title: "Men's Sky Blue & White Micro-Check Shirt",
        size: '40R',
        price: 1899,
        qty: 1,
        image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  {
    id: 'CF-98102',
    date: '12 Nov 2026',
    total: 2299,
    status: 'Delivered',
    courier: 'Delhivery Surface • Delivered on 15 Nov',
    estimatedDelivery: '15 Nov 2026',
    currentStage: 4,
    paymentMethod: 'cod',
    gatewayResponse: {
      gateway: 'Cash on Delivery (COD)',
      transactionId: 'COD-CF-98102',
      method: 'Cash / UPI at Doorstep',
      paymentState: 'Paid on Delivery',
      status: 'SUCCESS',
    },
    deliveryAddress: INITIAL_SAVED_ADDRESSES[0],
    subtotal: 2299,
    shippingFee: 0,
    taxFee: 115,
    couponDiscount: 0,
    items: [
      {
        id: 2,
        title: 'Sky Blue Cable Knit Crop Sweater – Crew Neck',
        size: 'M',
        price: 2299,
        qty: 1,
        image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
];

export const DEFAULT_SAMPLE_COMPLAINTS = [
  {
    id: 'TKT-4821',
    orderId: 'CF-99418',
    affectedItem: 'Entire Order',
    category: 'Delivery Delay',
    subject: 'Shipment stuck at Mumbai transit hub',
    description: 'Shipment tracking has been at Mumbai Hub for over 24 hours. Please check priority dispatch.',
    status: 'In Progress',
    createdAt: '24 Nov 2026, 11:20 AM',
    attachments: [],
    timelogs: [
      {
        id: 'log-1',
        status: 'Open',
        actor: 'Customer',
        message: 'Ticket raised for Order CF-99418 regarding delivery delay.',
        timestamp: '24 Nov 2026, 11:20 AM',
        attachments: [],
      },
      {
        id: 'log-2',
        status: 'In Progress',
        actor: 'CartFlow Support',
        message: 'Assigned to logistics desk. Courier partner BlueDart contacted for express clearance.',
        timestamp: '24 Nov 2026, 02:45 PM',
        attachments: [],
      },
    ],
  },
];

export function getOrderBadgeVariant(status) {
  if (status === 'Delivered') return 'completed';
  if (status === 'Cancelled') return 'failed';
  if (status === 'In Transit') return 'processing';
  return 'warning';
}

export function getTicketBadgeVariant(status) {
  if (status === 'Resolved' || status === 'Closed') return 'completed';
  if (status === 'In Progress') return 'processing';
  return 'warning';
}

export function getTicketTimelogs(ticket) {
  if (Array.isArray(ticket?.timelogs) && ticket.timelogs.length > 0) {
    return ticket.timelogs;
  }
  return [
    {
      id: 'log-default',
      status: ticket?.status || 'Open',
      actor: 'Customer',
      message: ticket?.description || 'Ticket created.',
      timestamp: ticket?.createdAt || '',
    },
  ];
}
