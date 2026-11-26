import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ChevronLeft,
  Save,
  Plus,
  Trash2,
  X,
  Upload,
  ExternalLink,
  Tag,
  Clock,
  HelpCircle,
  Sparkles,
  FileText,
  CheckCircle2,
  Building2,
  AlertTriangle,
  Lock,
  Star,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  Input,
  Modal,
  RichTextEditor,
  Select,
  Table,
  Textarea,
  ToastContainer,
  stripHtmlTags,
} from '../../components/ui';
import AccordionPointList from '../../components/common/AccordionPointList';
import ActivityTimeline from '../../components/common/ActivityTimeline';
import { useToasts } from '../../hooks/useToasts';
import {
  DEFAULT_CARE_POINTS,
  DEFAULT_PRODUCT_FAQS,
  MAX_PRODUCT_TAGS_CHARS,
  PRESET_COLORS,
  PRESET_SIZES,
  PRODUCT_STATUSES,
  STOREFRONT_IMAGE_ACCEPT,
  deriveSizesAndColors,
  getCatalogTagSuggestions,
  getColorLabel,
  getProductOrdersSample,
  getProductStatusMeta,
  loadCatalogs,
  loadInventoryProducts,
  loadSuppliers,
  normalizeCarePoints,
  normalizeColorHex,
  saveInventoryProducts,
  saveSuppliers,
  validateStorefrontImageFiles,
} from '../../data/inventoryProducts';
import './AdminConsole.css';

const MAX_MEDIA_IMAGES = 20;
const MAX_MEDIA_FILE_MB = 5;
const MAX_CARE_POINTS = 20;
const MAX_FAQS = 20;
const MAX_CARE_HEADING_CHARS = 50;
const MAX_CARE_DESC_CHARS = 180;
const MAX_FAQ_Q_CHARS = 120;
const MAX_FAQ_A_CHARS = 300;

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80';

function generateNextSku(products, category) {
  const prefix =
    (category || 'PRD')
      .replace(/[^A-Za-z]/g, '')
      .slice(0, 3)
      .toUpperCase() || 'PRD';
  const nextNum =
    products.reduce((max, p) => Math.max(max, Number(p.id) || 0), 0) + 1;
  return `CF-${prefix}-${String(nextNum).padStart(3, '0')}`;
}

function toShortSnippet(text = '', limit = 140) {
  const clean = stripHtmlTags(text);
  if (clean.length <= limit) return clean;
  const sliced = clean.slice(0, limit - 3);
  const lastSpace = sliced.lastIndexOf(' ');
  return `${(lastSpace > 40 ? sliced.slice(0, lastSpace) : sliced).trim()}...`;
}

function buildInitialForm(existingProduct, existingProducts) {
  if (existingProduct) {
    return {
      title: existingProduct.title || '',
      shortDescription:
        existingProduct.shortDescription ||
        toShortSnippet(existingProduct.description, 140),
      sku: existingProduct.sku || '',
      category: existingProduct.category || (loadCatalogs()[0]?.name || 'Old Money'),
      supplier: existingProduct.supplier || 'CartFlow Atelier',
      description: existingProduct.description || '',
      price: String(existingProduct.price ?? ''),
      originalPrice: existingProduct.originalPrice
        ? String(existingProduct.originalPrice)
        : existingProduct.price
          ? String(existingProduct.price)
          : '',
      costPrice: existingProduct.costPrice ? String(existingProduct.costPrice) : '',
      reorderLevel: String(existingProduct.reorderLevel ?? 10),
      status: existingProduct.status || 'Active',
      imageUrl: existingProduct.imageUrl || '',
      galleryImages: Array.from(
        new Set(
          [
            existingProduct.imageUrl,
            ...(Array.isArray(existingProduct.galleryImages) ? existingProduct.galleryImages : []),
          ].filter(Boolean)
        )
      ).slice(0, MAX_MEDIA_IMAGES),
      tags: Array.isArray(existingProduct.tags) ? existingProduct.tags : [],
      defaultSize: existingProduct.defaultSize || existingProduct.sizes?.[0] || 'S',
      variants: Array.isArray(existingProduct.variants) ? existingProduct.variants : [],
      careInstructions: normalizeCarePoints(
        existingProduct.careInstructions,
        existingProduct.care
      ).slice(0, MAX_CARE_POINTS),
      faqs: Array.isArray(existingProduct.faqs)
        ? existingProduct.faqs.slice(0, MAX_FAQS).map((f) => ({ ...f }))
        : DEFAULT_PRODUCT_FAQS.map((f) => ({ ...f })),
    };
  }

  const defaultCat = loadCatalogs()[0]?.name || 'Old Money';
  return {
    title: '',
    shortDescription: '',
    sku: '',
    category: defaultCat,
    supplier: loadSuppliers()[0]?.name || 'CartFlow Atelier',
    description: '',
    price: '',
    originalPrice: '',
    costPrice: '',
    reorderLevel: '8',
    status: 'Draft',
    imageUrl: '',
    galleryImages: [],
    tags: ['New Drop', 'Menswear'],
    defaultSize: 'S',
    variants: [
      { key: 'S__#0f172a', size: 'S', color: '#0f172a', qty: 10 },
      { key: 'M__#0f172a', size: 'M', color: '#0f172a', qty: 15 },
      { key: 'M__#003f7f', size: 'M', color: '#003f7f', qty: 12 },
      { key: 'L__#0f172a', size: 'L', color: '#0f172a', qty: 14 },
      { key: 'XL__#003f7f', size: 'XL', color: '#003f7f', qty: 8 },
    ],
    careInstructions: DEFAULT_CARE_POINTS.map((c) => ({ ...c })),
    faqs: DEFAULT_PRODUCT_FAQS.map((f) => ({ ...f })),
  };
}

