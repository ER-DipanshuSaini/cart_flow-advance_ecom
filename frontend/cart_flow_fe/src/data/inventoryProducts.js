import { PRODUCTS } from './products';

const INVENTORY_STORAGE_KEY = 'cf_inventory_products';
const CATALOG_STORAGE_KEY = 'cf_admin_catalogs';
const SUPPLIER_STORAGE_KEY = 'cf_admin_suppliers';

export const MAX_PRODUCT_TAGS_CHARS = 200;

const SEED_CATALOGS = [
  {
    id: 'old-money',
    name: 'Old Money',
    description: 'Timeless quiet-luxury silhouettes crafted in Egyptian combed cotton and bespoke tailoring.',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=900&auto=format&fit=crop',
    fallback: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=900&auto=format&fit=crop',
    status: 'Active',
    suggestedTags: ['Old Money', 'Quiet Luxury', 'Heritage', 'Polo', 'Combed Cotton', 'Pique', 'Classic', 'Resort', 'Menswear', 'Tailored'],
  },
  {
    id: 'knitwear',
    name: 'Knitwear & Sweaters',
    description: 'Heavyweight Peruvian cotton and cable-knit weaves engineered for structured drape.',
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=900&auto=format&fit=crop',
    fallback: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=900&auto=format&fit=crop',
    status: 'Active',
    suggestedTags: ['Knitwear', 'Cable Knit', 'Mock Neck', 'Crew Neck', 'Winter Edit', 'Peruvian Cotton', 'Ribbed', 'Layering', 'Warm', 'Menswear'],
  },
  {
    id: 'formal',
    name: 'Formal & Suiting',
    description: 'Double-breasted blazers, Italian pinpoint shirts, and sharp architectural suiting.',
    image: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=900&auto=format&fit=crop',
    fallback: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=900&auto=format&fit=crop',
    status: 'Active',
    suggestedTags: ['Formal Wear', 'Suiting', 'Blazers', 'Shirts', 'Italian Cotton', 'Micro Check', 'Double Breasted', 'Tailored', 'Evening', 'Office Wear'],
  },
  {
    id: 'linen',
    name: 'Linen & Resort',
    description: 'Breathable Normandy flax linen and relaxed Mediterranean resort tailoring.',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=900&auto=format&fit=crop',
    fallback: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=900&auto=format&fit=crop',
    status: 'Active',
    suggestedTags: ['Linen', 'Resort', 'Summer', 'Breathable', 'Flax Linen', 'Overshirt', 'Cuban Collar', 'Vacation', 'Relaxed Fit', 'Lightweight'],
  },
  {
    id: 'trousers',
    name: 'Trousers',
    description: 'High-rise Gurkha trousers and pleated cuts with tailored horn waist adjusters.',
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=900&auto=format&fit=crop',
    fallback: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=900&auto=format&fit=crop',
    status: 'Active',
    suggestedTags: ['Trousers', 'Gurkha', 'Pleated', 'Straight Cut', 'High Rise', 'Tailored', 'Chinos', 'Bottomwear', 'Formal', 'Smart Casual'],
  },
  {
    id: 'coords',
    name: 'Co-Ords',
    description: 'Matched shacket and trouser sets for effortless contemporary styling.',
    image: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=900&auto=format&fit=crop',
    fallback: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=900&auto=format&fit=crop',
    status: 'Active',
    suggestedTags: ['Co-Ords', 'Fleece', 'Shacket', 'Loungewear', 'Streetwear', 'Twill', 'Minimal', 'Matched Set', 'Oversized', 'Urban'],
  },
  {
    id: 'footwear',
    name: 'Footwear',
    description: 'Goodyear-welted artisanal suede loafers and Italian leather footwear.',
    image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=900&auto=format&fit=crop',
    fallback: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=900&auto=format&fit=crop',
    status: 'Active',
    suggestedTags: ['Footwear', 'Suede', 'Loafers', 'Tassel Loafers', 'Handcrafted', 'Leather Sole', 'Goodyear Welt', 'Italian Suede', 'Luxury', 'Formal Shoes'],
  },
];

