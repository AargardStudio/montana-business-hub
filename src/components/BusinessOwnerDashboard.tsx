import React, { useState } from 'react';
import { useDirectory } from '../context/DirectoryContext';
import { getContextualWhatsAppUrl } from '../utils/helpers';
import { Business, ServiceItem, ProductItem, Lead, DayOfWeek, OfferItem } from '../types';
import {
  Building2,
  Phone,
  MessageCircle,
  FileText,
  Eye,
  CheckCircle2,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Mail,
  Clock,
  Sparkles,
  Award,
  Layers,
  ShoppingBag,
  Tag,
  DollarSign,
  Calendar,
  AlertCircle,
  ChevronDown,
  X,
  Save,
  Check,
  Percent,
} from 'lucide-react';

export const BusinessOwnerDashboard: React.FC = () => {
  const {
    businesses,
    updateBusinessProfile,
    addServiceToBusiness,
    updateServiceInBusiness,
    deleteServiceFromBusiness,
    addProductToBusiness,
    updateProductInBusiness,
    deleteProductFromBusiness,
    leads,
    updateLeadStatus,
    openBusinessProfile,
    activeVendorBusinessId,
    setActiveVendorBusinessId,
    offers,
    addOffer,
    deleteOffer,
    categories,
  } = useDirectory();

  // Selected vendor business
  const currentBusiness =
    businesses.find((b) => b.id === activeVendorBusinessId) ||
    businesses.find((b) => b.claimStatus === 'claimed') ||
    businesses[0];

  const businessId = currentBusiness?.id || 'b1';

  // Active sub-tab inside Vendor Dashboard
  const [activeTab, setActiveTab] = useState<
    'listing' | 'services' | 'products' | 'leads' | 'credentials' | 'deals'
  >('listing');

  // Feedback notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // --- LISTING FORM STATE ---
  const [editName, setEditName] = useState(currentBusiness.name);
  const [editTagline, setEditTagline] = useState(currentBusiness.tagline);
  const [editCategory, setEditCategory] = useState(currentBusiness.categoryId);
  const [editDesc, setEditDesc] = useState(currentBusiness.description);
  const [editStory, setEditStory] = useState(currentBusiness.fullStory || '');
  const [editAddress, setEditAddress] = useState(currentBusiness.location.address);
  const [editNeighborhood, setEditNeighborhood] = useState(currentBusiness.location.neighborhood);
  const [editPhone, setEditPhone] = useState(currentBusiness.contact.formattedPhone);
  const [editEmail, setEditEmail] = useState(currentBusiness.contact.email);
  const [editWebsite, setEditWebsite] = useState(currentBusiness.contact.website || '');
  const [editWhatsapp, setEditWhatsapp] = useState(currentBusiness.contact.whatsapp || '');
  const [editLogo, setEditLogo] = useState(currentBusiness.logoUrl);
  const [editCover, setEditCover] = useState(currentBusiness.coverUrl);
  const [editYears, setEditYears] = useState(currentBusiness.yearsInBusiness);
  const [editPriceRange, setEditPriceRange] = useState(currentBusiness.priceRange);
  const [editHours, setEditHours] = useState(currentBusiness.hours);

  // Sync state when active business changes
  const handleSelectBusiness = (id: string) => {
    setActiveVendorBusinessId(id);
    const target = businesses.find((b) => b.id === id);
    if (target) {
      setEditName(target.name);
      setEditTagline(target.tagline);
      setEditCategory(target.categoryId);
      setEditDesc(target.description);
      setEditStory(target.fullStory || '');
      setEditAddress(target.location.address);
      setEditNeighborhood(target.location.neighborhood);
      setEditPhone(target.contact.formattedPhone);
      setEditEmail(target.contact.email);
      setEditWebsite(target.contact.website || '');
      setEditWhatsapp(target.contact.whatsapp || '');
      setEditLogo(target.logoUrl);
      setEditCover(target.coverUrl);
      setEditYears(target.yearsInBusiness);
      setEditPriceRange(target.priceRange);
      setEditHours(target.hours);
    }
  };

  const handleSaveListing = (e: React.FormEvent) => {
    e.preventDefault();
    const cat = categories.find((c) => c.id === editCategory);
    updateBusinessProfile(businessId, {
      name: editName,
      tagline: editTagline,
      categoryId: editCategory,
      categoryName: cat?.name || currentBusiness.categoryName,
      description: editDesc,
      fullStory: editStory,
      location: {
        ...currentBusiness.location,
        address: editAddress,
        neighborhood: editNeighborhood,
      },
      contact: {
        ...currentBusiness.contact,
        formattedPhone: editPhone,
        phone: editPhone.replace(/\D/g, ''),
        email: editEmail,
        website: editWebsite,
        whatsapp: editWhatsapp,
      },
      logoUrl: editLogo,
      coverUrl: editCover,
      yearsInBusiness: Number(editYears) || currentBusiness.yearsInBusiness,
      priceRange: editPriceRange,
      hours: editHours,
    });
    showToast('Listing details updated and saved to directory!');
  };

  // --- SERVICES MODAL & STATE ---
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [srvName, setSrvName] = useState('');
  const [srvPrice, setSrvPrice] = useState('');
  const [srvPriceType, setSrvPriceType] = useState<ServiceItem['priceType']>('starting_at');
  const [srvPriceUnit, setSrvPriceUnit] = useState('project');
  const [srvDuration, setSrvDuration] = useState('');
  const [srvDesc, setSrvDesc] = useState('');
  const [srvPopular, setSrvPopular] = useState(false);

  const openAddServiceModal = () => {
    setEditingServiceId(null);
    setSrvName('');
    setSrvPrice('150');
    setSrvPriceType('starting_at');
    setSrvPriceUnit('project');
    setSrvDuration('1-3 days');
    setSrvDesc('');
    setSrvPopular(false);
    setServiceModalOpen(true);
  };

  const openEditServiceModal = (s: ServiceItem) => {
    setEditingServiceId(s.id);
    setSrvName(s.name);
    setSrvPrice(s.price?.toString() || '');
    setSrvPriceType(s.priceType || 'fixed');
    setSrvPriceUnit(s.priceUnit || 'project');
    setSrvDuration(s.duration || '');
    setSrvDesc(s.description);
    setSrvPopular(Boolean(s.popular));
    setServiceModalOpen(true);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!srvName.trim()) return;

    if (editingServiceId) {
      updateServiceInBusiness(businessId, editingServiceId, {
        name: srvName,
        price: srvPrice ? Number(srvPrice) : undefined,
        priceType: srvPriceType,
        priceUnit: srvPriceUnit,
        duration: srvDuration,
        description: srvDesc,
        popular: srvPopular,
      });
      showToast('Service updated successfully!');
    } else {
      const newService: ServiceItem = {
        id: 'srv-' + Date.now(),
        name: srvName,
        description: srvDesc || 'Available for booking in Bozeman and Gallatin County.',
        price: srvPrice ? Number(srvPrice) : undefined,
        priceType: srvPriceType,
        priceUnit: srvPriceUnit,
        duration: srvDuration,
        popular: srvPopular,
      };
      addServiceToBusiness(businessId, newService);
      showToast('New service published to your Digital Shop!');
    }
    setServiceModalOpen(false);
  };

  // --- PRODUCTS MODAL & STATE ---
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [prodAvailability, setProdAvailability] = useState<ProductItem['availability']>('in_stock');
  const [prodSku, setProdSku] = useState('');

  const openAddProductModal = () => {
    setEditingProductId(null);
    setProdName('');
    setProdPrice('45');
    setProdDesc('');
    setProdImage('https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80');
    setProdAvailability('in_stock');
    setProdSku('BZN-' + Math.floor(1000 + Math.random() * 9000));
    setProductModalOpen(true);
  };

  const openEditProductModal = (p: ProductItem) => {
    setEditingProductId(p.id);
    setProdName(p.name);
    setProdPrice(p.price !== undefined ? p.price.toString() : '');
    setProdDesc(p.description);
    setProdImage(p.imageUrl);
    setProdAvailability(p.availability);
    setProdSku(p.sku || '');
    setProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) return;

    if (editingProductId) {
      updateProductInBusiness(businessId, editingProductId, {
        name: prodName,
        price: Number(prodPrice) || 0,
        description: prodDesc,
        imageUrl: prodImage,
        availability: prodAvailability,
        sku: prodSku,
      });
      showToast('Product updated successfully!');
    } else {
      const newProd: ProductItem = {
        id: 'prod-' + Date.now(),
        name: prodName,
        priceType: 'fixed',
        price: Number(prodPrice) || 0,
        description: prodDesc || 'Local handcrafted product from Bozeman, MT.',
        imageUrl: prodImage || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
        availability: prodAvailability,
        sku: prodSku || 'BZN-101',
        tags: ['Local Goods', 'Bozeman Made'],
      };
      addProductToBusiness(businessId, newProd);
      showToast('Product added to your Digital Catalog!');
    }
    setProductModalOpen(false);
  };

  // --- DEALS / OFFERS STATE ---
  const [dealModalOpen, setDealModalOpen] = useState(false);
  const [dealTitle, setDealTitle] = useState('');
  const [dealTag, setDealTag] = useState('15% OFF');
  const [dealCode, setDealCode] = useState('LOCAL15');
  const [dealDesc, setDealDesc] = useState('');
  const [dealValid, setDealValid] = useState('End of month');

  const myDeals = offers.filter((o) => o.businessId === businessId);

  const handleAddDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dealTitle.trim()) return;
    const newOffer: OfferItem = {
      id: 'off-' + Date.now(),
      businessId,
      businessName: currentBusiness.name,
      title: dealTitle,
      discountTag: dealTag,
      description: dealDesc,
      code: dealCode,
      validUntil: dealValid,
    };
    addOffer(newOffer);
    setDealModalOpen(false);
    setDealTitle('');
    setDealDesc('');
    showToast('Promotional deal published for Bozeman shoppers!');
  };

  // Filter leads for this business
  const myLeads = leads.filter((l) => l.businessId === businessId);
  const [leadFilter, setLeadFilter] = useState<'all' | 'new' | 'contacted' | 'in_progress' | 'closed'>('all');
  const filteredLeads = myLeads.filter((l) => (leadFilter === 'all' ? true : l.status === leadFilter));

  // Completeness score
  const getCompleteness = () => {
    let score = 30;
    if (currentBusiness.contact.whatsapp) score += 15;
    if (currentBusiness.services && currentBusiness.services.length > 0) score += 20;
    if (currentBusiness.products && currentBusiness.products.length > 0) score += 15;
    if (currentBusiness.credentials && currentBusiness.credentials.length > 0) score += 10;
    if (currentBusiness.fullStory) score += 10;
    return Math.min(score, 100);
  };
  const completeness = getCompleteness();

  const DAYS: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const NEIGHBORHOODS = [
    'Cannery District',
    'Downtown Bozeman',
    'Midtown',
    'South Bozeman',
    'North 7th',
    'Gallatin Gateway',
    'Four Corners',
    'Belgrade',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-stone-900 text-amber-400 border border-amber-500/40 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <CheckCircle2 size={18} className="text-emerald-400" />
          <span className="text-xs font-semibold text-white">{toastMessage}</span>
        </div>
      )}

      {/* Top Header Banner with Business Switcher */}
      <div className="bg-stone-900 rounded-3xl p-6 sm:p-8 text-white mb-8 border border-stone-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentBusiness.logoUrl}
            alt={currentBusiness.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-500/50 bg-stone-800 shrink-0"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded">
                Vendor Control Dashboard
              </span>
              <span className="text-xs text-stone-400">ID: {currentBusiness.id}</span>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                  currentBusiness.claimStatus === 'claimed'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-stone-700 text-stone-300'
                }`}
              >
                {currentBusiness.claimStatus}
              </span>
            </div>

            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {currentBusiness.name}
            </h1>
            <p className="text-stone-400 text-xs sm:text-sm mt-0.5">
              {currentBusiness.categoryName} • {currentBusiness.location.neighborhood}, Bozeman MT
            </p>
          </div>
        </div>

        {/* Action Controls & Business Switcher */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
          {/* Quick Business Switcher Dropdown */}
          <div className="relative w-full sm:w-auto">
            <label className="block text-[10px] text-stone-400 uppercase font-bold tracking-wider mb-1">
              Switch Managed Business:
            </label>
            <div className="relative">
              <select
                value={businessId}
                onChange={(e) => handleSelectBusiness(e.target.value)}
                aria-label="Switch Managed Business"
                className="w-full sm:w-64 appearance-none bg-stone-800 border border-stone-700 text-stone-200 text-xs font-semibold py-2 pl-3 pr-8 rounded-xl focus:outline-hidden focus:border-amber-500 cursor-pointer"
              >
                {businesses.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.location.neighborhood})
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 sm:pt-4">
            <button
              onClick={() => openBusinessProfile(currentBusiness.id)}
              className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
            >
              <Eye size={14} />
              <span>Preview Live Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Profile Completeness & Quick Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-amber-600" />
              <span className="font-heading font-bold text-sm text-stone-900">
                Digital Shop & Listing Health
              </span>
            </div>
            <span className="text-xs font-extrabold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              {completeness}% Score
            </span>
          </div>

          <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${completeness}%` }}
            />
          </div>

          <p className="text-xs text-stone-500">
            {completeness === 100
              ? 'Excellent! Your listing and digital shop are fully populated with active services and direct WhatsApp channels.'
              : 'Tip: Add products, describe your artisanal story, or add operating hours to maximize customer trust and quote requests.'}
          </p>
        </div>

        {/* Quick KPI stats */}
        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span>Direct Inquiries</span>
            <MessageCircle size={15} className="text-amber-600" />
          </div>
          <div className="mt-2">
            <span className="font-heading font-extrabold text-2xl text-stone-900 block">
              {myLeads.length}
            </span>
            <span className="text-[11px] text-emerald-700 font-medium">
              {myLeads.filter((l) => l.status === 'new').length} pending review
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span>Shop Catalog Items</span>
            <ShoppingBag size={15} className="text-amber-600" />
          </div>
          <div className="mt-2">
            <span className="font-heading font-extrabold text-2xl text-stone-900 block">
              {(currentBusiness.services?.length || 0) + (currentBusiness.products?.length || 0)}
            </span>
            <span className="text-[11px] text-stone-500">
              {currentBusiness.services?.length || 0} services • {currentBusiness.products?.length || 0} products
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center overflow-x-auto gap-2 border-b border-stone-200 pb-2 mb-8 text-xs font-bold scrollbar-none">
        <button
          onClick={() => setActiveTab('listing')}
          className={`px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === 'listing'
              ? 'bg-stone-900 text-amber-400 shadow-xs'
              : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
          }`}
        >
          <Building2 size={14} />
          <span>Control Listing & Branding</span>
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === 'services'
              ? 'bg-stone-900 text-amber-400 shadow-xs'
              : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
          }`}
        >
          <Layers size={14} />
          <span>Digital Shop: Services ({currentBusiness.services?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === 'products'
              ? 'bg-stone-900 text-amber-400 shadow-xs'
              : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
          }`}
        >
          <ShoppingBag size={14} />
          <span>Digital Shop: Products ({currentBusiness.products?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('leads')}
          className={`px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === 'leads'
              ? 'bg-stone-900 text-amber-400 shadow-xs'
              : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
          }`}
        >
          <FileText size={14} />
          <span>Customer Leads & Inquiries ({myLeads.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('deals')}
          className={`px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === 'deals'
              ? 'bg-stone-900 text-amber-400 shadow-xs'
              : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
          }`}
        >
          <Percent size={14} />
          <span>Local Deals & Promo Codes ({myDeals.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('credentials')}
          className={`px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === 'credentials'
              ? 'bg-stone-900 text-amber-400 shadow-xs'
              : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
          }`}
        >
          <ShieldCheck size={14} />
          <span>Trust & Verified Credentials</span>
        </button>
      </div>

      {/* --- TAB 1: CONTROL LISTING DETAILS --- */}
      {activeTab === 'listing' && (
        <form onSubmit={handleSaveListing} className="space-y-8">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-6">
              <div>
                <h3 className="font-heading font-bold text-lg text-stone-900">
                  Business Information & Identity
                </h3>
                <p className="text-xs text-stone-500">
                  Manage how your business appears across Bozeman search, categories, and map views.
                </p>
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
              >
                <Save size={14} />
                <span>Save Listing Changes</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Primary Category *
                </label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-amber-500"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Tagline / Catchphrase *
                </label>
                <input
                  type="text"
                  required
                  value={editTagline}
                  onChange={(e) => setEditTagline(e.target.value)}
                  placeholder="e.g. Handcrafted timber tables & custom cabinetry in the Cannery District"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Short About Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Mountain Heritage / Artisan Story (Extended Bio)
                </label>
                <textarea
                  rows={4}
                  value={editStory}
                  onChange={(e) => setEditStory(e.target.value)}
                  placeholder="Describe your founding story, woodworking roots, sourcing from Montana mills, etc."
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Location & Contact Section */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
            <h3 className="font-heading font-bold text-lg text-stone-900 mb-1">
              Location, Contact Channels & WhatsApp
            </h3>
            <p className="text-xs text-stone-500 mb-6">
              Empower Bozeman locals to call, visit, or chat directly with zero platform intermediaries.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Bozeman Neighborhood *
                </label>
                <select
                  value={editNeighborhood}
                  onChange={(e) => setEditNeighborhood(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-amber-500"
                >
                  {NEIGHBORHOODS.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  placeholder="e.g. 424 E Main St"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Official Phone *
                </label>
                <input
                  type="text"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="(406) 555-0192"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="hello@business.com"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Direct WhatsApp Line (Instant Leads)
                </label>
                <input
                  type="text"
                  value={editWhatsapp}
                  onChange={(e) => setEditWhatsapp(e.target.value)}
                  placeholder="+14065550192"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Website URL
                </label>
                <input
                  type="text"
                  value={editWebsite}
                  onChange={(e) => setEditWebsite(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Years Operating in Bozeman
                </label>
                <input
                  type="number"
                  value={editYears}
                  onChange={(e) => setEditYears(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Price Tier
                </label>
                <select
                  value={editPriceRange}
                  onChange={(e) => setEditPriceRange(e.target.value as any)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-amber-500"
                >
                  <option value="$">$ (Budget / Accessible)</option>
                  <option value="$$">$$ (Moderate / Standard)</option>
                  <option value="$$$">$$$ (Premium / High-End)</option>
                  <option value="$$$$">$$$$ (Luxury / Architectural)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Operating Hours Table */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
            <h3 className="font-heading font-bold text-lg text-stone-900 mb-1">
              Weekly Operating Hours
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Keep your opening hours current to ensure accurate "Open Now" badges in directory search.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {DAYS.map((day) => {
                const h = editHours[day] || { open: '08:00', close: '17:00', closed: false };
                return (
                  <div key={day} className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="capitalize font-bold text-stone-800">{day}</span>
                      <label className="inline-flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={h.closed}
                          onChange={(e) => {
                            setEditHours({
                              ...editHours,
                              [day]: { ...h, closed: e.target.checked },
                            });
                          }}
                          className="rounded text-amber-500"
                        />
                        <span className="text-[10px] text-stone-500">Closed</span>
                      </label>
                    </div>

                    {!h.closed ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={h.open}
                          onChange={(e) => {
                            setEditHours({
                              ...editHours,
                              [day]: { ...h, open: e.target.value },
                            });
                          }}
                          className="w-full bg-white border border-stone-300 rounded p-1 text-center text-xs"
                        />
                        <span className="text-stone-400">-</span>
                        <input
                          type="text"
                          value={h.close}
                          onChange={(e) => {
                            setEditHours({
                              ...editHours,
                              [day]: { ...h, close: e.target.value },
                            });
                          }}
                          className="w-full bg-white border border-stone-300 rounded p-1 text-center text-xs"
                        />
                      </div>
                    ) : (
                      <div className="py-1 text-center text-stone-400 font-medium italic text-[11px]">
                        Closed all day
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Visual Assets & Branding */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
            <h3 className="font-heading font-bold text-lg text-stone-900 mb-1">
              Visual Branding & Media
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              High-resolution imagery increases inquiry rates by over 40% across Gallatin County.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Logo Image URL</label>
                <input
                  type="text"
                  value={editLogo}
                  onChange={(e) => setEditLogo(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 mb-2"
                />
                <div className="flex items-center gap-3">
                  <img src={editLogo} alt="Logo preview" className="w-12 h-12 rounded-xl object-cover border border-stone-200" />
                  <span className="text-xs text-stone-400">Preview logo badge</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Cover Banner URL</label>
                <input
                  type="text"
                  value={editCover}
                  onChange={(e) => setEditCover(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 mb-2"
                />
                <div className="h-12 w-full rounded-xl overflow-hidden border border-stone-200 bg-stone-100">
                  <img src={editCover} alt="Cover preview" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-6 py-2.5 rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
              >
                <Save size={14} />
                <span>Save All Listing Changes</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* --- TAB 2: DIGITAL SHOP - SERVICES --- */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <div>
              <h3 className="font-heading font-bold text-base text-stone-900">
                Services Catalog & Quote Configurator
              </h3>
              <p className="text-xs text-stone-500">
                List your bookable services. Shoppers can request tailored quotes or book consultations directly.
              </p>
            </div>
            <button
              onClick={openAddServiceModal}
              className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer shrink-0"
            >
              <Plus size={15} />
              <span>+ Add New Service</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentBusiness.services && currentBusiness.services.length > 0 ? (
              currentBusiness.services.map((s) => (
                <div
                  key={s.id}
                  className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between hover:border-amber-400 transition-colors"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-heading font-bold text-sm text-stone-900">{s.name}</h4>
                          {s.popular && (
                            <span className="bg-amber-500/15 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              Popular
                            </span>
                          )}
                        </div>
                        {s.duration && (
                          <span className="text-[11px] text-stone-400 flex items-center gap-1 mt-0.5">
                            <Clock size={11} />
                            <span>Estimated: {s.duration}</span>
                          </span>
                        )}
                      </div>

                      <div className="text-right">
                        <span className="font-heading font-extrabold text-stone-900 text-base">
                          {s.price ? `$${s.price}` : 'Quote Only'}
                        </span>
                        {s.priceType && s.priceType !== 'fixed' && (
                          <span className="block text-[10px] text-stone-500 capitalize">
                            {s.priceType.replace('_', ' ')}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-stone-600 mb-4 line-clamp-2">{s.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                    <span className="text-[11px] text-stone-400 font-mono">ID: {s.id}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditServiceModal(s)}
                        className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                        title="Edit Service"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Remove "${s.name}" from your digital shop?`)) {
                            deleteServiceFromBusiness(businessId, s.id);
                            showToast('Service removed.');
                          }
                        }}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Service"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 bg-stone-50 border-2 border-dashed border-stone-300 rounded-2xl p-12 text-center">
                <Layers size={36} className="mx-auto text-stone-400 mb-3" />
                <h4 className="font-heading font-bold text-stone-700 text-base">No services listed yet</h4>
                <p className="text-xs text-stone-500 max-w-md mx-auto mt-1 mb-4">
                  Add consulting, custom fabrication, maintenance, or repair services to allow customers to request direct quotes.
                </p>
                <button
                  onClick={openAddServiceModal}
                  className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors"
                >
                  + Add Your First Service
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- TAB 3: DIGITAL SHOP - PRODUCTS --- */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <div>
              <h3 className="font-heading font-bold text-base text-stone-900">
                Products & Inventory Catalog
              </h3>
              <p className="text-xs text-stone-500">
                Handcrafted wares, outdoor gear, artisanal provisions, and retail goods sold locally with direct WhatsApp reservation.
              </p>
            </div>
            <button
              onClick={openAddProductModal}
              className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer shrink-0"
            >
              <Plus size={15} />
              <span>+ Add New Product</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentBusiness.products && currentBusiness.products.length > 0 ? (
              currentBusiness.products.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs flex flex-col justify-between hover:border-amber-400 transition-colors"
                >
                  <div>
                    <div className="h-44 w-full bg-stone-100 relative overflow-hidden">
                      <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wider ${
                            p.availability === 'in_stock'
                              ? 'bg-emerald-600 text-white'
                              : p.availability === 'made_to_order'
                              ? 'bg-amber-600 text-white'
                              : p.availability === 'limited'
                              ? 'bg-orange-600 text-white'
                              : 'bg-stone-700 text-white'
                          }`}
                        >
                          {p.availability.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-heading font-bold text-sm text-stone-900 line-clamp-1">{p.name}</h4>
                        <span className="font-heading font-extrabold text-amber-800 text-base shrink-0">
                          ${p.price}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 line-clamp-2 mb-2">{p.description}</p>
                      {p.sku && <span className="text-[10px] text-stone-400 font-mono">SKU: {p.sku}</span>}
                    </div>
                  </div>

                  <div className="p-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                    {/* Quick Stock toggle */}
                    <select
                      value={p.availability}
                      onChange={(e) => {
                        updateProductInBusiness(businessId, p.id, {
                          availability: e.target.value as any,
                        });
                        showToast(`Updated stock status for ${p.name}`);
                      }}
                      className="text-[11px] bg-white border border-stone-300 rounded-lg px-2 py-1 text-stone-700 cursor-pointer"
                    >
                      <option value="in_stock">In Stock</option>
                      <option value="limited">Limited Run</option>
                      <option value="made_to_order">Made to Order</option>
                      <option value="out_of_stock">Out of Stock</option>
                    </select>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEditProductModal(p)}
                        className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
                        title="Edit Product"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete product "${p.name}"?`)) {
                            deleteProductFromBusiness(businessId, p.id);
                            showToast('Product deleted.');
                          }
                        }}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Product"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 bg-stone-50 border-2 border-dashed border-stone-300 rounded-2xl p-12 text-center">
                <ShoppingBag size={36} className="mx-auto text-stone-400 mb-3" />
                <h4 className="font-heading font-bold text-stone-700 text-base">No products in your digital shop</h4>
                <p className="text-xs text-stone-500 max-w-md mx-auto mt-1 mb-4">
                  Showcase your handcrafted goods, merchandise, or packaged specialties. Customers can order or reserve with 1 click via WhatsApp.
                </p>
                <button
                  onClick={openAddProductModal}
                  className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors"
                >
                  + Add Your First Product
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- TAB 4: INBOUND LEADS & INQUIRIES --- */}
      {activeTab === 'leads' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <div>
              <h3 className="font-heading font-bold text-base text-stone-900">
                Inbound Leads & WhatsApp Inquiry Inbox
              </h3>
              <p className="text-xs text-stone-500">
                Direct quotes and messages from Bozeman customers with direct WhatsApp response links.
              </p>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl text-xs font-semibold">
              {(['all', 'new', 'contacted', 'in_progress', 'closed'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setLeadFilter(st)}
                  className={`px-3 py-1 rounded-lg capitalize transition-colors ${
                    leadFilter === st ? 'bg-white text-stone-950 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredLeads.length > 0 ? (
              filteredLeads.map((lead) => {
                const whatsappReplyUrl = lead.customerPhone
                  ? `https://wa.me/${lead.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                      `Hi ${lead.customerName}, this is ${currentBusiness.name} in Bozeman responding to your inquiry regarding ${lead.serviceOrProduct || 'our services'}.`
                    )}`
                  : null;

                return (
                  <div
                    key={lead.id}
                    className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 hover:border-amber-400 transition-colors"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            lead.type === 'quote'
                              ? 'bg-purple-100 text-purple-800'
                              : lead.type === 'booking'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {lead.type}
                        </span>
                        <span className="font-heading font-bold text-sm text-stone-900">{lead.customerName}</span>
                        <span className="text-xs text-stone-400 font-mono">
                          • {new Date(lead.createdAt).toLocaleDateString()} at {new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {lead.serviceOrProduct && (
                        <p className="text-xs font-semibold text-amber-800">
                          Item: {lead.serviceOrProduct} {lead.budget && `• Budget: ${lead.budget}`}
                        </p>
                      )}

                      <p className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                        "{lead.message || lead.notes || 'Inquiry submitted through Bozeman Business Hub'}"
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 pt-1">
                        {lead.customerPhone && (
                          <span className="flex items-center gap-1">
                            <Phone size={12} className="text-stone-400" />
                            <span>{lead.customerPhone}</span>
                          </span>
                        )}
                        {lead.customerEmail && (
                          <span className="flex items-center gap-1">
                            <Mail size={12} className="text-stone-400" />
                            <span>{lead.customerEmail}</span>
                          </span>
                        )}
                        {lead.preferredDate && (
                          <span className="flex items-center gap-1">
                            <Calendar size={12} className="text-stone-400" />
                            <span>Prefers: {lead.preferredDate}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions & Status */}
                    <div className="flex flex-col sm:flex-row lg:flex-col items-end gap-2 shrink-0 w-full lg:w-auto pt-3 lg:pt-0 border-t lg:border-t-0 border-stone-100">
                      <div className="flex items-center gap-2">
                        <label className="text-[11px] text-stone-500 font-medium">Status:</label>
                        <select
                          value={lead.status}
                          onChange={(e) => {
                            updateLeadStatus(lead.id, e.target.value as any);
                            showToast(`Lead marked as ${e.target.value}`);
                          }}
                          className="text-xs font-bold bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-1 text-stone-800"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="in_progress">In Progress</option>
                          <option value="closed">Closed / Won</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        {whatsappReplyUrl && (
                          <a
                            href={whatsappReplyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition-colors"
                          >
                            <MessageCircle size={13} />
                            <span>Reply via WhatsApp</span>
                          </a>
                        )}

                        {lead.customerEmail && (
                          <a
                            href={`mailto:${lead.customerEmail}?subject=${encodeURIComponent(`Bozeman Business Hub Inquiry - ${currentBusiness.name}`)}`}
                            className="inline-flex items-center gap-1 bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition-colors"
                          >
                            <Mail size={13} />
                            <span>Email</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-stone-50 border-2 border-dashed border-stone-300 rounded-2xl p-12 text-center">
                <FileText size={36} className="mx-auto text-stone-400 mb-3" />
                <h4 className="font-heading font-bold text-stone-700 text-base">No leads in this view</h4>
                <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
                  Customer quote requests and direct messages submitted on your profile or services catalog appear here in real time.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- TAB 5: LOCAL DEALS & PROMOTIONS --- */}
      {activeTab === 'deals' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <div>
              <h3 className="font-heading font-bold text-base text-stone-900">
                Special Offers, Local Coupons & Discounts
              </h3>
              <p className="text-xs text-stone-500">
                Create promotional discount codes featured on the Bozeman Community Deals page to drive foot traffic.
              </p>
            </div>
            <button
              onClick={() => setDealModalOpen(true)}
              className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer shrink-0"
            >
              <Plus size={15} />
              <span>+ Create Special Offer</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myDeals.length > 0 ? (
              myDeals.map((d) => (
                <div key={d.id} className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-amber-500/20 text-amber-900 border border-amber-500/30 text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                        {d.discountTag}
                      </span>
                      <span className="text-xs text-stone-400">Valid: {d.validUntil}</span>
                    </div>
                    <h4 className="font-heading font-bold text-stone-900 text-base mb-1">{d.title}</h4>
                    <p className="text-xs text-stone-600 mb-3">{d.description}</p>
                    {d.code && (
                      <div className="inline-flex items-center gap-1.5 bg-stone-100 border border-dashed border-stone-300 px-3 py-1 rounded-lg text-xs font-mono font-bold text-stone-800">
                        <span>Code:</span>
                        <span className="text-amber-700">{d.code}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 mt-3 border-t border-stone-100 flex justify-end">
                    <button
                      onClick={() => {
                        if (confirm('Delete this deal?')) {
                          deleteOffer(d.id);
                          showToast('Deal removed.');
                        }
                      }}
                      className="text-red-500 hover:text-red-700 text-xs font-bold inline-flex items-center gap-1"
                    >
                      <Trash2 size={13} />
                      <span>Remove Deal</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 bg-stone-50 border-2 border-dashed border-stone-300 rounded-2xl p-12 text-center">
                <Percent size={36} className="mx-auto text-stone-400 mb-3" />
                <h4 className="font-heading font-bold text-stone-700 text-base">No active offers or coupons</h4>
                <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-4">
                  Boost your customer acquisition by offering 10% off for first-time Bozeman residents or seasonal discounts.
                </p>
                <button
                  onClick={() => setDealModalOpen(true)}
                  className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors"
                >
                  + Create Your First Offer
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- TAB 6: TRUST CREDENTIALS & VERIFICATION --- */}
      {activeTab === 'credentials' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-4">
              <div>
                <h3 className="font-heading font-bold text-base text-stone-900">
                  Trust Badges & Montana License Verification
                </h3>
                <p className="text-xs text-stone-500">
                  Credentialed businesses receive the green verified shield and top placement in search results.
                </p>
              </div>
              <span className="text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider">
                Current Tier: {currentBusiness.verificationTier.replace('_', ' ')}
              </span>
            </div>

            <div className="space-y-3">
              {currentBusiness.credentials && currentBusiness.credentials.length > 0 ? (
                currentBusiness.credentials.map((c) => (
                  <div key={c.id} className="p-4 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <CheckCircle2 size={18} />
                      </div>
                      <div>
                        <h4 className="font-bold text-stone-900 text-xs">{c.title}</h4>
                        <p className="text-[11px] text-stone-500">
                          {c.issuer} {c.credentialNumber && `• ID: ${c.credentialNumber}`} {c.expirationDate && `• Exp: ${c.expirationDate}`}
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Verified by Platform
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-stone-500 italic py-2">No official documents uploaded yet.</p>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100 bg-amber-50/50 p-4 rounded-xl border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <h4 className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
                  <ShieldCheck size={15} className="text-amber-700" />
                  <span>Request Credential Audit from Master Admin</span>
                </h4>
                <p className="text-[11px] text-stone-600">
                  Submit your Montana contractor registration or business liability insurance for official badge verification.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  showToast('Verification audit request submitted to Master Platform Admins!');
                }}
                className="bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold px-4 py-2 rounded-xl text-xs transition-colors shrink-0"
              >
                Submit for Audit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- SERVICE MODAL --- */}
      {serviceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <h3 className="font-heading font-bold text-lg text-stone-900">
                {editingServiceId ? 'Edit Service' : 'Add New Service to Shop'}
              </h3>
              <button
                onClick={() => setServiceModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">Service Title *</label>
                <input
                  type="text"
                  required
                  value={srvName}
                  onChange={(e) => setSrvName(e.target.value)}
                  placeholder="e.g. Custom Dining Table Fabrication"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Price ($)</label>
                  <input
                    type="number"
                    value={srvPrice}
                    onChange={(e) => setSrvPrice(e.target.value)}
                    placeholder="150"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Pricing Structure</label>
                  <select
                    value={srvPriceType}
                    onChange={(e) => setSrvPriceType(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="starting_at">Starting At</option>
                    <option value="fixed">Fixed Price</option>
                    <option value="hourly">Hourly Rate</option>
                    <option value="quote">Custom Quote Only</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Unit</label>
                  <input
                    type="text"
                    value={srvPriceUnit}
                    onChange={(e) => setSrvPriceUnit(e.target.value)}
                    placeholder="project, hour, session"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Estimated Turnaround</label>
                  <input
                    type="text"
                    value={srvDuration}
                    onChange={(e) => setSrvDuration(e.target.value)}
                    placeholder="e.g. 1-2 weeks, 90 mins"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  value={srvDesc}
                  onChange={(e) => setSrvDesc(e.target.value)}
                  placeholder="Detail what is included, materials used, or client preparation..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="srvPop"
                  checked={srvPopular}
                  onChange={(e) => setSrvPopular(e.target.checked)}
                  className="rounded text-amber-500"
                />
                <label htmlFor="srvPop" className="font-semibold text-stone-700">
                  Feature as "Popular Service" in Digital Catalog
                </label>
              </div>

              <div className="pt-4 border-t border-stone-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setServiceModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- PRODUCT MODAL --- */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <h3 className="font-heading font-bold text-lg text-stone-900">
                {editingProductId ? 'Edit Product' : 'Add New Product to Digital Shop'}
              </h3>
              <button
                onClick={() => setProductModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="e.g. Handcrafted Walnut Cutting Board"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Price ($) *</label>
                  <input
                    type="number"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    placeholder="85"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Availability Status</label>
                  <select
                    value={prodAvailability}
                    onChange={(e) => setProdAvailability(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="in_stock">In Stock</option>
                    <option value="low_stock">Low Stock</option>
                    <option value="made_to_order">Made to Order</option>
                    <option value="pre_order">Pre-Order</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">Image URL</label>
                <input
                  type="text"
                  value={prodImage}
                  onChange={(e) => setProdImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">SKU / Product Code</label>
                <input
                  type="text"
                  value={prodSku}
                  onChange={(e) => setProdSku(e.target.value)}
                  placeholder="e.g. BZN-WOOD-01"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  placeholder="Artisan materials, dimensions, local Bozeman pickup details..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="pt-4 border-t border-stone-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- DEALS MODAL --- */}
      {dealModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <h3 className="font-heading font-bold text-lg text-stone-900">Create Special Deal</h3>
              <button
                onClick={() => setDealModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddDeal} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">Offer Headline *</label>
                <input
                  type="text"
                  required
                  value={dealTitle}
                  onChange={(e) => setDealTitle(e.target.value)}
                  placeholder="e.g. 15% Off Handcrafted Cutting Boards"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Discount Tag *</label>
                  <input
                    type="text"
                    required
                    value={dealTag}
                    onChange={(e) => setDealTag(e.target.value)}
                    placeholder="15% OFF, $20 OFF"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Promo Code</label>
                  <input
                    type="text"
                    value={dealCode}
                    onChange={(e) => setDealCode(e.target.value)}
                    placeholder="BOZEMAN15"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">Valid Until</label>
                <input
                  type="text"
                  value={dealValid}
                  onChange={(e) => setDealValid(e.target.value)}
                  placeholder="e.g. Next Sunday, End of October"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">Terms & Details</label>
                <textarea
                  rows={2}
                  value={dealDesc}
                  onChange={(e) => setDealDesc(e.target.value)}
                  placeholder="Valid for in-store pickup or local delivery..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="pt-4 border-t border-stone-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDealModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl"
                >
                  Publish Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