export default function AdminProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToasts(3200);

  const existingProducts = useMemo(() => loadInventoryProducts(), [id]);
  const isEditMode = Boolean(id);
  const existingProduct = useMemo(
    () => (isEditMode ? existingProducts.find((p) => String(p.id) === String(id)) : null),
    [existingProducts, id, isEditMode]
  );

  const [form, setForm] = useState(() => buildInitialForm(existingProduct, existingProducts));

  const [errors, setErrors] = useState({});

  // Always default to first active size so every product renders the same compact 1-panel layout
  const [selectedSizeTab, setSelectedSizeTab] = useState(
    () => (existingProduct?.sizes?.[0] || 'S')
  );
  const [sizePopoverOpen, setSizePopoverOpen] = useState(false);
  const [customSizeInput, setCustomSizeInput] = useState('');
  const sizePopoverRef = useRef(null);
  const [colorPickerSize, setColorPickerSize] = useState(null);
  const [customColorHex, setCustomColorHex] = useState('');
  const customColorInputRef = useRef(null);
  const [tagInput, setTagInput] = useState('');

  // Storefront parity tabs: 'specs' | 'care' | 'faqs'
  const [detailTab, setDetailTab] = useState('specs');
  const [expandedCareIdx, setExpandedCareIdx] = useState(null);
  const [expandedFaqIdx, setExpandedFaqIdx] = useState(null);

  // Activity & Orders Modal
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [ordersPage, setOrdersPage] = useState(1);

  // Catalogs & Suppliers lists + Add Supplier Modal
  const [catalogs] = useState(loadCatalogs);
  const [suppliers, setSuppliers] = useState(loadSuppliers);
  const [supplierModalOpen, setSupplierModalOpen] = useState(false);
  const [supplierForm, setSupplierForm] = useState({ name: '', contact: '', address: '' });
  const [supplierErrors, setSupplierErrors] = useState({});

  // Persisted status lock (cannot revert back to Draft once active/non-draft) & confirmation modal
  const [persistedStatus, setPersistedStatus] = useState(() => existingProduct?.status || 'Draft');
  const [statusConfirmModal, setStatusConfirmModal] = useState(null);
  const isDraftLocked = isEditMode && persistedStatus !== 'Draft';

  const { sizes: activeSizes, colors: activeColors } = useMemo(
    () => deriveSizesAndColors(form.variants, [], []),
    [form.variants]
  );

  const presetHexSet = useMemo(
    () => new Set(PRESET_COLORS.map((c) => normalizeColorHex(c.hex))),
    []
  );

  const customGridColors = useMemo(
    () => activeColors.filter((hex) => !presetHexSet.has(hex)),
    [activeColors, presetHexSet]
  );

  const quickSizeOptions = useMemo(
    () => Array.from(new Set([...PRESET_SIZES, ...activeSizes])),
    [activeSizes]
  );

  const groupedBySize = useMemo(() => {
    return activeSizes.map((sz) => {
      const rows = form.variants.filter((v) => v.size === sz);
      const sizeQty = rows.reduce((s, r) => s + Math.max(0, Number(r.qty) || 0), 0);
      return { size: sz, rows, sizeQty };
    });
  }, [activeSizes, form.variants]);

  const activeSizeKey = useMemo(
    () => (activeSizes.includes(selectedSizeTab) ? selectedSizeTab : activeSizes[0] || ''),
    [activeSizes, selectedSizeTab]
  );

  const activeDefaultSize = useMemo(
    () => (activeSizes.includes(form.defaultSize) ? form.defaultSize : activeSizes[0] || ''),
    [activeSizes, form.defaultSize]
  );

  useEffect(() => {
    setForm(buildInitialForm(existingProduct, existingProducts));
    setPersistedStatus(existingProduct?.status || 'Draft');
    setStatusConfirmModal(null);
    setSelectedSizeTab(existingProduct?.defaultSize || existingProduct?.sizes?.[0] || 'S');
    setColorPickerSize(null);
    setSizePopoverOpen(false);
    setDetailTab('specs');
    setExpandedCareIdx(null);
    setExpandedFaqIdx(null);
    setErrors({});
  }, [id, existingProduct, existingProducts]);

  const visibleSizeGroups = useMemo(() => {
    const match = groupedBySize.find((g) => g.size === activeSizeKey);
    return match ? [match] : groupedBySize.slice(0, 1);
  }, [groupedBySize, activeSizeKey]);

  const totalVariantStock = useMemo(
    () => form.variants.reduce((sum, v) => sum + Math.max(0, Number(v.qty) || 0), 0),
    [form.variants]
  );

  const productOrders = useMemo(
    () => (existingProduct ? getProductOrdersSample(existingProduct) : []),
    [existingProduct]
  );

  if (isEditMode && !existingProduct) {
    return (
      <div className="cf-admin-content-inner">
        <Card>
          <Card.Header title="Product Not Found" subtitle={`No product matches ID #${id}.`} />
          <Card.Body>
            <Button variant="primary" onClick={() => navigate('/admin/inventory')}>
              Back to Inventory
            </Button>
          </Card.Body>
        </Card>
      </div>
    );
  }

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key] || (key === 'originalPrice' && errors.price)) {
      setErrors((prev) => ({
        ...prev,
        [key]: '',
        ...(key === 'originalPrice' ? { price: '' } : {}),
      }));
    }
  };

  useEffect(() => {
    if (!sizePopoverOpen) return undefined;
    const handleOutside = (e) => {
      if (sizePopoverRef.current && !sizePopoverRef.current.contains(e.target)) {
        setSizePopoverOpen(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === 'Escape') setSizePopoverOpen(false);
    };
    document.addEventListener('pointerdown', handleOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('pointerdown', handleOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [sizePopoverOpen]);

  // Add/Remove Sizes
  const handleAddSize = (sizeLabel) => {
    const clean = String(sizeLabel || '').trim().toUpperCase();
    if (!clean) return;
    if (activeSizes.includes(clean)) {
      setSelectedSizeTab(clean);
      return;
    }
    const baseColor = activeColors[0] || '#0f172a';
    setForm((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        { key: `${clean}__${baseColor}`, size: clean, color: baseColor, qty: 10 },
      ],
    }));
    setSelectedSizeTab(clean);
    setCustomSizeInput('');
  };

  const handleRemoveSize = (sizeLabel) => {
    if (activeSizes.length <= 1) {
      addToast('warning', 'Minimum Size Required', 'A product needs at least one size.');
      return;
    }
    setForm((prev) => {
      const nextVariants = prev.variants.filter((v) => v.size !== sizeLabel);
      const nextSizes = Array.from(new Set(nextVariants.map((v) => v.size)));
      return {
        ...prev,
        variants: nextVariants,
        defaultSize:
          prev.defaultSize === sizeLabel ? nextSizes[0] || '' : prev.defaultSize,
      };
    });
    if (selectedSizeTab === sizeLabel) setSelectedSizeTab('');
    if (colorPickerSize === sizeLabel) setColorPickerSize(null);
  };

  const handleAddColorToSize = (sizeLabel, rawHex) => {
    const hex = normalizeColorHex(rawHex);
    const exists = form.variants.some((v) => v.size === sizeLabel && v.color === hex);
    if (exists) {
      addToast('info', 'Color Already Present', `${getColorLabel(hex)} already exists for size ${sizeLabel}.`);
      return;
    }
    setForm((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        { key: `${sizeLabel}__${hex}`, size: sizeLabel, color: hex, qty: 10 },
      ],
    }));
  };

  const handleRemoveColorFromSize = (sizeLabel, hex) => {
    if (form.variants.length <= 1) {
      addToast('warning', 'Minimum Variant Required', 'Keep at least one Size × Color variant.');
      return;
    }
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.filter((v) => !(v.size === sizeLabel && v.color === hex)),
    }));
  };

  const handleVariantQtyChange = (variantKey, rawQty) => {
    const safeQty = Math.max(0, Math.floor(Number(rawQty) || 0));
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.map((v) => (v.key === variantKey ? { ...v, qty: safeQty } : v)),
    }));
  };

  const commitCustomColorRef = useRef(null);
  commitCustomColorRef.current = () => {
    if (!customColorHex || !colorPickerSize) return;
    handleAddColorToSize(colorPickerSize, customColorHex);
    setCustomColorHex('');
  };

  useEffect(() => {
    if (!customColorHex || !colorPickerSize) return undefined;
    const handleOutsideClick = (e) => {
      if (customColorInputRef.current && e.target === customColorInputRef.current) {
        return;
      }
      commitCustomColorRef.current?.();
    };
    document.addEventListener('pointerdown', handleOutsideClick);
    return () => document.removeEventListener('pointerdown', handleOutsideClick);
  }, [customColorHex, colorPickerSize]);

  // Media Uploads (max 20 images, max 5MB each, JPG/PNG/WEBP only, 5:6 ratio)
  const handleMultiFileUpload = async (e) => {
    const input = e.target;
    const rawFiles = Array.from(input.files || []);
    input.value = '';
    if (rawFiles.length === 0) return;

    const availableSlots = Math.max(0, MAX_MEDIA_IMAGES - form.galleryImages.length);
    if (availableSlots === 0) {
      addToast('warning', 'Media Limit Reached', `Maximum ${MAX_MEDIA_IMAGES} images allowed per product.`);
      return;
    }

    const { validUrls, invalidTypeCount, oversizedCount, invalidRatioCount } =
      await validateStorefrontImageFiles(rawFiles, { maxFileMb: MAX_MEDIA_FILE_MB });

    if (invalidTypeCount > 0) {
      addToast(
        'warning',
        'Unsupported Format',
        `${invalidTypeCount} file(s) skipped. Only JPG, JPEG, PNG, and WEBP images are supported.`
      );
    }
    if (oversizedCount > 0) {
      addToast(
        'warning',
        'File Too Large',
        `${oversizedCount} file(s) exceeded the ${MAX_MEDIA_FILE_MB}MB size limit and were skipped.`
      );
    }
    if (invalidRatioCount > 0) {
      addToast(
        'warning',
        'Invalid Aspect Ratio',
        `${invalidRatioCount} file(s) skipped. Storefront requires a 5:6 ratio (e.g. 1000×1200 px).`
      );
    }
    if (validUrls.length === 0) return;

    const uniqueNew = validUrls.filter((url) => !form.galleryImages.includes(url));
    if (uniqueNew.length === 0) {
      addToast('info', 'Duplicate Image', 'Selected image(s) are already in the gallery.');
      return;
    }

    const accepted = uniqueNew.slice(0, availableSlots);
    if (uniqueNew.length > availableSlots) {
      addToast(
        'warning',
        'Media Limit Reached',
        `Added ${accepted.length} image(s). Maximum ${MAX_MEDIA_IMAGES} images allowed per product.`
      );
    }

    setForm((prev) => {
      const nextUnique = accepted.filter((url) => !prev.galleryImages.includes(url));
      const nextGallery = [...prev.galleryImages, ...nextUnique].slice(0, MAX_MEDIA_IMAGES);
      return {
        ...prev,
        imageUrl: prev.imageUrl || nextGallery[0] || '',
        galleryImages: nextGallery,
      };
    });
  };

  const handleRemoveGalleryImage = (url) => {
    setForm((prev) => {
      const nextGallery = prev.galleryImages.filter((img) => img !== url);
      const nextCover = prev.imageUrl === url ? nextGallery[0] || '' : prev.imageUrl;
      return {
        ...prev,
        galleryImages: nextGallery,
        imageUrl: nextCover,
      };
    });
  };

  // Care Points & FAQs shared state helpers (max 20 each)
  const handleAddPointItem = (listKey, maxLimit, label, emptyItem, setExpandedIdx) => {
    if (form[listKey].length >= maxLimit) {
      addToast('warning', 'Limit Reached', `Maximum ${maxLimit} ${label} allowed per product.`);
      return;
    }
    const nextIdx = form[listKey].length;
    setForm((prev) => ({ ...prev, [listKey]: [...prev[listKey], emptyItem] }));
    setExpandedIdx(nextIdx);
  };

  const handleUpdatePointItem = (listKey, errorKey, index, field, val) => {
    setForm((prev) => ({
      ...prev,
      [listKey]: prev[listKey].map((item, idx) =>
        idx === index ? { ...item, [field]: val } : item
      ),
    }));
    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: '' }));
    }
  };

  const handleRemovePointItem = (listKey, errorKey, setExpandedIdx, index) => {
    setForm((prev) => ({
      ...prev,
      [listKey]: prev[listKey].filter((_, idx) => idx !== index),
    }));
    setExpandedIdx((curr) =>
      curr === index ? null : curr !== null && curr > index ? curr - 1 : curr
    );
    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: '' }));
    }
  };

  const totalTagChars = useMemo(() => form.tags.join(', ').length, [form.tags]);

  const catalogTagSuggestions = useMemo(() => {
    const allSuggested = getCatalogTagSuggestions(form.category, existingProducts);
    const activeLower = new Set(form.tags.map((t) => t.toLowerCase()));
    return allSuggested.filter((t) => !activeLower.has(t.toLowerCase())).slice(0, 10);
  }, [form.category, form.tags, existingProducts]);

  const addTagsList = (rawCandidates = []) => {
    const nextTags = [...form.tags];
    let hitLimit = false;

    rawCandidates.forEach((candidate) => {
      const clean = String(candidate || '').trim();
      if (!clean) return;
      if (nextTags.some((t) => t.toLowerCase() === clean.toLowerCase())) return;
      const candidateLength = [...nextTags, clean].join(', ').length;
      if (candidateLength > MAX_PRODUCT_TAGS_CHARS) {
        hitLimit = true;
        return;
      }
      nextTags.push(clean);
    });

    if (hitLimit) {
      addToast(
        'warning',
        'Tag Limit Reached',
        `Total tags cannot exceed ${MAX_PRODUCT_TAGS_CHARS} characters.`
      );
    }

    setForm((prev) => ({ ...prev, tags: nextTags }));
  };

  const handleTagInputChange = (e) => {
    const val = e.target.value;
    if (val.includes(',')) {
      const parts = val.split(',');
      const trailing = parts.pop() || '';
      addTagsList(parts);
      setTagInput(trailing.trimStart());
      return;
    }
    const prospectiveLen = [...form.tags, val.trim()].filter(Boolean).join(', ').length;
    if (prospectiveLen <= MAX_PRODUCT_TAGS_CHARS || val.length < tagInput.length) {
      setTagInput(val);
    }
  };

  const handleCommitTagInput = () => {
    if (!tagInput.trim()) return;
    addTagsList(tagInput.split(','));
    setTagInput('');
  };

  const handleRemoveTag = (tag) => {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  };

  const handleSupplierSelectChange = (val) => {
    if (val === '__add_new__') {
      setSupplierForm({ name: '', contact: '', address: '' });
      setSupplierErrors({});
      setSupplierModalOpen(true);
      return;
    }
    updateField('supplier', val);
  };

  const handleSaveNewSupplier = (e) => {
    e.preventDefault();
    const errs = {};
    if (!supplierForm.name.trim()) errs.name = 'Supplier name is required.';
    if (!supplierForm.contact.trim()) errs.contact = 'Contact number is required.';
    if (!supplierForm.address.trim()) errs.address = 'Supplier address is required.';
    if (Object.keys(errs).length > 0) {
      setSupplierErrors(errs);
      return;
    }

    const cleanName = supplierForm.name.trim();
    const duplicate = suppliers.find(
      (s) => s.name.toLowerCase() === cleanName.toLowerCase()
    );
    if (duplicate) {
      updateField('supplier', duplicate.name);
      setSupplierModalOpen(false);
      addToast('info', 'Supplier Selected', `${duplicate.name} is already in your supplier list.`);
      return;
    }

    const created = {
      id: `sup-${Date.now()}`,
      name: cleanName,
      contact: supplierForm.contact.trim(),
      address: supplierForm.address.trim(),
    };
    const nextSuppliers = [...suppliers, created];
    setSuppliers(nextSuppliers);
    saveSuppliers(nextSuppliers);
    updateField('supplier', created.name);
    setSupplierModalOpen(false);
    addToast('success', 'Supplier Added', `${created.name} added to supplier directory.`);
  };

  const sellingNum = Math.max(0, Number(form.price) || 0);
  const mrpNum = Math.max(0, Number(form.originalPrice) || 0);
  const costNum = Math.max(0, Number(form.costPrice) || 0);
  const reorderNum = Math.max(0, Number(form.reorderLevel) || 0);

  const discountPct =
    mrpNum > sellingNum && sellingNum > 0
      ? Math.round(((mrpNum - sellingNum) / mrpNum) * 100)
      : 0;
  const isSellingExceedingMrp = mrpNum > 0 && sellingNum > mrpNum;
  const sellingPriceError =
    errors.price ||
    (isSellingExceedingMrp ? 'Selling price cannot be greater than MRP.' : '');

  const statusMeta = getProductStatusMeta(form.status);
  const extraImages = form.galleryImages.filter((u) => u !== form.imageUrl);
  const isMediaLimitReached = form.galleryImages.length >= MAX_MEDIA_IMAGES;

  const handleRequestStatusChange = (nextStatus) => {
    if (nextStatus === form.status) return;
    if (nextStatus === 'Draft' && isDraftLocked) {
      addToast('warning', 'Draft Locked', 'Published products cannot be reverted back to Draft.');
      return;
    }

    if (
      nextStatus === 'Private' ||
      nextStatus === 'Closed' ||
      (form.status === 'Draft' && nextStatus === 'Active')
    ) {
      setStatusConfirmModal({ targetStatus: nextStatus, submitOnConfirm: false });
      return;
    }

    updateField('status', nextStatus);
  };

  const handleConfirmStatusModal = () => {
    if (!statusConfirmModal) return;
    const { targetStatus, submitOnConfirm } = statusConfirmModal;
    updateField('status', targetStatus);
    setStatusConfirmModal(null);
    if (submitOnConfirm) {
      handleSubmit(null, targetStatus, true);
    }
  };

  const handleSwitchToOutOfStockInstead = () => {
    setForm((prev) => ({
      ...prev,
      status: 'Active',
      variants: prev.variants.map((v) => ({ ...v, qty: 0 })),
    }));
    setStatusConfirmModal(null);
    addToast(
      'info',
      'Set to Out of Stock',
      'Status kept Active and all variant quantities set to 0.'
    );
  };

  const getStatusModalMeta = (targetStatus) => {
    if (targetStatus === 'Private') {
      return {
        title: 'Switch Product to Private?',
        subtitle: 'Storefront visibility warning',
        tone: 'warning',
        message:
          'Making this product Private will immediately stop it from showing to public shoppers on the storefront.',
        tip: 'Better option: If stock is temporarily unavailable, keep the product Active and set variant quantities to 0 (Out of Stock) instead.',
        confirmLabel: 'Yes, Make Private',
        confirmVariant: 'primary',
        allowOutOfStockAlt: true,
      };
    }
    if (targetStatus === 'Closed') {
      return {
        title: 'Mark Product as Closed?',
        subtitle: 'Permanent discontinuation warning',
        tone: 'danger',
        message:
          'Closing this product will hide it from the public storefront. Only mark this product as Closed if you are completely sure it will never be sold again in the future.',
        tip: 'If you might sell or restock this item later, set all variant quantities to 0 (Out of Stock) instead of closing it.',
        confirmLabel: 'Yes, Mark as Closed',
        confirmVariant: 'danger',
        allowOutOfStockAlt: true,
      };
    }
    return {
      title: 'Publish Product to Storefront?',
      subtitle: 'Draft status will be locked permanently',
      tone: 'primary',
      message:
        'Publishing this product will make it Active and visible to everyone on the storefront.',
      tip: 'Once published, you can always edit its details, pricing, stock, or move it to Private/Closed later - but you cannot move it back to Draft.',
      confirmLabel: 'Yes, Publish Active',
      confirmVariant: 'primary',
      allowOutOfStockAlt: false,
    };
  };

  const handleSubmit = (e, statusOverride = null, skipStatusConfirm = false) => {
    if (e && e.preventDefault) e.preventDefault();

    const nextErrors = {};
    if (!form.title.trim()) nextErrors.title = 'Product title is required.';
    if (isEditMode && !form.sku.trim()) nextErrors.sku = 'SKU code is required.';
    if (mrpNum <= 0) nextErrors.originalPrice = 'Enter a valid MRP.';
    if (sellingNum <= 0) {
      nextErrors.price = 'Enter a valid selling price.';
    } else if (mrpNum > 0 && sellingNum > mrpNum) {
      nextErrors.price = 'Selling price cannot be greater than MRP.';
    }
    if (!stripHtmlTags(form.description)) {
      nextErrors.description = 'Add full details in Storefront Product Sections.';
      setDetailTab('specs');
    }

    const badCareIdx = form.careInstructions.findIndex(
      (c) => !c.title.trim() || !c.description.trim()
    );
    if (badCareIdx !== -1) {
      nextErrors.careError = `Care Instruction #${badCareIdx + 1} requires both heading and description.`;
      if (!nextErrors.description) {
        setDetailTab('care');
        setExpandedCareIdx(badCareIdx);
      }
    }

    const badFaqIdx = form.faqs.findIndex((f) => !f.q.trim() || !f.a.trim());
    if (badFaqIdx !== -1) {
      nextErrors.faqError = `FAQ #${badFaqIdx + 1} requires both question and answer.`;
      if (!nextErrors.description && badCareIdx === -1) {
        setDetailTab('faqs');
        setExpandedFaqIdx(badFaqIdx);
      }
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      addToast(
        'error',
        'Required Fields Missing',
        nextErrors.careError ||
        nextErrors.faqError ||
        'Please complete the highlighted product fields.'
      );
      return;
    }

    const finalStatus = statusOverride || form.status || 'Draft';
    if (isDraftLocked && finalStatus === 'Draft') {
      addToast('warning', 'Draft Locked', 'Published products cannot be reverted back to Draft.');
      return;
    }

    if (!skipStatusConfirm && finalStatus === 'Active' && form.status === 'Draft') {
      setStatusConfirmModal({ targetStatus: 'Active', submitOnConfirm: true });
      return;
    }

    if (statusOverride && statusOverride !== form.status) {
      updateField('status', statusOverride);
    }

    const resolvedSku = (
      form.sku.trim() || generateNextSku(existingProducts, form.category)
    ).toUpperCase();

    const coverImg = form.imageUrl.trim() || form.galleryImages[0] || FALLBACK_IMAGE;
    const cleanedGallery = Array.from(
      new Set([coverImg, ...form.galleryImages].filter(Boolean))
    ).slice(0, MAX_MEDIA_IMAGES);
    const cleanedFaqs = form.faqs
      .filter((f) => f.q.trim() && f.a.trim())
      .slice(0, MAX_FAQS)
      .map((f) => ({ q: f.q.trim(), a: f.a.trim() }));
    const cleanedCare = form.careInstructions
      .filter((c) => c.title.trim() && c.description.trim())
      .slice(0, MAX_CARE_POINTS)
      .map((c) => ({ title: c.title.trim(), description: c.description.trim() }));

    const nowText = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newActivity = {
      id: `prod-act-${Date.now()}`,
      type: 'account',
      title: isEditMode
        ? 'Product Updated by Admin'
        : finalStatus === 'Active'
          ? 'Product Published to Storefront'
          : 'Product Saved as Draft',
      detail: `${form.title.trim()} (${resolvedSku}) • Status: ${finalStatus} • ${totalVariantStock} units across ${form.variants.length} variants.`,
      timestamp: nowText,
    };

    const payload = {
      id: existingProduct
        ? existingProduct.id
        : existingProducts.reduce((max, p) => Math.max(max, Number(p.id) || 0), 0) + 1,
      title: form.title.trim(),
      shortDescription: form.shortDescription.trim(),
      sku: resolvedSku,
      category: form.category,
      supplier: form.supplier.trim() || 'CartFlow Atelier',
      description: form.description.trim(),
      price: sellingNum,
      originalPrice: mrpNum > sellingNum ? mrpNum : undefined,
      costPrice: costNum > 0 ? costNum : Math.round(sellingNum * 0.45),
      stockCount: totalVariantStock,
      reorderLevel: reorderNum,
      status: finalStatus,
      inStock: finalStatus === 'Active' && totalVariantStock > 0,
      imageUrl: coverImg,
      galleryImages: cleanedGallery,
      colorImages: {},
      tags: form.tags,
      sizes: activeSizes,
      defaultSize: activeDefaultSize || activeSizes[0] || 'M',
      colors: activeColors,
      variants: form.variants,
      specs: existingProduct?.specs,
      careInstructions: cleanedCare,
      faqs: cleanedFaqs,
      rating: existingProduct?.rating ?? 4.8,
      reviewCount: existingProduct?.reviewCount ?? 0,
      orderCount: existingProduct?.orderCount ?? 0,
      activityLogs: [newActivity, ...(existingProduct?.activityLogs || [])],
    };

    const nextList = isEditMode
      ? existingProducts.map((p) => (p.id === payload.id ? payload : p))
      : [payload, ...existingProducts];

    saveInventoryProducts(nextList);
    if (isEditMode) {
      setPersistedStatus(finalStatus);
    }
    addToast(
      'success',
      isEditMode
        ? 'Product Updated'
        : finalStatus === 'Active'
          ? 'Product Published'
          : 'Saved as Draft',
      `${payload.title} (${finalStatus}) • ${totalVariantStock} unit(s) across ${form.variants.length} variants.`
    );

    if (!isEditMode) {
      setTimeout(() => navigate('/admin/inventory'), 450);
    }
  };

  return (
    <div className="cf-admin-content-inner">
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Top Action Header */}
      <div className="cf-shopify-topbar">
        <div className="cf-shopify-topbar-left">
          <button
            type="button"
            className="cf-admin-back-chevron-btn"
            onClick={() => navigate('/admin/inventory')}
            title="Back to Inventory"
            aria-label="Back to Inventory"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="cf-shopify-title-block">
            <div className="cf-shopify-title-row">
              <h1 className="cf-shopify-page-title">
                {form.title.trim() || (isEditMode ? 'Untitled Product' : 'Add Product')}
              </h1>
              {isEditMode && form.sku && (
                <Badge variant="mono" size="sm">{form.sku.toUpperCase()}</Badge>
              )}
              <Badge dot size="sm" variant={statusMeta.variant}>
                {statusMeta.label}
              </Badge>
            </div>
          </div>
        </div>

        <div className="cf-shopify-topbar-actions">
          {isEditMode ? (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                icon={Clock}
                onClick={() => setActivityModalOpen(true)}
              >
                Orders & Log
              </Button>
              {form.status === 'Active' && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  icon={ExternalLink}
                  onClick={() => window.open(`/product/${existingProduct.id}`, '_blank')}
                >
                  View in Store
                </Button>
              )}
              <Button
                type="button"
                variant="primary"
                size="sm"
                icon={Save}
                onClick={(e) => handleSubmit(e)}
              >
                Update
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                icon={Save}
                onClick={(e) => handleSubmit(e)}
              >
                Save
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                icon={CheckCircle2}
                onClick={(e) => handleSubmit(e, 'Active')}
              >
                Publish
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Clean 2-Column Workspace */}
      <form onSubmit={handleSubmit} className="cf-shopify-workspace-grid">
        {/* LEFT COLUMN */}
        <div className="cf-shopify-main-col">
          {/* 1. Title & Short Description (Shown under Title & Price on Product Page) */}
          <Card>
            <Card.Body>
              <div className="cf-admin-form-stack">
                <Input
                  label="Title"
                  required
                  placeholder="e.g., Men's Sky Blue & White Micro-Check Shirt"
                  value={form.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  error={errors.title}
                />

                <Textarea
                  label="Short Description"
                  rows={2}
                  maxLength={140}
                  placeholder="Brief 1-2 line highlight shown right below the price on the Product Page..."
                  value={form.shortDescription}
                  onChange={(e) =>
                    updateField('shortDescription', e.target.value.slice(0, 140))
                  }
                  helperText={`Shown below price on product page • ${form.shortDescription.length} / 140 characters`}
                />
              </div>
            </Card.Body>
          </Card>

          {/* 2. Media */}
          <Card>
            <Card.Header
              title="Media"
              subtitle={`First tile is the cover image. 5:6 ratio • JPG, PNG, or WEBP up to ${MAX_MEDIA_FILE_MB}MB each (max ${MAX_MEDIA_IMAGES}).`}
              action={
                <span
                  className={`cf-shopify-tag-counter ${
                    isMediaLimitReached ? 'is-limit' : ''
                  }`}
                >
                  {form.galleryImages.length} / {MAX_MEDIA_IMAGES}
                </span>
              }
            />
            <Card.Body>
              <div className="cf-shopify-media-bento">
                <div className="cf-shopify-media-primary">
                  {form.imageUrl ? (
                    <>
                      <img
                        src={form.imageUrl}
                        alt="Primary product"
                        onError={(e) => {
                          e.currentTarget.src = FALLBACK_IMAGE;
                        }}
                      />
                      <span className="cf-shopify-cover-badge">Cover</span>
                      <button
                        type="button"
                        className="cf-shopify-media-del"
                        onClick={() => handleRemoveGalleryImage(form.imageUrl)}
                        title="Remove cover image"
                      >
                        <X size={13} />
                      </button>
                    </>
                  ) : (
                    <label className="cf-shopify-upload-dropzone is-primary">
                      <Upload size={20} />
                      <span>Upload Primary Image</span>
                      <input
                        type="file"
                        accept={STOREFRONT_IMAGE_ACCEPT}
                        multiple
                        className="cf-admin-hidden-file-input"
                        onChange={handleMultiFileUpload}
                      />
                    </label>
                  )}
                </div>

                <div className="cf-shopify-media-subgrid">
                  {extraImages.map((imgUrl, idx) => (
                    <div key={`${imgUrl.slice(0, 35)}-${idx}`} className="cf-shopify-media-tile">
                      <img
                        src={imgUrl}
                        alt={`Gallery ${idx + 1}`}
                        onError={(e) => {
                          e.currentTarget.src = FALLBACK_IMAGE;
                        }}
                      />
                      <div className="cf-shopify-tile-overlay">
                        <button
                          type="button"
                          className="cf-shopify-tile-cover-btn"
                          onClick={() => updateField('imageUrl', imgUrl)}
                        >
                          Set Cover
                        </button>
                        <button
                          type="button"
                          className="cf-shopify-media-del"
                          onClick={() => handleRemoveGalleryImage(imgUrl)}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {!isMediaLimitReached && (
                    <label className="cf-shopify-upload-dropzone">
                      <Plus size={18} />
                      <span>Add image</span>
                      <input
                        type="file"
                        accept={STOREFRONT_IMAGE_ACCEPT}
                        multiple
                        className="cf-admin-hidden-file-input"
                        onChange={handleMultiFileUpload}
                      />
                    </label>
                  )}
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* 3. Pricing — moved to right sidebar */}

          {/* 4. Variants (Sizes -> Nested Colors -> Qty) */}
          <Card className="cf-shopify-variants-card">
            <Card.Header
              title="Variants (Sizes → Colors & Stock)"
              subtitle="Select a size tab to manage its colors and stock quantities."
              action={
                <Badge variant="processing">
                  {activeSizes.length} Sizes • {activeColors.length} Colors • {totalVariantStock} Units
                </Badge>
              }
            />
            <Card.Body>
              {/* Clean Size Tabs & Adder Row */}
              <div className="cf-shopify-size-tabs-bar">
                <div className="cf-shopify-size-tabs">
                  {groupedBySize.map(({ size, sizeQty }) => {
                    const isDefault = activeDefaultSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        className={`cf-shopify-size-tab ${activeSizeKey === size ? 'is-active' : ''}`}
                        onClick={() => setSelectedSizeTab(size)}
                        title={isDefault ? `${size} (Default storefront size)` : size}
                      >
                        {isDefault && (
                          <span className="cf-shopify-tab-default-badge" aria-label="Default size">
                            <Star size={9} />
                          </span>
                        )}
                        <span>{size}</span>
                        <span className="cf-shopify-tab-qty">{sizeQty}</span>
                      </button>
                    );
                  })}

                  <div className="cf-shopify-size-adder-wrap" ref={sizePopoverRef}>
                    <button
                      type="button"
                      className={`cf-shopify-add-size-trigger ${sizePopoverOpen ? 'is-open' : ''}`}
                      onClick={() => setSizePopoverOpen((p) => !p)}
                    >
                      <Plus size={13} />
                      <span>Add Size</span>
                    </button>

                    {sizePopoverOpen && (
                      <div className="cf-shopify-size-popover">
                        <div className="cf-shopify-size-popover-head">
                          <span>Quick Sizes</span>
                          <small>Click to toggle</small>
                        </div>

                        <div className="cf-shopify-size-preset-grid">
                          {quickSizeOptions.map((sz) => {
                            const active = activeSizes.includes(sz);
                            return (
                              <button
                                key={sz}
                                type="button"
                                onClick={() => (active ? handleRemoveSize(sz) : handleAddSize(sz))}
                                className={`cf-admin-size-chip ${active ? 'is-selected' : ''}`}
                              >
                                {sz}
                              </button>
                            );
                          })}
                        </div>

                        <div className="cf-shopify-size-popover-divider">
                          <span>or custom size</span>
                        </div>

                        <div className="cf-shopify-size-popover-custom">
                          <input
                            type="text"
                            placeholder="e.g. 32, Free Size"
                            value={customSizeInput}
                            onChange={(e) => setCustomSizeInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddSize(customSizeInput);
                              }
                            }}
                            className="cf-ui-input cf-shopify-size-popover-input"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="primary"
                            onClick={() => handleAddSize(customSizeInput)}
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Nested Size -> Color Rows */}
              <div className="cf-shopify-size-groups" style={{ marginTop: '0.85rem' }}>
                {visibleSizeGroups.map(({ size, rows, sizeQty }) => {
                  const isPickerOpen = colorPickerSize === size;
                  return (
                    <div key={size} className="cf-shopify-size-group-card">
                      <div className="cf-shopify-size-group-head">
                        <div className="cf-shopify-size-group-title">
                          <span className="cf-admin-variant-size-pill">Size {size}</span>
                          <span className="cf-shopify-size-group-meta">
                            {rows.length} color(s) • <strong>{sizeQty} units</strong>
                          </span>
                        </div>

                        <div className="cf-shopify-size-group-actions">
                          {activeDefaultSize === size ? (
                            <span
                              className="cf-shopify-default-size-badge"
                              title="This size is shown selected by default on the product page"
                            >
                              <Star size={11} />
                              Default
                            </span>
                          ) : (
                            <button
                              type="button"
                              className="cf-shopify-set-default-btn"
                              onClick={() => updateField('defaultSize', size)}
                              title="Visitors will see this size selected by default on the product page"
                            >
                              <Star size={11} />
                              Set Default
                            </button>
                          )}
                          {activeSizes.length > 1 && (
                            <button
                              type="button"
                              className="cf-admin-gallery-remove-btn"
                              onClick={() => handleRemoveSize(size)}
                              title={`Delete size ${size}`}
                              aria-label={`Delete size ${size}`}
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="cf-shopify-variant-rows">
                        {rows.map((variant) => {
                          const qty = Number(variant.qty) || 0;
                          const vBadge =
                            qty <= 0
                              ? { label: 'Out', tone: 'failed' }
                              : qty <= Math.max(2, Math.floor(reorderNum / 2))
                                ? { label: 'Low', tone: 'warning' }
                                : { label: 'In Stock', tone: 'completed' };

                          return (
                            <div key={variant.key} className="cf-shopify-variant-row">
                              <div className="cf-shopify-variant-label">
                                <div className="cf-admin-variant-color-cell">
                                  <span
                                    className="cf-admin-color-chip-block"
                                    style={{ backgroundColor: variant.color }}
                                  />
                                  <span className="cf-admin-color-chip-text">
                                    <span className="cf-admin-color-chip-name">
                                      {getColorLabel(variant.color)}
                                    </span>
                                    <span className="cf-admin-color-chip-hex">
                                      {variant.color.toUpperCase()}
                                    </span>
                                  </span>
                                </div>
                              </div>

                              <div className="cf-shopify-variant-right">
                                <Badge dot size="sm" variant={vBadge.tone}>
                                  {vBadge.label}
                                </Badge>
                                <div className="cf-shopify-qty-field">
                                  <span>Qty</span>
                                  <input
                                    type="number"
                                    min={0}
                                    value={qty}
                                    onChange={(e) =>
                                      handleVariantQtyChange(variant.key, e.target.value)
                                    }
                                    className="cf-ui-input cf-admin-variant-qty-input"
                                  />
                                </div>
                                <button
                                  type="button"
                                  className="cf-admin-gallery-remove-btn"
                                  onClick={() => handleRemoveColorFromSize(size, variant.color)}
                                  title={`Delete ${getColorLabel(variant.color)}`}
                                  aria-label={`Delete ${getColorLabel(variant.color)}`}
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {isPickerOpen && (
                        <div className="cf-shopify-size-color-adder">
                          <div className="cf-admin-color-grid">
                            {PRESET_COLORS.map((c) => {
                              const hex = normalizeColorHex(c.hex);
                              const added = rows.some((r) => r.color === hex);
                              return (
                                <button
                                  key={hex}
                                  type="button"
                                  disabled={added}
                                  onClick={() => handleAddColorToSize(size, hex)}
                                  className={`cf-admin-color-chip ${added ? 'is-selected' : ''}`}
                                >
                                  <span
                                    className="cf-admin-color-chip-block"
                                    style={{ backgroundColor: hex }}
                                  />
                                  <span className="cf-admin-color-chip-text">
                                    <span className="cf-admin-color-chip-name">{c.name}</span>
                                    <span className="cf-admin-color-chip-hex">{hex.toUpperCase()}</span>
                                  </span>
                                </button>
                              );
                            })}

                            {customGridColors.map((hex) => {
                              const added = rows.some((r) => r.color === hex);
                              return (
                                <button
                                  key={hex}
                                  type="button"
                                  disabled={added}
                                  onClick={() => handleAddColorToSize(size, hex)}
                                  className={`cf-admin-color-chip ${added ? 'is-selected' : ''}`}
                                >
                                  <span
                                    className="cf-admin-color-chip-block"
                                    style={{ backgroundColor: hex }}
                                  />
                                  <span className="cf-admin-color-chip-text">
                                    <span className="cf-admin-color-chip-name">
                                      {getColorLabel(hex)}
                                    </span>
                                    <span className="cf-admin-color-chip-hex">{hex.toUpperCase()}</span>
                                  </span>
                                </button>
                              );
                            })}

                            {/* Custom Color Card (single mounted input so picker never jumps/closes while sliding) */}
                            <div
                              className={`cf-admin-color-chip cf-admin-custom-color-card ${
                                !customColorHex ? 'is-empty' : ''
                              }`}
                            >
                              <input
                                ref={customColorInputRef}
                                type="color"
                                value={customColorHex || '#1e3a8a'}
                                onChange={(e) => setCustomColorHex(e.target.value)}
                                className={`cf-admin-color-native-overlay ${
                                  customColorHex ? 'is-swatch-only' : ''
                                }`}
                                title={customColorHex ? 'Change custom color' : 'Pick a custom color'}
                              />
                              <span
                                className={`cf-admin-color-chip-block ${
                                  customColorHex
                                    ? 'cf-admin-custom-color-swatch'
                                    : 'cf-admin-custom-color-placeholder'
                                }`}
                                style={customColorHex ? { backgroundColor: customColorHex } : undefined}
                              >
                                {!customColorHex && <Plus size={13} />}
                              </span>
                              <span className="cf-admin-color-chip-text">
                                <span className="cf-admin-color-chip-name">Custom</span>
                                <span className="cf-admin-color-chip-hex">
                                  {customColorHex ? customColorHex.toUpperCase() : 'Pick color'}
                                </span>
                              </span>
                              {customColorHex && (
                                <button
                                  type="button"
                                  className="cf-admin-custom-color-plus"
                                  onClick={() => {
                                    handleAddColorToSize(size, customColorHex);
                                    setCustomColorHex('');
                                  }}
                                  title={`Add ${customColorHex.toUpperCase()}`}
                                >
                                  <Plus size={13} />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="cf-shopify-size-group-footer">
                        <button
                          type="button"
                          className={`cf-shopify-add-color-footer-btn ${isPickerOpen ? 'is-open' : ''}`}
                          onClick={() => setColorPickerSize(isPickerOpen ? null : size)}
                        >
                          {isPickerOpen ? (
                            <>
                              <CheckCircle2 size={14} />
                              <span>Done</span>
                            </>
                          ) : (
                            <>
                              <Plus size={14} />
                              <span>Add Color</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card.Body>
          </Card>

          {/* 5. Storefront Product Page Sections (Specs, Care, FAQs, Size Chart) */}
          <Card>
            <Card.Header
              title="Storefront Product Sections"
              subtitle="Directly powers Additional Details, Care Instructions & FAQs on the customer product page"
            />
            <div className="cf-shopify-section-tabs">
              <button
                type="button"
                className={`cf-shopify-section-tab ${detailTab === 'specs' ? 'is-active' : ''}`}
                onClick={() => setDetailTab('specs')}
              >
                <FileText size={14} /> Additional Details
              </button>
              <button
                type="button"
                className={`cf-shopify-section-tab ${detailTab === 'care' ? 'is-active' : ''}`}
                onClick={() => setDetailTab('care')}
              >
                <Sparkles size={14} /> Care Instructions ({form.careInstructions.length})
              </button>
              <button
                type="button"
                className={`cf-shopify-section-tab ${detailTab === 'faqs' ? 'is-active' : ''}`}
                onClick={() => setDetailTab('faqs')}
              >
                <HelpCircle size={14} /> FAQs ({form.faqs.length})
              </button>
            </div>
            <Card.Body>
              {detailTab === 'specs' && (
                <RichTextEditor
                  label="Description"
                  required
                  maxLength={2000}
                  value={form.description}
                  onChange={(html) => updateField('description', html)}
                  error={errors.description}
                  placeholder="Write detailed product description, fit notes, craftsmanship, and highlights..."
                />
              )}

              {detailTab === 'care' && (
                <AccordionPointList
                  items={form.careInstructions}
                  expandedIdx={expandedCareIdx}
                  onExpandChange={setExpandedCareIdx}
                  onAdd={() =>
                    handleAddPointItem(
                      'careInstructions',
                      MAX_CARE_POINTS,
                      'care instructions',
                      { title: '', description: '' },
                      setExpandedCareIdx
                    )
                  }
                  onUpdate={(idx, field, val) =>
                    handleUpdatePointItem('careInstructions', 'careError', idx, field, val)
                  }
                  onRemove={(idx) =>
                    handleRemovePointItem('careInstructions', 'careError', setExpandedCareIdx, idx)
                  }
                  titleKey="title"
                  descKey="description"
                  untitledLabel="Untitled instruction"
                  emptyDescLabel="Required - click to add details"
                  titlePlaceholder="Heading * (e.g., Washing, Dry Clean Only)"
                  descPlaceholder="Description * - Enter care & handling details..."
                  maxItems={MAX_CARE_POINTS}
                  maxTitleChars={MAX_CARE_HEADING_CHARS}
                  maxDescChars={MAX_CARE_DESC_CHARS}
                  addButtonLabel="Add a Point"
                  unitLabel="points"
                  error={errors.careError}
                />
              )}

              {detailTab === 'faqs' && (
                <AccordionPointList
                  items={form.faqs}
                  expandedIdx={expandedFaqIdx}
                  onExpandChange={setExpandedFaqIdx}
                  onAdd={() =>
                    handleAddPointItem('faqs', MAX_FAQS, 'FAQs', { q: '', a: '' }, setExpandedFaqIdx)
                  }
                  onUpdate={(idx, field, val) =>
                    handleUpdatePointItem('faqs', 'faqError', idx, field, val)
                  }
                  onRemove={(idx) =>
                    handleRemovePointItem('faqs', 'faqError', setExpandedFaqIdx, idx)
                  }
                  titleKey="q"
                  descKey="a"
                  untitledLabel="Untitled question"
                  emptyDescLabel="Required - click to add answer"
                  titlePlaceholder="Question * (e.g., How does the sizing run?)"
                  descPlaceholder="Answer * - Enter clear answer shown to shoppers..."
                  maxItems={MAX_FAQS}
                  maxTitleChars={MAX_FAQ_Q_CHARS}
                  maxDescChars={MAX_FAQ_A_CHARS}
                  addButtonLabel="Add FAQ Item"
                  unitLabel="FAQs"
                  error={errors.faqError}
                />
              )}
            </Card.Body>
          </Card>
        </div>

        {/* RIGHT SIDEBAR (Clean 3 Shopify Cards) */}
        <div className="cf-shopify-side-col">
          {/* 1. Status */}
          <Card>
            <Card.Header
              title="Status"
              action={
                <Badge dot variant={statusMeta.variant} size="sm">
                  {statusMeta.label}
                </Badge>
              }
            />
            <Card.Body>
              <div
                className="cf-shopify-status-list"
                role="radiogroup"
                aria-label="Product status"
              >
                {PRODUCT_STATUSES.map((s) => {
                  const isSelected = form.status === s.value;
                  const isOptionLocked = s.value === 'Draft' && isDraftLocked;
                  return (
                    <button
                      key={s.value}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      disabled={isOptionLocked}
                      title={
                        isOptionLocked
                          ? 'Published products cannot revert back to Draft'
                          : s.description
                      }
                      className={`cf-shopify-status-row ${isSelected ? 'is-selected' : ''} ${isOptionLocked ? 'is-disabled' : ''
                        }`}
                      onClick={() => handleRequestStatusChange(s.value)}
                    >
                      <span className="cf-shopify-status-radio" aria-hidden="true" />
                      <div className="cf-shopify-status-copy">
                        <div className="cf-shopify-status-title-row">
                          <span className="cf-shopify-status-name">
                            {s.label}
                            {isOptionLocked && (
                              <span className="cf-shopify-status-locked-tag">
                                <Lock size={10} /> Locked
                              </span>
                            )}
                          </span>
                          <span className={`cf-shopify-status-dot is-${s.variant}`} />
                        </div>
                        <span className="cf-shopify-status-desc">
                          {isOptionLocked
                            ? 'Cannot revert to Draft after product goes live'
                            : s.description}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card.Body>
          </Card>

          {/* 2. Pricing */}
          <Card>
            <Card.Header title="Pricing" />
            <Card.Body>
              <div className="cf-admin-form-stack">
                {/* Live Price Preview (appears as soon as MRP or Selling Price is entered) */}
                {(mrpNum > 0 || sellingNum > 0) && (
                  <div
                    className={`cf-sidebar-price-preview ${
                      isSellingExceedingMrp ? 'is-invalid' : ''
                    }`}
                  >
                    <span className="cf-sidebar-price-label">Preview</span>
                    <div className="cf-sidebar-price-display">
                      <span
                        className={`cf-sidebar-price-selling ${
                          isSellingExceedingMrp ? 'is-error' : ''
                        }`}
                      >
                        ₹{(sellingNum > 0 ? sellingNum : mrpNum).toLocaleString('en-IN')}
                      </span>

                      {sellingNum > 0 && mrpNum > 0 ? (
                        isSellingExceedingMrp ? (
                          <>
                            <span className="cf-sidebar-price-hint">
                              MRP ₹{mrpNum.toLocaleString('en-IN')}
                            </span>
                            <Badge variant="danger" size="sm">
                              Exceeds MRP
                            </Badge>
                          </>
                        ) : mrpNum > sellingNum ? (
                          <>
                            <span className="cf-sidebar-price-mrp">
                              ₹{mrpNum.toLocaleString('en-IN')}
                            </span>
                            <Badge variant="success" size="sm">
                              {discountPct}% OFF
                            </Badge>
                          </>
                        ) : (
                          <Badge variant="neutral" size="sm">
                            At MRP
                          </Badge>
                        )
                      ) : mrpNum > 0 ? (
                        <span className="cf-sidebar-price-hint">MRP • Enter selling price</span>
                      ) : (
                        <span className="cf-sidebar-price-hint">Add MRP below</span>
                      )}
                    </div>
                  </div>
                )}

                <Input
                  label="MRP (₹)"
                  type="number"
                  min={1}
                  required
                  placeholder="2499"
                  value={form.originalPrice}
                  onChange={(e) => updateField('originalPrice', e.target.value)}
                  error={errors.originalPrice}
                />
                <Input
                  label="Selling Price (₹)"
                  type="number"
                  min={1}
                  max={mrpNum > 0 ? mrpNum : undefined}
                  required
                  placeholder="1899"
                  value={form.price}
                  onChange={(e) => updateField('price', e.target.value)}
                  error={sellingPriceError}
                />
              </div>
            </Card.Body>
          </Card>

          {/* 3. Product Organization */}
          <Card>
            <Card.Header title="Product organization" />
            <Card.Body>
              <div className="cf-admin-form-stack">
                <Select
                  label="Catalog"
                  value={form.category}
                  onChange={(e) => updateField('category', e.target.value)}
                  options={Array.from(
                    new Set([
                      ...catalogs.map((c) => c.name),
                      ...(form.category ? [form.category] : []),
                    ])
                  ).map((catName) => ({ value: catName, label: catName }))}
                />

                <Select
                  label="Supplier"
                  value={form.supplier}
                  onChange={(e) => handleSupplierSelectChange(e.target.value)}
                  options={[
                    ...Array.from(
                      new Set([
                        ...suppliers.map((s) => s.name),
                        ...(form.supplier ? [form.supplier] : []),
                      ])
                    ).map((supName) => ({ value: supName, label: supName })),
                    { value: '__add_new__', label: '+ Add a new supplier' },
                  ]}
                />

                <div className="cf-ui-form-group">
                  <div className="cf-shopify-tag-header-row">
                    <label className="cf-ui-label">Tags</label>
                    <span
                      className={`cf-shopify-tag-counter ${totalTagChars >= MAX_PRODUCT_TAGS_CHARS ? 'is-limit' : ''
                        }`}
                    >
                      {totalTagChars} / {MAX_PRODUCT_TAGS_CHARS} chars
                    </span>
                  </div>
                  <input
                    type="text"
                    placeholder="Type comma-separated tags (e.g. cotton, summer, linen)"
                    value={tagInput}
                    onChange={handleTagInputChange}
                    onBlur={handleCommitTagInput}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleCommitTagInput();
                      }
                    }}
                    className="cf-ui-input"
                  />

                  {form.tags.length > 0 && (
                    <div className="cf-shopify-tags-wrap">
                      {form.tags.map((tag) => (
                        <span key={tag} className="cf-shopify-tag-pill">
                          <Tag size={11} />
                          <span>{tag}</span>
                          <button type="button" onClick={() => handleRemoveTag(tag)}>
                            <X size={11} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {catalogTagSuggestions.length > 0 && (
                    <div className="cf-shopify-tag-suggest-box">
                      <span className="cf-shopify-tag-suggest-label">
                        Suggested for {form.category} (click to add):
                      </span>
                      <div className="cf-shopify-tags-wrap" style={{ marginTop: '0.35rem' }}>
                        {catalogTagSuggestions.map((sug) => (
                          <button
                            key={sug}
                            type="button"
                            className="cf-shopify-tag-suggest-pill"
                            onClick={() => addTagsList([sug])}
                          >
                            <Plus size={11} />
                            <span>{sug}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card.Body>
          </Card>


        </div>
      </form>

      {/* Product Orders & Activity Timeline Modal */}
      {isEditMode && existingProduct && (
        <Modal
          isOpen={activityModalOpen}
          onClose={() => setActivityModalOpen(false)}
          icon={Clock}
          title={`${existingProduct.title} • Orders & Activity`}
          subtitle={`SKU ${existingProduct.sku} • ${existingProduct.orderCount || 0} orders • ${Number(existingProduct.rating || 0).toFixed(1)}★ (${existingProduct.reviewCount || 0} reviews)`}
          maxWidth="780px"
        >
          <div className="cf-admin-form-stack">
            <Card>
              <Card.Header title={`Recent Product Orders (${productOrders.length})`} />
              <Card.Body style={{ padding: 0 }}>
                <Table
                  className="is-embedded"
                  keyField="id"
                  data={productOrders.slice((ordersPage - 1) * 4, ordersPage * 4)}
                  columns={[
                    { key: 'id', label: 'Order ID', render: (v) => <Badge variant="mono">{v}</Badge> },
                    { key: 'customer', label: 'Customer' },
                    { key: 'variant', label: 'Variant' },
                    {
                      key: 'total',
                      label: 'Amount',
                      render: (v) => `₹${Number(v).toLocaleString('en-IN')}`,
                    },
                    {
                      key: 'status',
                      label: 'Status',
                      render: (v) => (
                        <Badge dot size="sm" variant={v === 'Delivered' ? 'completed' : 'processing'}>
                          {v}
                        </Badge>
                      ),
                    },
                  ]}
                  pagination={{
                    currentPage: ordersPage,
                    pageSize: 4,
                    totalItems: productOrders.length,
                    onPageChange: setOrdersPage,
                  }}
                />
              </Card.Body>
            </Card>

            <Card>
              <Card.Header title="Inventory & Audit Timeline" />
              <Card.Body>
                <ActivityTimeline
                  emptyText="No events recorded yet."
                  items={(existingProduct.activityLogs || []).map((a) => ({
                    id: a.id,
                    title: a.title,
                    description: a.detail,
                    timestamp: a.timestamp,
                    tone: a.type || 'account',
                  }))}
                />
              </Card.Body>
            </Card>
          </div>
        </Modal>
      )}
      {/* Add New Supplier Modal */}
      <Modal
        isOpen={supplierModalOpen}
        onClose={() => setSupplierModalOpen(false)}
        icon={Building2}
        title="Add New Supplier"
        subtitle="Save a supplier to your directory so it stays selectable for future products."
        maxWidth="480px"
      >
        <form onSubmit={handleSaveNewSupplier} className="cf-admin-form-stack">
          <Input
            label="Supplier Name"
            required
            placeholder="e.g., Como Linen Mills Pvt. Ltd."
            value={supplierForm.name}
            onChange={(e) => {
              setSupplierForm((p) => ({ ...p, name: e.target.value }));
              if (supplierErrors.name) setSupplierErrors((er) => ({ ...er, name: '' }));
            }}
            error={supplierErrors.name}
          />
          <Input
            label="Contact Number"
            required
            placeholder="e.g., +91 98204 55192"
            value={supplierForm.contact}
            onChange={(e) => {
              setSupplierForm((p) => ({ ...p, contact: e.target.value }));
              if (supplierErrors.contact) setSupplierErrors((er) => ({ ...er, contact: '' }));
            }}
            error={supplierErrors.contact}
          />
          <Textarea
            label="Supplier Address"
            required
            rows={3}
            placeholder="Plot / Street, Industrial Zone, City, State..."
            value={supplierForm.address}
            onChange={(e) => {
              setSupplierForm((p) => ({ ...p, address: e.target.value }));
              if (supplierErrors.address) setSupplierErrors((er) => ({ ...er, address: '' }));
            }}
            error={supplierErrors.address}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.25rem' }}>
            <Button type="button" variant="outline" onClick={() => setSupplierModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Supplier
            </Button>
          </div>
        </form>
      </Modal>

      {/* Status Transition Confirmation / Warning Modal */}
      {(() => {
        const modalMeta = statusConfirmModal
          ? getStatusModalMeta(statusConfirmModal.targetStatus)
          : null;
        return (
          <Modal
            isOpen={Boolean(statusConfirmModal)}
            onClose={() => setStatusConfirmModal(null)}
            icon={AlertTriangle}
            title={modalMeta?.title || ''}
            subtitle={modalMeta?.subtitle || ''}
            maxWidth="490px"
          >
            {modalMeta && (
              <div className="cf-admin-form-stack">
                <div className={`cf-shopify-status-warn-box is-${modalMeta.tone}`}>
                  <p className="cf-shopify-status-warn-main">{modalMeta.message}</p>
                  <p className="cf-shopify-status-warn-tip">{modalMeta.tip}</p>
                </div>

                <div className="cf-shopify-status-modal-actions">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setStatusConfirmModal(null)}
                  >
                    Cancel
                  </Button>
                  <div className="cf-shopify-status-modal-right">
                    {modalMeta.allowOutOfStockAlt && (
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={handleSwitchToOutOfStockInstead}
                      >
                        Set Qty to 0 (Out of Stock)
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant={modalMeta.confirmVariant}
                      size="sm"
                      onClick={handleConfirmStatusModal}
                    >
                      {modalMeta.confirmLabel}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Modal>
        );
      })()}
    </div>
  );
}