const SEED_SUPPLIERS = [
  { id: 'sup-1', name: 'Alpine Knits Co.', contact: '+91 98110 22340', address: 'Plot 14, Industrial Knitwear Park, Ludhiana, Punjab' },
  { id: 'sup-2', name: 'Como Cotton Mills', contact: '+91 98204 55192', address: 'Unit 8, Textile Export Zone, Lower Parel, Mumbai' },
  { id: 'sup-3', name: 'Vanguard Fleece Works', contact: '+91 98187 63014', address: 'Sector 63, Apparel Cluster, Noida, Uttar Pradesh' },
  { id: 'sup-4', name: 'Aegean Combed Cottons', contact: '+91 98450 77812', address: '19/A, Looms Residency, Tiruppur, Tamil Nadu' },
  { id: 'sup-5', name: 'Vanguard Mills Florence', contact: '+91 98221 30945', address: '42, Heritage Loom Avenue, Surat, Gujarat' },
  { id: 'sup-6', name: 'Napoli Tailored Mills', contact: '+91 98103 44120', address: 'Phase IV, Udyog Vihar, Gurugram, Haryana' },
  { id: 'sup-7', name: 'Normandy Flax Weavers', contact: '+91 98290 11284', address: '88, Flax Craft Complex, Jaipur, Rajasthan' },
  { id: 'sup-8', name: 'Tuscany Leather Works', contact: '+91 98370 90231', address: 'Leather Goods Zone, Sikandra, Agra, Uttar Pradesh' },
  { id: 'sup-9', name: 'Mediterranean Weavers', contact: '+91 98401 66430', address: 'Tidel Textile Park, Coimbatore, Tamil Nadu' },
  { id: 'sup-10', name: 'Atelier Urban Craft', contact: '+91 98195 33098', address: 'Okhla Industrial Estate Phase III, New Delhi' },
  { id: 'sup-11', name: 'CartFlow Atelier', contact: '+91 98111 00400', address: 'CartFlow Central Warehouse, Bhiwandi, Maharashtra' },
];

export const PRODUCT_STATUSES = [
  { value: 'Active', label: 'Active', description: 'Live and visible on storefront', variant: 'completed' },
  { value: 'Draft', label: 'Draft', description: 'Work in progress, not published to storefront', variant: 'neutral' },
  { value: 'Private', label: 'Private', description: 'Hidden from public storefront listings', variant: 'warning' },
  { value: 'Closed', label: 'Closed', description: 'Archived / discontinued, not for sale', variant: 'failed' },
];

export const PRESET_SIZES = [
  'S', 'M', 'L', 'XL', 'XXL',
  '38R', '40R', '42R', '44R',
  '30', '32', '34', '36',
  '40', '41', '42', '43', '44',
];

export const PRESET_COLORS = [
  { name: 'Royal Navy', hex: '#003f7f' },
  { name: 'Obsidian', hex: '#0f172a' },
  { name: 'Slate', hex: '#334155' },
  { name: 'Charcoal', hex: '#1c1917' },
  { name: 'Sandstone', hex: '#d6d3d1' },
  { name: 'Silver Mist', hex: '#e2e8f0' },
  { name: 'Ecru Cream', hex: '#e2ded5' },
  { name: 'Pure White', hex: '#ffffff' },
  { name: 'Ice Blue', hex: '#bfdbfe' },
  { name: 'Sky Blue', hex: '#93c5fd' },
  { name: 'Sage', hex: '#dcfce7' },
  { name: 'Forest Olive', hex: '#14532d' },
  { name: 'Espresso', hex: '#443831' },
];

const HEX_NAME_MAP = new Map(
  PRESET_COLORS.map((c) => [c.hex.toLowerCase(), c.name])
);

export function normalizeColorHex(color) {
  if (!color) return '#0f172a';
  if (typeof color === 'object') return String(color.hex || '#0f172a').toLowerCase();
  return String(color).toLowerCase();
}

export function getColorLabel(hex) {
  const normalized = normalizeColorHex(hex);
  return HEX_NAME_MAP.get(normalized) || normalized.toUpperCase();
}

