import React, { useState } from 'react';
import { useDirectory } from '../context/DirectoryContext';
import { TrustBadge } from './TrustBadge';
import {
  VerificationTier,
  Business,
  ServiceItem,
  ProductItem,
  Lead,
  EventItem,
  OfferItem,
  Category,
  DayOfWeek,
} from '../types';
import {
  ShieldCheck,
  Building2,
  Users,
  Search,
  CheckCircle,
  Star,
  Layers,
  FileText,
  MessageCircle,
  ShoppingBag,
  Plus,
  Edit,
  Trash2,
  Tag,
  ExternalLink,
  Calendar,
  Percent,
  Sliders,
  Bell,
  Activity,
  DollarSign,
  X,
  Save,
  Clock,
  ArrowUpDown,
  Download,
  Check,
  AlertTriangle,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    businesses,
    setBusinesses,
    addBusiness,
    deleteBusiness,
    updateBusinessProfile,
    categories,
    addCategory,
    deleteCategory,
    events,
    addEvent,
    deleteEvent,
    offers,
    addOffer,
    deleteOffer,
    leads,
    updateLeadStatus,
    deleteLead,
    addServiceToBusiness,
    updateServiceInBusiness,
    deleteServiceFromBusiness,
    addProductToBusiness,
    updateProductInBusiness,
    deleteProductFromBusiness,
    announcement,
    setAnnouncement,
    adminLogs,
    addAdminLog,
    openBusinessProfile,
    openDownloadModal,
  } = useDirectory();

  // Active Master Tab
  const [masterTab, setMasterTab] = useState<
    'businesses' | 'digital_shops' | 'leads' | 'events_deals' | 'categories' | 'logs'
  >('businesses');

  // Search & Filter state for businesses
  const [bizSearch, setBizSearch] = useState('');
  const [bizCategoryFilter, setBizCategoryFilter] = useState('all');
  const [bizTierFilter, setBizTierFilter] = useState<string>('all');
  const [bizClaimFilter, setBizClaimFilter] = useState<string>('all');

  // Toast feedback
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Telemetry KPIs
  const totalCount = businesses.length;
  const claimedCount = businesses.filter((b) => b.claimStatus === 'claimed').length;
  const credentialCount = businesses.filter(
    (b) => b.verificationTier === 'credential_verified'
  ).length;
  const featuredCount = businesses.filter((b) => b.featured).length;

  // Aggregate shop counts
  const totalServices = businesses.reduce((acc, b) => acc + (b.services?.length || 0), 0);
  const totalProducts = businesses.reduce((acc, b) => acc + (b.products?.length || 0), 0);
  const totalShopItems = totalServices + totalProducts;

  // --- BUSINESS MUTATION MODAL ---
  const [bizModalOpen, setBizModalOpen] = useState(false);
  const [editingBizId, setEditingBizId] = useState<string | null>(null);
  const [modalBizName, setModalBizName] = useState('');
  const [modalBizTagline, setModalBizTagline] = useState('');
  const [modalBizCategory, setModalBizCategory] = useState(categories[0]?.id || 'cat-trades');
  const [modalBizNeighborhood, setModalBizNeighborhood] = useState('Cannery District');
  const [modalBizAddress, setModalBizAddress] = useState('123 Main St');
  const [modalBizPhone, setModalBizPhone] = useState('(406) 555-0100');
  const [modalBizEmail, setModalBizEmail] = useState('info@bozemanbiz.com');
  const [modalBizWhatsapp, setModalBizWhatsapp] = useState('+14065550100');
  const [modalBizWebsite, setModalBizWebsite] = useState('https://example.com');
  const [modalBizTier, setModalBizTier] = useState<VerificationTier>('claimed');
  const [modalBizClaim, setModalBizClaim] = useState<'claimed' | 'unclaimed'>('claimed');
  const [modalBizFeatured, setModalBizFeatured] = useState(false);
  const [modalBizDesc, setModalBizDesc] = useState('');
  const [modalBizLogo, setModalBizLogo] = useState('');
  const [modalBizCover, setModalBizCover] = useState('');

  const openAddBizModal = () => {
    setEditingBizId(null);
    setModalBizName('');
    setModalBizTagline('Quality local craftsmanship serving Bozeman');
    setModalBizCategory(categories[0]?.id || 'cat-trades');
    setModalBizNeighborhood('Downtown Bozeman');
    setModalBizAddress('100 E Main St');
    setModalBizPhone('(406) 555-0188');
    setModalBizEmail('contact@newbusiness.com');
    setModalBizWhatsapp('+14065550188');
    setModalBizWebsite('https://bozemanbusiness.com');
    setModalBizTier('verified');
    setModalBizClaim('claimed');
    setModalBizFeatured(false);
    setModalBizDesc('Proud local Montana business dedicated to exceptional service.');
    setModalBizLogo(
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=200&q=80'
    );
    setModalBizCover(
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80'
    );
    setBizModalOpen(true);
  };

  const openEditBizModal = (b: Business) => {
    setEditingBizId(b.id);
    setModalBizName(b.name);
    setModalBizTagline(b.tagline);
    setModalBizCategory(b.categoryId);
    setModalBizNeighborhood(b.location.neighborhood);
    setModalBizAddress(b.location.address);
    setModalBizPhone(b.contact.formattedPhone);
    setModalBizEmail(b.contact.email);
    setModalBizWhatsapp(b.contact.whatsapp || '');
    setModalBizWebsite(b.contact.website || '');
    setModalBizTier(b.verificationTier);
    setModalBizClaim(b.claimStatus === 'unclaimed' ? 'unclaimed' : 'claimed');
    setModalBizFeatured(Boolean(b.featured));
    setModalBizDesc(b.description);
    setModalBizLogo(b.logoUrl);
    setModalBizCover(b.coverUrl);
    setBizModalOpen(true);
  };

  const handleSaveBiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalBizName.trim()) return;
    const cat = categories.find((c) => c.id === modalBizCategory);

    if (editingBizId) {
      updateBusinessProfile(editingBizId, {
        name: modalBizName,
        tagline: modalBizTagline,
        categoryId: modalBizCategory,
        categoryName: cat?.name || 'Local Services',
        location: {
          address: modalBizAddress,
          city: 'Bozeman',
          state: 'MT',
          postalCode: '59715',
          country: 'USA',
          neighborhood: modalBizNeighborhood,
          lat: 45.6793,
          lng: -111.0373,
        },
        contact: {
          phone: modalBizPhone.replace(/\D/g, ''),
          formattedPhone: modalBizPhone,
          email: modalBizEmail,
          whatsapp: modalBizWhatsapp,
          website: modalBizWebsite,
        },
        verificationTier: modalBizTier,
        claimStatus: modalBizClaim,
        featured: modalBizFeatured,
        description: modalBizDesc,
        logoUrl: modalBizLogo,
        coverUrl: modalBizCover,
      });
      showToast(`Business "${modalBizName}" updated.`);
    } else {
      const defaultHours: Record<DayOfWeek, { open: string; close: string; closed: boolean }> = {
        monday: { open: '08:00', close: '17:00', closed: false },
        tuesday: { open: '08:00', close: '17:00', closed: false },
        wednesday: { open: '08:00', close: '17:00', closed: false },
        thursday: { open: '08:00', close: '17:00', closed: false },
        friday: { open: '08:00', close: '17:00', closed: false },
        saturday: { open: '09:00', close: '15:00', closed: false },
        sunday: { open: '00:00', close: '00:00', closed: true },
      };

      const newBiz: Business = {
        id: 'b-' + Date.now(),
        slug: modalBizName.toLowerCase().replace(/\s+/g, '-'),
        name: modalBizName,
        tagline: modalBizTagline,
        description: modalBizDesc,
        fullStory: 'Locally founded and operated in the Gallatin Valley.',
        categoryId: modalBizCategory,
        categoryName: cat?.name || 'Local Trades',
        tags: ['Bozeman', 'Local', cat?.name || 'Trades'],
        rating: 5.0,
        reviewsCount: 1,
        yearsInBusiness: 3,
        foundedYear: 2021,
        priceRange: '$$',
        location: {
          address: modalBizAddress,
          city: 'Bozeman',
          state: 'MT',
          postalCode: '59715',
          country: 'USA',
          neighborhood: modalBizNeighborhood,
          lat: 45.6793,
          lng: -111.0373,
        },
        contact: {
          phone: modalBizPhone.replace(/\D/g, ''),
          formattedPhone: modalBizPhone,
          email: modalBizEmail,
          whatsapp: modalBizWhatsapp,
          website: modalBizWebsite,
        },
        socials: {},
        hours: defaultHours,
        verificationTier: modalBizTier,
        verifiedItems: ['Montana Secretary of State Good Standing', 'Active Local Phone Line'],
        claimStatus: modalBizClaim,
        credentials: [],
        services: [
          {
            id: 'srv-' + Date.now(),
            name: 'Consultation & Estimate',
            description: 'Complimentary consultation for Bozeman residents.',
            priceType: 'starting_at',
            price: 75,
            priceUnit: 'session',
          },
        ],
        products: [],
        portfolio: [],
        team: [],
        faqs: [],
        reviews: [],
        badges: ['Locally Owned', 'Verified'],
        featured: modalBizFeatured,
        logoUrl:
          modalBizLogo ||
          'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=200&q=80',
        coverUrl:
          modalBizCover ||
          'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
        analytics: {
          views: 40,
          searchImpressions: 120,
          calls: 3,
          whatsappClicks: 5,
          websiteClicks: 8,
          leads: 1,
          quoteRequests: 1,
          bookings: 0,
        },
      };
      addBusiness(newBiz);
      showToast(`Added new business "${modalBizName}" to directory.`);
    }
    setBizModalOpen(false);
  };

  // Filtered businesses
  const filteredBusinesses = businesses.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(bizSearch.toLowerCase()) ||
      b.categoryName.toLowerCase().includes(bizSearch.toLowerCase()) ||
      b.location.neighborhood.toLowerCase().includes(bizSearch.toLowerCase());
    const matchesCat = bizCategoryFilter === 'all' || b.categoryId === bizCategoryFilter;
    const matchesTier = bizTierFilter === 'all' || b.verificationTier === bizTierFilter;
    const matchesClaim = bizClaimFilter === 'all' || b.claimStatus === bizClaimFilter;
    return matchesSearch && matchesCat && matchesTier && matchesClaim;
  });

  // --- DIGITAL SHOPS FILTER & MASTER LIST ---
  const [shopBizFilter, setShopBizFilter] = useState('all');
  const [shopTypeFilter, setShopTypeFilter] = useState<'all' | 'service' | 'product'>('all');

  // Aggregated list of all items across all shops
  interface AggregatedShopItem {
    id: string;
    itemType: 'service' | 'product';
    businessId: string;
    businessName: string;
    name: string;
    price?: number;
    priceType?: string;
    description: string;
    imageUrl?: string;
    availability?: string;
  }

  const allShopItems: AggregatedShopItem[] = [];
  businesses.forEach((b) => {
    (b.services || []).forEach((s) => {
      allShopItems.push({
        id: s.id,
        itemType: 'service',
        businessId: b.id,
        businessName: b.name,
        name: s.name,
        price: s.price,
        priceType: s.priceType,
        description: s.description,
        imageUrl: s.imageUrl,
      });
    });
    (b.products || []).forEach((p) => {
      allShopItems.push({
        id: p.id,
        itemType: 'product',
        businessId: b.id,
        businessName: b.name,
        name: p.name,
        price: p.price,
        priceType: p.priceType,
        description: p.description,
        imageUrl: p.imageUrl,
        availability: p.availability,
      });
    });
  });

  const filteredShopItems = allShopItems.filter((item) => {
    const matchesBiz = shopBizFilter === 'all' || item.businessId === shopBizFilter;
    const matchesType = shopTypeFilter === 'all' || item.itemType === shopTypeFilter;
    return matchesBiz && matchesType;
  });

  // --- CATEGORY ADD MODAL ---
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('ShoppingBag');

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const newCat: Category = {
      id: 'cat-' + newCatName.toLowerCase().replace(/\s+/g, '-'),
      name: newCatName,
      slug: newCatName.toLowerCase().replace(/\s+/g, '-'),
      iconName: newCatIcon,
      icon: newCatIcon,
      businessCount: 0,
      description: newCatDesc || 'Local services and shops in Bozeman, Montana.',
      popularServices: ['Consultation', 'Custom Work', 'Repairs'],
      subcategories: ['General', 'Commercial', 'Residential'],
    };
    addCategory(newCat);
    setCatModalOpen(false);
    setNewCatName('');
    setNewCatDesc('');
    showToast(`Added category: "${newCatName}"`);
  };

  // --- ANNOUNCEMENT BANNER STATE ---
  const [announcementInput, setAnnouncementInput] = useState(announcement || '');
  const handleSaveAnnouncement = () => {
    setAnnouncement(announcementInput.trim() ? announcementInput : null);
    addAdminLog(
      'Updated Announcement',
      announcementInput.trim() ? `Set banner: "${announcementInput}"` : 'Cleared broadcast banner'
    );
    showToast('Platform announcement broadcast saved!');
  };

  // --- LEADS EXPORT HELPER ---
  const exportLeadsJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(leads, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `bozeman_leads_export_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Downloaded leads JSON data.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-stone-900 text-amber-400 border border-amber-500/40 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <CheckCircle size={18} className="text-emerald-400" />
          <span className="text-xs font-semibold text-white">{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-stone-950 rounded-3xl p-6 sm:p-8 text-white mb-8 border border-stone-800 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2.5 py-0.5 rounded-full text-xs font-bold mb-2">
            <ShieldCheck size={14} className="text-purple-400" />
            <span>Master Administrative Control Center</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Platform Master Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-2xl">
            Controlled by Us to Control Everything: Directory listings, vendor digital shops, customer leads, pricing, categories, and system-wide policies.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={openAddBizModal}
            className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
          >
            <Plus size={15} />
            <span>+ Add New Business</span>
          </button>

          <button
            onClick={openDownloadModal}
            className="inline-flex items-center gap-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold px-3.5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
            title="Create and download project file (.ZIP, .JSON, or .TAR.GZ)"
          >
            <Download size={14} />
            <span>Download Project File</span>
          </button>

          <button
            onClick={exportLeadsJSON}
            className="inline-flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold px-3.5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer border border-stone-700"
          >
            <Download size={14} />
            <span>Export Leads</span>
          </button>
        </div>
      </div>

      {/* High-Level Telemetry Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs">
          <span className="text-[11px] text-stone-500 font-medium block">Total Listings</span>
          <span className="font-heading font-extrabold text-2xl text-stone-900 block mt-1">{totalCount}</span>
          <span className="text-[10px] text-stone-400">All Bozeman listings</span>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs">
          <span className="text-[11px] text-stone-500 font-medium block">Claimed Vendors</span>
          <span className="font-heading font-extrabold text-2xl text-amber-700 block mt-1">{claimedCount}</span>
          <span className="text-[10px] text-stone-400">{Math.round((claimedCount / totalCount) * 100)}% claimed</span>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs">
          <span className="text-[11px] text-stone-500 font-medium block">Verified Shield</span>
          <span className="font-heading font-extrabold text-2xl text-emerald-700 block mt-1">{credentialCount}</span>
          <span className="text-[10px] text-emerald-600 font-medium">Audited & approved</span>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs">
          <span className="text-[11px] text-stone-500 font-medium block">Digital Shop Items</span>
          <span className="font-heading font-extrabold text-2xl text-blue-700 block mt-1">{totalShopItems}</span>
          <span className="text-[10px] text-stone-400">{totalServices} srv • {totalProducts} prod</span>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs">
          <span className="text-[11px] text-stone-500 font-medium block">Customer Leads</span>
          <span className="font-heading font-extrabold text-2xl text-purple-700 block mt-1">{leads.length}</span>
          <span className="text-[10px] text-purple-600 font-medium">Quotes & bookings</span>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs">
          <span className="text-[11px] text-stone-500 font-medium block">Categories</span>
          <span className="font-heading font-extrabold text-2xl text-stone-900 block mt-1">{categories.length}</span>
          <span className="text-[10px] text-stone-400">Active taxonomies</span>
        </div>
      </div>

      {/* Master Navigation Bar */}
      <div className="flex items-center overflow-x-auto gap-2 border-b border-stone-200 pb-2 mb-8 text-xs font-bold scrollbar-none">
        <button
          onClick={() => setMasterTab('businesses')}
          className={`px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 cursor-pointer shrink-0 ${
            masterTab === 'businesses'
              ? 'bg-stone-900 text-amber-400 shadow-xs'
              : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
          }`}
        >
          <Building2 size={14} />
          <span>Control Listings ({businesses.length})</span>
        </button>

        <button
          onClick={() => setMasterTab('digital_shops')}
          className={`px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 cursor-pointer shrink-0 ${
            masterTab === 'digital_shops'
              ? 'bg-stone-900 text-amber-400 shadow-xs'
              : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
          }`}
        >
          <ShoppingBag size={14} />
          <span>Control All Digital Shops ({allShopItems.length})</span>
        </button>

        <button
          onClick={() => setMasterTab('leads')}
          className={`px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 cursor-pointer shrink-0 ${
            masterTab === 'leads'
              ? 'bg-stone-900 text-amber-400 shadow-xs'
              : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
          }`}
        >
          <FileText size={14} />
          <span>Leads & Inquiries ({leads.length})</span>
        </button>

        <button
          onClick={() => setMasterTab('events_deals')}
          className={`px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 cursor-pointer shrink-0 ${
            masterTab === 'events_deals'
              ? 'bg-stone-900 text-amber-400 shadow-xs'
              : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
          }`}
        >
          <Percent size={14} />
          <span>Deals & Events ({offers.length + events.length})</span>
        </button>

        <button
          onClick={() => setMasterTab('categories')}
          className={`px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 cursor-pointer shrink-0 ${
            masterTab === 'categories'
              ? 'bg-stone-900 text-amber-400 shadow-xs'
              : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
          }`}
        >
          <Layers size={14} />
          <span>Categories ({categories.length})</span>
        </button>

        <button
          onClick={() => setMasterTab('logs')}
          className={`px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 cursor-pointer shrink-0 ${
            masterTab === 'logs'
              ? 'bg-stone-900 text-amber-400 shadow-xs'
              : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
          }`}
        >
          <Activity size={14} />
          <span>Broadcast & Audit Logs ({adminLogs.length})</span>
        </button>
      </div>

      {/* --- MASTER TAB 1: CONTROL ALL BUSINESSES --- */}
      {masterTab === 'businesses' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative w-full md:w-80">
              <input
                type="text"
                value={bizSearch}
                onChange={(e) => setBizSearch(e.target.value)}
                placeholder="Search by business name, category, or neighborhood..."
                className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-amber-500"
              />
              <Search size={14} className="text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <select
                value={bizCategoryFilter}
                onChange={(e) => setBizCategoryFilter(e.target.value)}
                className="bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-1.5 text-xs text-stone-700"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                value={bizTierFilter}
                onChange={(e) => setBizTierFilter(e.target.value)}
                className="bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-1.5 text-xs text-stone-700"
              >
                <option value="all">All Verification Tiers</option>
                <option value="unclaimed">Unclaimed</option>
                <option value="claimed">Claimed</option>
                <option value="verified">Verified</option>
                <option value="credential_verified">Credential Verified</option>
                <option value="featured">Featured</option>
              </select>

              <select
                value={bizClaimFilter}
                onChange={(e) => setBizClaimFilter(e.target.value)}
                className="bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-1.5 text-xs text-stone-700"
              >
                <option value="all">All Claim Statuses</option>
                <option value="claimed">Claimed</option>
                <option value="unclaimed">Unclaimed</option>
              </select>

              <button
                onClick={openAddBizModal}
                className="bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold px-3 py-1.5 rounded-xl transition-colors shrink-0"
              >
                + New Business
              </button>
            </div>
          </div>

          {/* Business Table */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-600 uppercase font-bold border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4">Business & Location</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Verification Tier</th>
                    <th className="py-3 px-3">Claim Status</th>
                    <th className="py-3 px-3">Featured</th>
                    <th className="py-3 px-3 text-center">Shop Items</th>
                    <th className="py-3 px-4 text-right">Master Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {filteredBusinesses.map((b) => (
                    <tr key={b.id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={b.logoUrl}
                            alt=""
                            className="w-10 h-10 rounded-xl object-cover border border-stone-200 bg-stone-100 shrink-0"
                          />
                          <div>
                            <span className="font-heading font-bold text-stone-900 block text-xs">
                              {b.name}
                            </span>
                            <span className="text-[11px] text-stone-500">
                              {b.location.neighborhood} • {b.contact.formattedPhone}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-stone-600 font-medium">
                        {b.categoryName}
                      </td>

                      {/* Instant Tier Override Dropdown */}
                      <td className="py-3 px-3">
                        <select
                          value={b.verificationTier}
                          onChange={(e) => {
                            const newTier = e.target.value as VerificationTier;
                            updateBusinessProfile(b.id, {
                              verificationTier: newTier,
                              claimStatus: newTier === 'unclaimed' ? 'unclaimed' : 'claimed',
                            });
                            addAdminLog(
                              'Overrode Tier',
                              `Changed tier of ${b.name} to ${newTier}`
                            );
                            showToast(`Updated tier for ${b.name}`);
                          }}
                          className="text-[11px] font-bold bg-stone-50 border border-stone-300 rounded-lg px-2 py-1 text-stone-800 cursor-pointer"
                        >
                          <option value="unclaimed">Unclaimed</option>
                          <option value="claimed">Claimed</option>
                          <option value="verified">Verified</option>
                          <option value="credential_verified">Credential Verified</option>
                          <option value="featured">Featured</option>
                        </select>
                      </td>

                      {/* Claim Status Toggle */}
                      <td className="py-3 px-3">
                        <button
                          onClick={() => {
                            const newStatus = b.claimStatus === 'claimed' ? 'unclaimed' : 'claimed';
                            updateBusinessProfile(b.id, { claimStatus: newStatus });
                            addAdminLog(
                              'Toggled Claim Status',
                              `${b.name} set to ${newStatus}`
                            );
                            showToast(`${b.name} marked as ${newStatus}`);
                          }}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer uppercase tracking-wider ${
                            b.claimStatus === 'claimed'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-stone-200 text-stone-700'
                          }`}
                        >
                          {b.claimStatus}
                        </button>
                      </td>

                      {/* Featured Star Toggle */}
                      <td className="py-3 px-3">
                        <button
                          onClick={() => {
                            updateBusinessProfile(b.id, { featured: !b.featured });
                            addAdminLog(
                              'Toggled Featured',
                              `${b.name} featured: ${!b.featured}`
                            );
                            showToast(`${b.name} ${!b.featured ? 'Featured' : 'Unfeatured'}`);
                          }}
                          className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                            b.featured
                              ? 'text-amber-500 bg-amber-50'
                              : 'text-stone-300 hover:text-stone-500'
                          }`}
                        >
                          <Star size={16} fill={b.featured ? 'currentColor' : 'none'} />
                        </button>
                      </td>

                      {/* Shop item counts */}
                      <td className="py-3 px-3 text-center text-stone-600">
                        <span className="font-mono font-bold">
                          {(b.services?.length || 0) + (b.products?.length || 0)}
                        </span>
                        <span className="text-[10px] text-stone-400 block">
                          {b.services?.length || 0}s / {b.products?.length || 0}p
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => openBusinessProfile(b.id)}
                            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg cursor-pointer"
                            title="Preview Public Listing"
                          >
                            <ExternalLink size={14} />
                          </button>
                          <button
                            onClick={() => openEditBizModal(b)}
                            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg cursor-pointer"
                            title="Edit Business"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Permanently delete "${b.name}" from Bozeman directory?`)) {
                                deleteBusiness(b.id);
                                showToast(`Deleted ${b.name}`);
                              }
                            }}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
                            title="Delete Business"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- MASTER TAB 2: CONTROL ALL DIGITAL SHOPS --- */}
      {masterTab === 'digital_shops' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="font-heading font-bold text-base text-stone-900">
                Master Digital Shop Catalog (All Vendors)
              </h3>
              <p className="text-xs text-stone-500">
                Manage, edit pricing, verify stock, or purge products and bookable services across all registered businesses.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={shopBizFilter}
                onChange={(e) => setShopBizFilter(e.target.value)}
                className="text-xs bg-stone-50 border border-stone-300 rounded-xl px-3 py-1.5 text-stone-700"
              >
                <option value="all">All Vendors / Businesses</option>
                {businesses.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>

              <select
                value={shopTypeFilter}
                onChange={(e) => setShopTypeFilter(e.target.value as any)}
                className="text-xs bg-stone-50 border border-stone-300 rounded-xl px-3 py-1.5 text-stone-700"
              >
                <option value="all">All Items (Services & Products)</option>
                <option value="service">Services Only</option>
                <option value="product">Products Only</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredShopItems.map((item) => (
              <div
                key={`${item.itemType}-${item.id}`}
                className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between hover:border-amber-400 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        item.itemType === 'service'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {item.itemType}
                    </span>

                    <span className="font-heading font-extrabold text-stone-900 text-base">
                      {item.price !== undefined ? `$${item.price}` : 'Quote Only'}
                    </span>
                  </div>

                  <h4 className="font-heading font-bold text-stone-900 text-sm mb-1">{item.name}</h4>
                  <p className="text-[11px] font-medium text-amber-800 mb-2">
                    Vendor: {item.businessName}
                  </p>
                  <p className="text-xs text-stone-500 line-clamp-2 mb-4">{item.description}</p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[10px] text-stone-400 font-mono">ID: {item.id}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openBusinessProfile(item.businessId)}
                      className="text-[11px] text-stone-600 hover:text-stone-900 font-bold px-2 py-1 bg-stone-100 rounded-lg cursor-pointer"
                    >
                      View Shop
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Remove "${item.name}" from ${item.businessName}'s digital shop?`)) {
                          if (item.itemType === 'service') {
                            deleteServiceFromBusiness(item.businessId, item.id);
                          } else {
                            deleteProductFromBusiness(item.businessId, item.id);
                          }
                          showToast(`Removed item from ${item.businessName}`);
                        }
                      }}
                      className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
                      title="Delete Item"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- MASTER TAB 3: LEADS & INQUIRIES --- */}
      {masterTab === 'leads' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-heading font-bold text-base text-stone-900">
                Universal Customer Leads & Quote Pipeline
              </h3>
              <p className="text-xs text-stone-500">
                Monitor all consumer inquiries, direct bookings, and quote requests generated across Bozeman.
              </p>
            </div>
            <button
              onClick={exportLeadsJSON}
              className="inline-flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
            >
              <Download size={14} />
              <span>Export Full CSV / JSON</span>
            </button>
          </div>

          <div className="space-y-3">
            {leads.map((l) => (
              <div
                key={l.id}
                className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-heading font-bold text-sm text-stone-900">
                      {l.customerName}
                    </span>
                    <span className="text-xs text-stone-400">• Target Business:</span>
                    <span className="text-xs font-bold text-amber-800">{l.businessName}</span>
                    <span className="text-xs text-stone-400 font-mono">• {new Date(l.createdAt).toLocaleDateString()}</span>
                  </div>

                  <p className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                    "{l.message || l.notes || 'No message provided'}"
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 pt-1">
                    {l.customerPhone && <span>Phone: {l.customerPhone}</span>}
                    {l.customerEmail && <span>Email: {l.customerEmail}</span>}
                    {l.budget && <span>Budget: {l.budget}</span>}
                    {l.serviceOrProduct && <span>Requested: {l.serviceOrProduct}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-stone-100 w-full lg:w-auto justify-end">
                  <select
                    value={l.status}
                    onChange={(e) => {
                      updateLeadStatus(l.id, e.target.value as any);
                      showToast(`Lead status updated to ${e.target.value}`);
                    }}
                    className="text-xs font-bold bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-1 text-stone-800 cursor-pointer"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="in_progress">In Progress</option>
                    <option value="closed">Closed / Won</option>
                  </select>

                  <button
                    onClick={() => {
                      if (confirm('Delete this customer lead?')) {
                        deleteLead(l.id);
                        showToast('Lead removed.');
                      }
                    }}
                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
                    title="Delete Lead"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- MASTER TAB 4: EVENTS & DEALS --- */}
      {masterTab === 'events_deals' && (
        <div className="space-y-8">
          {/* Deals */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-base text-stone-900">
                Active Merchant Discounts & Coupons ({offers.length})
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {offers.map((o) => (
                <div key={o.id} className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                      {o.discountTag}
                    </span>
                    <h4 className="font-bold text-stone-900 text-xs mt-1">{o.title}</h4>
                    <p className="text-[11px] text-stone-500">Business: {o.businessName} • Code: {o.code || 'None'}</p>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm(`Remove offer "${o.title}"?`)) {
                        deleteOffer(o.id);
                        showToast('Offer removed.');
                      }
                    }}
                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Events */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-base text-stone-900">
                Community Events & Workshops ({events.length})
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.map((e) => (
                <div key={e.id} className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-stone-900 text-xs">{e.title}</h4>
                    <p className="text-[11px] text-stone-500">
                      {e.date} • {e.location} • Host: {e.businessName}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm(`Remove event "${e.title}"?`)) {
                        deleteEvent(e.id);
                        showToast('Event removed.');
                      }
                    }}
                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- MASTER TAB 5: CATEGORIES TAXONOMY --- */}
      {masterTab === 'categories' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-base text-stone-900">
                Directory Categories & Taxonomy ({categories.length})
              </h3>
              <p className="text-xs text-stone-500">
                Configure primary categories for search filtering and navigation chips.
              </p>
            </div>
            <button
              onClick={() => setCatModalOpen(true)}
              className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors"
            >
              + Add Category
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((c) => {
              const count = businesses.filter((b) => b.categoryId === c.id).length;
              return (
                <div key={c.id} className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-heading font-bold text-stone-900 text-sm">{c.name}</h4>
                      <span className="text-[10px] font-bold bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full">
                        {count} businesses
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mb-2">{c.description}</p>
                    <span className="text-[10px] text-stone-400 font-mono">ID: {c.id}</span>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex justify-end">
                    <button
                      onClick={() => {
                        if (confirm(`Remove category "${c.name}"?`)) {
                          deleteCategory(c.id);
                          showToast(`Category "${c.name}" removed.`);
                        }
                      }}
                      className="text-red-500 hover:text-red-700 text-xs font-bold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- MASTER TAB 6: BROADCAST & AUDIT LOGS --- */}
      {masterTab === 'logs' && (
        <div className="space-y-6">
          {/* Broadcast Banner Manager */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
            <h3 className="font-heading font-bold text-base text-stone-900 mb-1">
              Global Platform Broadcast Banner
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              This message appears at the top of the entire application for all visitors. Leave empty to disable.
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={announcementInput}
                onChange={(e) => setAnnouncementInput(e.target.value)}
                placeholder="e.g. Welcome to Bozeman Business Hub! All local vendor catalogs are 100% direct."
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
              />
              <button
                onClick={handleSaveAnnouncement}
                className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-5 py-2 rounded-xl text-xs transition-colors shrink-0 cursor-pointer"
              >
                Update Banner
              </button>
            </div>
          </div>

          {/* Audit Logs */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
            <h3 className="font-heading font-bold text-base text-stone-900 mb-1">
              Master Admin Action Audit Trail
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Immutable chronological record of updates, tier alterations, and listings management.
            </p>

            <div className="divide-y divide-stone-100 font-mono text-xs">
              {adminLogs.map((log) => (
                <div key={log.id} className="py-2.5 flex items-start justify-between gap-4">
                  <div>
                    <span className="font-bold text-stone-900 mr-2">{log.action}:</span>
                    <span className="text-stone-600">{log.details}</span>
                  </div>
                  <span className="text-stone-400 text-[10px] shrink-0">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- BUSINESS EDIT / ADD MODAL --- */}
      {bizModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-6">
              <h3 className="font-heading font-bold text-xl text-stone-900">
                {editingBizId ? 'Master Edit: Business Listing' : 'Master Add: New Business'}
              </h3>
              <button
                onClick={() => setBizModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveBiz} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Business Name *</label>
                  <input
                    type="text"
                    required
                    value={modalBizName}
                    onChange={(e) => setModalBizName(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Category *</label>
                  <select
                    value={modalBizCategory}
                    onChange={(e) => setModalBizCategory(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-stone-700 uppercase mb-1">Tagline *</label>
                  <input
                    type="text"
                    required
                    value={modalBizTagline}
                    onChange={(e) => setModalBizTagline(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Neighborhood *</label>
                  <input
                    type="text"
                    required
                    value={modalBizNeighborhood}
                    onChange={(e) => setModalBizNeighborhood(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Street Address *</label>
                  <input
                    type="text"
                    required
                    value={modalBizAddress}
                    onChange={(e) => setModalBizAddress(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={modalBizPhone}
                    onChange={(e) => setModalBizPhone(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Direct WhatsApp</label>
                  <input
                    type="text"
                    value={modalBizWhatsapp}
                    onChange={(e) => setModalBizWhatsapp(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={modalBizEmail}
                    onChange={(e) => setModalBizEmail(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Website URL</label>
                  <input
                    type="text"
                    value={modalBizWebsite}
                    onChange={(e) => setModalBizWebsite(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                {/* Master Privileges */}
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Verification Tier</label>
                  <select
                    value={modalBizTier}
                    onChange={(e) => setModalBizTier(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="unclaimed">Unclaimed</option>
                    <option value="claimed">Claimed</option>
                    <option value="verified">Verified</option>
                    <option value="credential_verified">Credential Verified</option>
                    <option value="featured">Featured</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Claim Status</label>
                  <select
                    value={modalBizClaim}
                    onChange={(e) => setModalBizClaim(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="claimed">Claimed</option>
                    <option value="unclaimed">Unclaimed</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-stone-700 uppercase mb-1">Description *</label>
                  <textarea
                    rows={3}
                    required
                    value={modalBizDesc}
                    onChange={(e) => setModalBizDesc(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featCheck"
                    checked={modalBizFeatured}
                    onChange={(e) => setModalBizFeatured(e.target.checked)}
                    className="rounded text-amber-500"
                  />
                  <label htmlFor="featCheck" className="font-bold text-stone-800">
                    Feature prominently on directory homepage
                  </label>
                </div>
              </div>

              <div className="pt-6 border-t border-stone-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setBizModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl cursor-pointer"
                >
                  {editingBizId ? 'Save Overrides' : 'Create Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD CATEGORY MODAL --- */}
      {catModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <h3 className="font-heading font-bold text-lg text-stone-900">Add New Category</h3>
              <button onClick={() => setCatModalOpen(false)} className="p-1 text-stone-400 hover:text-stone-700">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Montana Outdoor Gear & Rentals"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="Bozeman ski tuning, fly fishing outfitters, backcountry gear..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="pt-4 border-t border-stone-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCatModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