const SEED_WAREHOUSE_META = {
  1: { sku: 'CF-KNT-001', stockCount: 28, reorderLevel: 10, supplier: 'Alpine Knits Co.', costPrice: 1100, status: 'Active', orderCount: 148, tags: ['Knitwear', 'Mock Neck', 'Winter Edit', 'Peruvian Cotton'] },
  2: { sku: 'CF-KNT-002', stockCount: 34, reorderLevel: 10, supplier: 'Alpine Knits Co.', costPrice: 980, status: 'Active', orderCount: 112, tags: ['Knitwear', 'Sky Blue', 'Resort', 'Crew Neck'] },
  3: { sku: 'CF-FRM-003', stockCount: 19, reorderLevel: 12, supplier: 'Como Cotton Mills', costPrice: 820, status: 'Active', orderCount: 164, tags: ['Formal Wear', 'Micro Check', 'Shirts', 'Italian Cotton'] },
  4: { sku: 'CF-CRD-004', stockCount: 7, reorderLevel: 10, supplier: 'Vanguard Fleece Works', costPrice: 1250, status: 'Active', orderCount: 79, tags: ['Co-Ords', 'Fleece', 'Loungewear', 'Minimal'] },
  5: { sku: 'CF-OMY-005', stockCount: 14, reorderLevel: 15, supplier: 'Aegean Combed Cottons', costPrice: 950, status: 'Active', orderCount: 135, tags: ['Old Money', 'Polo', 'Pique Cotton', 'Heritage'] },
  6: { sku: 'CF-FRM-006', stockCount: 22, reorderLevel: 8, supplier: 'Vanguard Mills Florence', costPrice: 2650, status: 'Active', orderCount: 96, tags: ['Blazers', 'Tailoring', 'Evening', 'High-Twist Wool'] },
  7: { sku: 'CF-TRS-007', stockCount: 31, reorderLevel: 12, supplier: 'Napoli Tailored Mills', costPrice: 1180, status: 'Active', orderCount: 121, tags: ['Trousers', 'Gurkha', 'Pleated', 'Tailored'] },
  8: { sku: 'CF-LIN-008', stockCount: 5, reorderLevel: 10, supplier: 'Normandy Flax Weavers', costPrice: 960, status: 'Active', orderCount: 64, tags: ['Linen', 'Overshirt', 'Resort', 'Breathable'] },
  9: { sku: 'CF-FTW-009', stockCount: 16, reorderLevel: 8, supplier: 'Tuscany Leather Works', costPrice: 2100, status: 'Active', orderCount: 88, tags: ['Footwear', 'Suede', 'Loafers', 'Handcrafted'] },
  10: { sku: 'CF-LIN-010', stockCount: 24, reorderLevel: 10, supplier: 'Mediterranean Weavers', costPrice: 890, status: 'Active', orderCount: 105, tags: ['Linen', 'Summer', 'Cuban Collar', 'Resort'] },
  11: { sku: 'CF-FRM-011', stockCount: 12, reorderLevel: 6, supplier: 'Vanguard Mills Florence', costPrice: 2900, status: 'Private', orderCount: 42, tags: ['Suiting', 'Double Breasted', 'Private Drop'] },
  12: { sku: 'CF-CRD-012', stockCount: 0, reorderLevel: 8, supplier: 'Atelier Urban Craft', costPrice: 1450, status: 'Closed', orderCount: 53, tags: ['Co-Ords', 'Archived', 'Seasonal'] },
};

function syncVariantsMatrix(sizes = [], colors = [], existingVariants = [], fallbackTotalStock = 0) {
  const safeSizes = sizes.length > 0 ? sizes : ['One Size'];
  const safeColors = colors.length > 0 ? colors.map(normalizeColorHex) : ['#0f172a'];
  const existingMap = new Map();

  (Array.isArray(existingVariants) ? existingVariants : []).forEach((v) => {
    const key = `${v.size}__${normalizeColorHex(v.color)}`;
    existingMap.set(key, Math.max(0, Number(v.qty) || 0));
  });

  const totalPairs = safeSizes.length * safeColors.length;
  const shouldDistribute = existingMap.size === 0 && totalPairs > 0;
  const baseQty = shouldDistribute ? Math.floor(Math.max(0, fallbackTotalStock) / totalPairs) : 0;
  let remainder = shouldDistribute ? Math.max(0, fallbackTotalStock) % totalPairs : 0;

  const matrix = [];
  safeSizes.forEach((size) => {
    safeColors.forEach((color) => {
      const key = `${size}__${color}`;
      let qty = existingMap.has(key) ? existingMap.get(key) : baseQty;
      if (!existingMap.has(key) && shouldDistribute && remainder > 0) {
        qty += 1;
        remainder -= 1;
      }
      matrix.push({
        key,
        size,
        color,
        qty: Math.max(0, Number(qty) || 0),
      });
    });
  });

  return matrix;
}

export function getTotalVariantStock(product) {
  if (Array.isArray(product?.variants) && product.variants.length > 0) {
    return product.variants.reduce((sum, v) => sum + Math.max(0, Number(v.qty) || 0), 0);
  }
  return Math.max(0, Number(product?.stockCount) || 0);
}

function normalizeStatus(rawStatus, isListed) {
  if (
    rawStatus === 'Active' ||
    rawStatus === 'Draft' ||
    rawStatus === 'Private' ||
    rawStatus === 'Closed'
  ) {
    return rawStatus;
  }
  if (isListed === false) return 'Private';
  return 'Active';
}

function normalizeColorImages(rawColorImages) {
  if (!rawColorImages || typeof rawColorImages !== 'object') return {};
  const next = {};
  Object.entries(rawColorImages).forEach(([hex, url]) => {
    if (url) next[normalizeColorHex(hex)] = url;
  });
  return next;
}

export function deriveSizesAndColors(variants = [], fallbackSizes = ['M'], fallbackColors = ['#0f172a']) {
  if (!Array.isArray(variants) || variants.length === 0) {
    return {
      sizes: fallbackSizes,
      colors: fallbackColors.map(normalizeColorHex),
    };
  }
  const sizeSet = new Set();
  const colorSet = new Set();
  variants.forEach((v) => {
    if (v.size) sizeSet.add(v.size);
    if (v.color) colorSet.add(normalizeColorHex(v.color));
  });
  return {
    sizes: sizeSet.size > 0 ? Array.from(sizeSet) : fallbackSizes,
    colors: colorSet.size > 0 ? Array.from(colorSet) : fallbackColors.map(normalizeColorHex),
  };
}

function buildDefaultSpecs(category = '') {
  const c = category.toLowerCase();
  if (c.includes('knit')) {
    return {
      textile: '100% Extra-Fine Peruvian Combed Cotton Knit',
      weave: '12-Gauge Ribbed Cable Construction',
      fit: 'Structured Tailored Crop Silhouette',
    };
  }
  if (c.includes('footwear')) {
    return {
      textile: 'Full-Grain Tuscan Calfskin Suede & Calf Leather Lining',
      weave: 'Blake-Stitched Goodyear Welt Sole',
      fit: 'True-to-Size European Last',
    };
  }
  if (c.includes('suiting') || c.includes('formal')) {
    return {
      textile: '120s Two-Ply Combed Cotton / High-Twist Merino Wool',
      weave: '280 GSM Breathable Tailored Drape',
      fit: 'Modern Architectural Cut',
    };
  }
  return {
    textile: '100% Normandy Flax Linen & Long-Staple Combed Cotton',
    weave: '240 GSM Breathable Luxury Weave',
    fit: 'Tailored Modern Proportions',
  };
}

export const DEFAULT_CARE_POINTS = [
  {
    title: 'Washing',
    description: 'Machine wash cold on delicate cycle or dry clean for best longevity.',
  },
  {
    title: 'Drying',
    description: 'Lay flat to dry in shade. Avoid tumble dry to preserve natural fibers.',
  },
  {
    title: 'Ironing',
    description: 'Warm steam iron inside-out while garment is slightly damp.',
  },
  {
    title: 'Storage',
    description: 'Hang on wide-shouldered wooden hangers to maintain collar and shoulder line.',
  },
];

export function normalizeCarePoints(careList, legacyCareObj) {
  if (Array.isArray(careList)) {
    return careList.map((item) => ({
      title: String(item?.title || '').trim(),
      description: String(item?.description || '').trim(),
    }));
  }
  if (legacyCareObj && typeof legacyCareObj === 'object') {
    const mapped = [
      { title: 'Washing', description: legacyCareObj.washing },
      { title: 'Drying', description: legacyCareObj.drying },
      { title: 'Ironing', description: legacyCareObj.ironing },
      { title: 'Storage', description: legacyCareObj.storage },
    ].filter((pt) => pt.description);
    if (mapped.length > 0) return mapped;
  }
  return DEFAULT_CARE_POINTS.map((pt) => ({ ...pt }));
}

export const DEFAULT_PRODUCT_FAQS = [
  {
    q: 'How does the sizing run for this piece?',
    a: 'It is tailored for a clean, true-to-size silhouette. Choose your regular size, or refer to the Size Chart for exact measurements.',
  },
  {
    q: 'What is the fabric care and washing procedure?',
    a: 'Machine wash cold on a delicate cycle with mild detergent or dry clean. Lay flat in shade to dry and steam lightly inside-out.',
  },
  {
    q: 'How can I exchange or return if the fit is not right?',
    a: 'We offer a 7-day complimentary doorstep exchange and return pickup across 19,000+ pincodes.',
  },
];

const DEFAULT_SIZE_MEASUREMENTS = {
  S: { chest: '38', shoulder: '17.5', length: '27.5', sleeve: '8.5' },
  M: { chest: '40', shoulder: '18.0', length: '28.5', sleeve: '9.0' },
  L: { chest: '42', shoulder: '18.5', length: '29.5', sleeve: '9.5' },
  XL: { chest: '44', shoulder: '19.0', length: '30.5', sleeve: '10.0' },
  XXL: { chest: '46', shoulder: '19.5', length: '31.5', sleeve: '10.5' },
};

function syncSizeChartRows(sizes = [], existingChart = []) {
  const existingMap = new Map();
  (Array.isArray(existingChart) ? existingChart : []).forEach((row) => {
    if (row?.size) existingMap.set(row.size, row);
  });

  return sizes.map((sz, idx) => {
    if (existingMap.has(sz)) return existingMap.get(sz);
    const preset = DEFAULT_SIZE_MEASUREMENTS[sz];
    if (preset) return { size: sz, ...preset };
    return {
      size: sz,
      chest: String(38 + idx * 2),
      shoulder: String((17.5 + idx * 0.5).toFixed(1)),
      length: String((27.5 + idx).toFixed(1)),
      sleeve: String((8.5 + idx * 0.5).toFixed(1)),
    };
  });
}

function enrichProduct(p) {
  const meta = SEED_WAREHOUSE_META[p.id] || {};
  const fallbackColors = Array.isArray(p.colors) && p.colors.length > 0
    ? p.colors.map(normalizeColorHex)
    : ['#0f172a'];
  const fallbackSizes = Array.isArray(p.sizes) && p.sizes.length > 0 ? p.sizes : ['M'];

  const seedStock =
    typeof p.stockCount === 'number'
      ? p.stockCount
      : typeof meta.stockCount === 'number'
        ? meta.stockCount
        : 15;

  const variants =
    Array.isArray(p.variants) && p.variants.length > 0
      ? p.variants.map((v) => ({
        key: v.key || `${v.size}__${normalizeColorHex(v.color)}`,
        size: v.size,
        color: normalizeColorHex(v.color),
        qty: Math.max(0, Number(v.qty) || 0),
      }))
      : syncVariantsMatrix(fallbackSizes, fallbackColors, [], seedStock);

  const { sizes, colors } = deriveSizesAndColors(variants, fallbackSizes, fallbackColors);
  const defaultSize =
    p.defaultSize && sizes.includes(p.defaultSize) ? p.defaultSize : sizes[0] || 'M';
  const stockCount = getTotalVariantStock({ variants, stockCount: seedStock });
  const status = normalizeStatus(p.status || meta.status, p.isListed);
  const colorImages = normalizeColorImages(p.colorImages);

  return {
    ...p,
    sku: p.sku || meta.sku || `CF-PRD-${String(p.id).padStart(3, '0')}`,
    colors,
    sizes,
    defaultSize,
    variants,
    colorImages,
    tags: Array.isArray(p.tags)
      ? p.tags
      : Array.isArray(meta.tags)
        ? meta.tags
        : [p.category].filter(Boolean),
    stockCount,
    reorderLevel: p.reorderLevel ?? meta.reorderLevel ?? 10,
    supplier: p.supplier || meta.supplier || 'CartFlow Atelier',
    costPrice: p.costPrice ?? meta.costPrice ?? Math.round((Number(p.price) || 0) * 0.45),
    orderCount: Number(p.orderCount ?? meta.orderCount ?? 0),
    status,
    inStock: status === 'Active' && stockCount > 0 && p.inStock !== false,
    shortDescription: p.shortDescription || '',
    specs: {
      ...buildDefaultSpecs(p.category),
      ...(p.specs || {}),
    },
    careInstructions: normalizeCarePoints(p.careInstructions, p.care),
    faqs: Array.isArray(p.faqs) ? p.faqs : DEFAULT_PRODUCT_FAQS.map((f) => ({ ...f })),
    sizeChart: syncSizeChartRows(sizes, p.sizeChart),
    galleryImages: Array.isArray(p.galleryImages) ? p.galleryImages : [p.imageUrl].filter(Boolean),
    activityLogs: Array.isArray(p.activityLogs)
      ? p.activityLogs
      : [
        {
          id: `prod-act-${p.id}-1`,
          type: 'stock',
          title: 'Warehouse Stock Verified',
          detail: `${stockCount} unit(s) reconciled across ${variants.length} Size × Color variant(s).`,
          timestamp: '26 Nov 2026, 10:15 AM',
        },
        {
          id: `prod-act-${p.id}-2`,
          type: status === 'Active' ? 'account' : 'ticket',
          title: `Catalog Status: ${status}`,
          detail:
            status === 'Active'
              ? 'Listed on customer storefront across Home & Shop.'
              : status === 'Private'
                ? 'Set to Private (hidden from public storefront catalog).'
                : 'Marked Closed / discontinued.',
          timestamp: '22 Nov 2026, 04:30 PM',
        },
        {
          id: `prod-act-${p.id}-3`,
          type: 'order',
          title: 'Catalog Entry Created',
          detail: `SKU ${p.sku || meta.sku || `CF-PRD-${String(p.id).padStart(3, '0')}`} onboarded from ${p.supplier || meta.supplier || 'CartFlow Atelier'}.`,
          timestamp: '12 Nov 2026, 11:00 AM',
        },
      ],
  };
}

export function getProductOrdersSample(product) {
  if (!product) return [];
  const customers = [
    'Aarav Singhania',
    'Vikramaditya Roy',
    'Kabir Malhotra',
    'Rohan Khanna',
    'Diya Sharma',
    'Meera Nair',
  ];
  const statuses = ['Delivered', 'Shipped', 'Delivered', 'Processing', 'Delivered', 'Shipped'];
  const sizes = product.sizes?.length ? product.sizes : ['M'];
  const colors = product.colors?.length ? product.colors : ['#0f172a'];
  const totalOrders = Math.min(8, Math.max(2, Math.min(Number(product.orderCount || 3), 8)));

  return Array.from({ length: totalOrders }, (_, idx) => {
    const qty = idx % 3 === 0 ? 2 : 1;
    const size = sizes[idx % sizes.length];
    const color = colors[idx % colors.length];
    const day = Math.max(10, 26 - idx * 2);
    return {
      id: `CF-${99450 - (product.id * 11 + idx)}`,
      customer: customers[(product.id + idx) % customers.length],
      variant: `${size} • ${getColorLabel(color)}`,
      qty,
      total: (Number(product.price) || 0) * qty,
      status: statuses[idx % statuses.length],
      date: `${day} Nov 2026`,
    };
  });
}

export function loadInventoryProducts() {
  try {
    const saved = localStorage.getItem(INVENTORY_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(enrichProduct);
      }
    }
  } catch {
    // ignore storage errors
  }
  return PRODUCTS.map(enrichProduct);
}

export function saveInventoryProducts(list) {
  try {
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore storage errors
  }
}

export function getListedStoreProducts() {
  return loadInventoryProducts().filter((p) => p.status === 'Active');
}

export function getProductStatusMeta(status) {
  return (
    PRODUCT_STATUSES.find((s) => s.value === status) ||
    PRODUCT_STATUSES[0]
  );
}

export function getStockStatus(product) {
  const count = getTotalVariantStock(product);
  const reorder = Number(product.reorderLevel ?? 10);
  if (count <= 0) {
    return { key: 'out', label: 'Out of Stock', variant: 'failed' };
  }
  if (count <= reorder) {
    return { key: 'low', label: 'Low Stock', variant: 'warning' };
  }
  return { key: 'healthy', label: 'In Stock', variant: 'completed' };
}

export function loadCatalogs() {
  try {
    const saved = localStorage.getItem(CATALOG_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((c, idx) => ({
          id: c.id || `cat-${idx + 1}`,
          name: String(c.name || 'Untitled').trim(),
          description: c.description || '',
          image: c.image || SEED_CATALOGS[0].image,
          fallback: c.fallback || SEED_CATALOGS[0].fallback,
          status: c.status === 'Hidden' ? 'Hidden' : 'Active',
          suggestedTags: Array.isArray(c.suggestedTags) ? c.suggestedTags.slice(0, 10) : [],
        }));
      }
    }
  } catch {
    // ignore storage errors
  }
  return SEED_CATALOGS.map((c) => ({ ...c }));
}

export function saveCatalogs(list) {
  try {
    localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore storage errors
  }
}

export function getActiveCatalogs() {
  return loadCatalogs().filter((c) => c.status !== 'Hidden');
}

export function getCatalogTagSuggestions(catalogName, productsList = []) {
  const catalogs = loadCatalogs();
  const matched = catalogs.find(
    (c) => c.name.toLowerCase() === String(catalogName || '').toLowerCase()
  );

  const seen = new Set();
  const result = [];

  const pushTag = (raw) => {
    const clean = String(raw || '').trim();
    if (!clean) return;
    const key = clean.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    result.push(clean);
  };

  (matched?.suggestedTags || []).forEach(pushTag);
  (Array.isArray(productsList) ? productsList : []).forEach((p) => {
    if (String(p.category || '').toLowerCase() === String(catalogName || '').toLowerCase()) {
      (p.tags || []).forEach(pushTag);
    }
  });

  return result.slice(0, 10);
}

export function loadSuppliers() {
  try {
    const saved = localStorage.getItem(SUPPLIER_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // ignore storage errors
  }
  return SEED_SUPPLIERS.map((s) => ({ ...s }));
}

export function saveSuppliers(list) {
  try {
    localStorage.setItem(SUPPLIER_STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore storage errors
  }
}

export const STOREFRONT_IMAGE_ACCEPT = '.jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp';
const ALLOWED_IMAGE_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const ALLOWED_IMAGE_EXT_RE = /\.(jpe?g|png|webp)$/i;

function getImageDimensions(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function readFilesAsDataUrls(fileList) {
  const files = Array.from(fileList || []);
  return Promise.all(
    files.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result || ''));
          reader.onerror = () => resolve('');
          reader.readAsDataURL(file);
        })
    )
  ).then((urls) => urls.filter(Boolean));
}

export async function validateStorefrontImageFiles(
  fileList,
  { maxFileMb = 5, targetRatio = 5 / 6, ratioTolerance = 0.02 } = {}
) {
  const rawFiles = Array.from(fileList || []);
  const maxBytes = maxFileMb * 1024 * 1024;
  const validFiles = [];
  let invalidTypeCount = 0;
  let oversizedCount = 0;

  rawFiles.forEach((file) => {
    const mimeOk = ALLOWED_IMAGE_MIME_TYPES.has((file.type || '').toLowerCase());
    const extOk = ALLOWED_IMAGE_EXT_RE.test(file.name || '');
    if (!mimeOk && !extOk) {
      invalidTypeCount += 1;
      return;
    }
    if (file.size > maxBytes) {
      oversizedCount += 1;
      return;
    }
    validFiles.push(file);
  });

  if (validFiles.length === 0) {
    return { validUrls: [], invalidTypeCount, oversizedCount, invalidRatioCount: 0 };
  }

  const urls = await readFilesAsDataUrls(validFiles);
  if (!targetRatio) {
    return { validUrls: urls, invalidTypeCount, oversizedCount, invalidRatioCount: 0 };
  }

  const checks = await Promise.all(
    urls.map(async (url) => {
      const dims = await getImageDimensions(url);
      if (!dims || !dims.width || !dims.height) return { url, valid: false };
      const ratio = dims.width / dims.height;
      return { url, valid: Math.abs(ratio - targetRatio) <= ratioTolerance };
    })
  );

  const validUrls = checks.filter((c) => c.valid).map((c) => c.url);
  const invalidRatioCount = checks.length - validUrls.length;

  return { validUrls, invalidTypeCount, oversizedCount, invalidRatioCount };
}

