import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Business,
  Category,
  EventItem,
  OfferItem,
  BusinessStory,
  Lead,
  SearchFilterState,
  ReviewItem,
  ServiceItem,
  ProductItem,
  AdminLogItem,
} from '../types';
import { INITIAL_BUSINESSES, CATEGORIES, INITIAL_EVENTS, INITIAL_OFFERS, INITIAL_STORIES, INITIAL_LEADS } from '../data/mockData';

const DEFAULT_FILTERS: SearchFilterState = {
  query: '',
  category: '',
  neighborhood: '',
  verificationTier: '',
  openNow: false,
  hasWhatsApp: false,
  hasServices: false,
  hasProducts: false,
  priceRange: [],
  minRating: 0,
  minYears: 0,
  sortBy: 'relevance',
};

interface LeadModalState {
  isOpen: boolean;
  business: Business | null;
  type: 'quote' | 'inquiry' | 'booking';
  preselectedItem?: {
    type: 'service' | 'product';
    id: string;
    name: string;
  };
}

interface DirectoryContextType {
  businesses: Business[];
  setBusinesses: React.Dispatch<React.SetStateAction<Business[]>>;
  addBusiness: (business: Business) => void;
  deleteBusiness: (businessId: string) => void;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  addCategory: (cat: Category) => void;
  deleteCategory: (catId: string) => void;
  events: EventItem[];
  setEvents: React.Dispatch<React.SetStateAction<EventItem[]>>;
  addEvent: (event: EventItem) => void;
  deleteEvent: (eventId: string) => void;
  offers: OfferItem[];
  setOffers: React.Dispatch<React.SetStateAction<OfferItem[]>>;
  addOffer: (offer: OfferItem) => void;
  deleteOffer: (offerId: string) => void;
  stories: BusinessStory[];
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  updateLeadStatus: (leadId: string, status: Lead['status'], internalNotes?: string) => void;
  deleteLead: (leadId: string) => void;
  activeTab: 'explore' | 'categories' | 'map' | 'shop' | 'events' | 'stories' | 'owner_dashboard' | 'admin_dashboard';
  setActiveTab: (tab: 'explore' | 'categories' | 'map' | 'shop' | 'events' | 'stories' | 'owner_dashboard' | 'admin_dashboard') => void;
  selectedBusinessId: string | null;
  selectedBusiness: Business | null;
  openBusinessProfile: (businessId: string) => void;
  closeBusinessProfile: () => void;
  filters: SearchFilterState;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilterState>>;
  updateFilter: (key: keyof SearchFilterState, value: any) => void;
  resetFilters: () => void;
  userRole: 'visitor' | 'business_owner' | 'admin';
  setUserRole: (role: 'visitor' | 'business_owner' | 'admin') => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  savedBusinesses: string[];
  savedProducts: string[];
  savedServices: string[];
  toggleSaveBusiness: (id: string) => void;
  toggleSaveProduct: (id: string) => void;
  toggleSaveService: (id: string) => void;
  comparisonList: string[];
  toggleCompare: (id: string) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  isComparisonModalOpen: boolean;
  setIsComparisonModalOpen: (open: boolean) => void;
  isClaimModalOpen: boolean;
  setIsClaimModalOpen: (open: boolean) => void;
  closeClaimModal: () => void;
  claimTargetBusinessId: string | null;
  claimTargetBusiness: Business | null;
  openClaimModal: (businessId?: string) => void;
  leadModal: LeadModalState;
  isLeadModalOpen: boolean;
  leadModalBusiness: Business | null;
  leadModalType: 'quote' | 'inquiry' | 'booking';
  leadModalItem?: { type: 'service' | 'product'; id: string; name: string };
  openLeadModal: (business: Business, type: 'quote' | 'inquiry' | 'booking', preselectedItem?: { type: 'service' | 'product'; id: string; name: string }) => void;
  closeLeadModal: () => void;
  submitLead: (data: Omit<Lead, 'id' | 'createdAt' | 'status'>) => Promise<boolean>;
  submitReview: (businessId: string, review: { rating: number; authorName: string; comment: string; photos?: string[] }) => void;
  claimBusiness: (businessId: string, ownerInfo: { ownerName: string; email?: string; businessEmail?: string; phone?: string; businessPhone?: string; title?: string; whatsappNumber?: string }) => void;
  updateBusinessProfile: (businessId: string, updatedData: Partial<Business>) => void;
  addServiceToBusiness: (businessId: string, service: ServiceItem) => void;
  updateServiceInBusiness: (businessId: string, serviceId: string, service: Partial<ServiceItem>) => void;
  deleteServiceFromBusiness: (businessId: string, serviceId: string) => void;
  addProductToBusiness: (businessId: string, product: ProductItem) => void;
  updateProductInBusiness: (businessId: string, productId: string, product: Partial<ProductItem>) => void;
  deleteProductFromBusiness: (businessId: string, productId: string) => void;
  activeVendorBusinessId: string;
  setActiveVendorBusinessId: (id: string) => void;
  announcement: string | null;
  setAnnouncement: (msg: string | null) => void;
  adminLogs: AdminLogItem[];
  addAdminLog: (action: string, details: string) => void;
  trackInteraction: (businessId: string, type: 'views' | 'calls' | 'whatsappClicks' | 'websiteClicks') => void;
  runAiSearch: (naturalQuery: string) => Promise<void>;
  aiSearchInterpretation: string | null;
  setAiSearchInterpretation: (interp: string | null) => void;
}

const DirectoryContext = createContext<DirectoryContextType | undefined>(undefined);

export const DirectoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load persisted businesses or fall back to mock data
  const [businesses, setBusinesses] = useState<Business[]>(() => {
    try {
      const stored = localStorage.getItem('bbh_businesses_v1');
      return stored ? JSON.parse(stored) : INITIAL_BUSINESSES;
    } catch {
      return INITIAL_BUSINESSES;
    }
  });

  /** Shared helper: replaces one business in state via an updater fn, leaving all others untouched. */
  const updateBusinessById = (businessId: string, updater: (b: Business) => Business) => {
    setBusinesses(prev => prev.map(b => (b.id === businessId ? updater(b) : b)));
  };

  const [categories, setCategories] = useState<Category[]>(CATEGORIES);
  const [events, setEvents] = useState<EventItem[]>(INITIAL_EVENTS);
  const [offers, setOffers] = useState<OfferItem[]>(INITIAL_OFFERS);
  const [stories] = useState<BusinessStory[]>(INITIAL_STORIES);

  // Leads
  const [leads, setLeads] = useState<Lead[]>(() => {
    try {
      const stored = localStorage.getItem('bbh_leads_v1');
      return stored ? JSON.parse(stored) : INITIAL_LEADS;
    } catch {
      return INITIAL_LEADS;
    }
  });

  // Admin Logs & Broadcasts
  const [announcement, setAnnouncement] = useState<string | null>(
    'Welcome to Bozeman Business Hub! All local vendor digital catalogs are 100% direct with zero commission.'
  );
  const [adminLogs, setAdminLogs] = useState<AdminLogItem[]>([
    {
      id: 'log-1',
      timestamp: new Date().toLocaleTimeString(),
      action: 'System Initialized',
      details: 'Master Admin Hub initialized for Gallatin County ecosystem',
      adminUser: 'Master SuperAdmin',
    },
  ]);

  // Active vendor business ID (for vendor dashboard switcher)
  const [activeVendorBusinessId, setActiveVendorBusinessId] = useState<string>(() => {
    const claimed = businesses.find(b => b.claimStatus === 'claimed');
    return claimed ? claimed.id : (businesses[0]?.id || 'b1');
  });

  // Navigation & view states
  const [activeTab, setActiveTab] = useState<'explore' | 'categories' | 'map' | 'shop' | 'events' | 'stories' | 'owner_dashboard' | 'admin_dashboard'>('explore');
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);

  // Filters
  const [filters, setFilters] = useState<SearchFilterState>(DEFAULT_FILTERS);
  const [aiSearchInterpretation, setAiSearchInterpretation] = useState<string | null>(null);

  // User role & City selector (Demonstrates global multi-city architecture)
  const [userRole, setUserRole] = useState<'visitor' | 'business_owner' | 'admin'>('visitor');
  const [selectedCity, setSelectedCity] = useState<string>('Bozeman, Montana');

  // Favorites & comparison
  const [savedBusinesses, setSavedBusinesses] = useState<string[]>(() => {
    try {
      const s = localStorage.getItem('bbh_saved_businesses');
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  });

  const [savedProducts, setSavedProducts] = useState<string[]>([]);
  const [savedServices, setSavedServices] = useState<string[]>([]);
  const [comparisonList, setComparisonList] = useState<string[]>([]);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);

  // Modals
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [claimTargetBusinessId, setClaimTargetBusinessId] = useState<string | null>(null);

  const [leadModal, setLeadModal] = useState<LeadModalState>({
    isOpen: false,
    business: null,
    type: 'inquiry',
  });

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('bbh_businesses_v1', JSON.stringify(businesses));
    } catch (e) {
      console.error('Storage error', e);
    }
  }, [businesses]);

  useEffect(() => {
    try {
      localStorage.setItem('bbh_leads_v1', JSON.stringify(leads));
    } catch (e) {
      console.error('Storage error', e);
    }
  }, [leads]);

  useEffect(() => {
    try {
      localStorage.setItem('bbh_saved_businesses', JSON.stringify(savedBusinesses));
    } catch (e) {
      console.error('Storage error', e);
    }
  }, [savedBusinesses]);

  const selectedBusiness = selectedBusinessId ? businesses.find(b => b.id === selectedBusinessId) || null : null;

  const openBusinessProfile = (businessId: string) => {
    setSelectedBusinessId(businessId);
    trackInteraction(businessId, 'views');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeBusinessProfile = () => {
    setSelectedBusinessId(null);
  };

  const updateFilter = (key: keyof SearchFilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setAiSearchInterpretation(null);
  };

  const toggleSaveBusiness = (id: string) => {
    setSavedBusinesses(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleSaveProduct = (id: string) => {
    setSavedProducts(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleSaveService = (id: string) => {
    setSavedServices(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleCompare = (id: string) => {
    setComparisonList(prev => {
      if (prev.includes(id)) {
        return prev.filter(x => x !== id);
      }
      if (prev.length >= 4) {
        alert('You can compare up to 4 businesses at a time.');
        return prev;
      }
      return [...prev, id];
    });
  };

  const removeFromCompare = (id: string) => {
    setComparisonList(prev => prev.filter(x => x !== id));
  };

  const clearCompare = () => {
    setComparisonList([]);
  };

  const openClaimModal = (businessId?: string) => {
    setClaimTargetBusinessId(businessId || (businesses[0]?.id ?? null));
    setIsClaimModalOpen(true);
  };

  const openLeadModal = (
    business: Business,
    type: 'quote' | 'inquiry' | 'booking',
    preselectedItem?: { type: 'service' | 'product'; id: string; name: string }
  ) => {
    setLeadModal({
      isOpen: true,
      business,
      type,
      preselectedItem,
    });
  };

  const closeLeadModal = () => {
    setLeadModal(prev => ({ ...prev, isOpen: false }));
  };

  const submitLead = async (data: Omit<Lead, 'id' | 'createdAt' | 'status'>): Promise<boolean> => {
    const newLead: Lead = {
      id: 'lead-' + Date.now(),
      createdAt: new Date().toISOString(),
      status: 'new',
      ...data,
    };

    // Update local state
    setLeads(prev => [newLead, ...prev]);

    // Update business analytics count
    updateBusinessById(data.businessId, b => ({
      ...b,
      analytics: {
        ...b.analytics,
        leads: (b.analytics.leads || 0) + 1,
        quoteRequests: data.type === 'quote' ? (b.analytics.quoteRequests || 0) + 1 : b.analytics.quoteRequests,
        bookings: data.type === 'booking' ? (b.analytics.bookings || 0) + 1 : b.analytics.bookings,
      },
    }));

    // Also sync to backend API endpoint
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLead),
      });
    } catch (err) {
      console.warn('API lead sync notice:', err);
    }

    return true;
  };

  const submitReview = (
    businessId: string,
    reviewData: { rating: number; authorName: string; comment: string; photos?: string[] }
  ) => {
    const newReview: ReviewItem = {
      id: 'rev-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      verifiedCustomer: true,
      ...reviewData,
    };

    updateBusinessById(businessId, b => {
      const updatedReviews = [newReview, ...(b.reviews || [])];
      const avgRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
      return {
        ...b,
        reviews: updatedReviews,
        reviewsCount: updatedReviews.length,
        rating: Number(avgRating.toFixed(2)),
      };
    });
  };

  const closeClaimModal = () => {
    setIsClaimModalOpen(false);
  };

  const claimTargetBusiness = claimTargetBusinessId
    ? businesses.find((b) => b.id === claimTargetBusinessId) || null
    : businesses[0] || null;

  const claimBusiness = (
    businessId: string,
    ownerInfo: { ownerName: string; email?: string; businessEmail?: string; phone?: string; businessPhone?: string; title?: string; whatsappNumber?: string }
  ) => {
    updateBusinessById(businessId, b => ({
      ...b,
      claimStatus: 'claimed',
      verificationTier: b.verificationTier === 'unclaimed' ? 'claimed' : b.verificationTier,
      verifiedItems: [
        ...(b.verifiedItems || []),
        `Ownership verified by ${ownerInfo.ownerName} (${ownerInfo.title || 'Owner'}) on ${new Date().toLocaleDateString()}`,
      ],
    }));
  };

  const addAdminLog = (action: string, details: string) => {
    const newLog: AdminLogItem = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      action,
      details,
      adminUser: 'Master SuperAdmin',
    };
    setAdminLogs(prev => [newLog, ...prev.slice(0, 49)]);
  };

  const addBusiness = (newBiz: Business) => {
    setBusinesses(prev => [newBiz, ...prev]);
    addAdminLog('Created Business', `Created new business listing: ${newBiz.name}`);
  };

  const deleteBusiness = (businessId: string) => {
    const biz = businesses.find(b => b.id === businessId);
    setBusinesses(prev => prev.filter(b => b.id !== businessId));
    addAdminLog('Deleted Business', `Removed business: ${biz?.name || businessId}`);
  };

  const addServiceToBusiness = (businessId: string, service: ServiceItem) => {
    updateBusinessById(businessId, b => ({ ...b, services: [service, ...(b.services || [])] }));
    addAdminLog('Added Service', `Added service "${service.name}" to business ID ${businessId}`);
  };

  const updateServiceInBusiness = (businessId: string, serviceId: string, service: Partial<ServiceItem>) => {
    updateBusinessById(businessId, b => ({
      ...b,
      services: (b.services || []).map(s => (s.id === serviceId ? { ...s, ...service } : s)),
    }));
    addAdminLog('Updated Service', `Updated service ID ${serviceId} on business ID ${businessId}`);
  };

  const deleteServiceFromBusiness = (businessId: string, serviceId: string) => {
    updateBusinessById(businessId, b => ({
      ...b,
      services: (b.services || []).filter(s => s.id !== serviceId),
    }));
    addAdminLog('Deleted Service', `Removed service ID ${serviceId} from business ID ${businessId}`);
  };

  const addProductToBusiness = (businessId: string, product: ProductItem) => {
    updateBusinessById(businessId, b => ({ ...b, products: [product, ...(b.products || [])] }));
    addAdminLog('Added Product', `Added product "${product.name}" to business ID ${businessId}`);
  };

  const updateProductInBusiness = (businessId: string, productId: string, product: Partial<ProductItem>) => {
    updateBusinessById(businessId, b => ({
      ...b,
      products: (b.products || []).map(p => (p.id === productId ? { ...p, ...product } : p)),
    }));
    addAdminLog('Updated Product', `Updated product ID ${productId} on business ID ${businessId}`);
  };

  const deleteProductFromBusiness = (businessId: string, productId: string) => {
    updateBusinessById(businessId, b => ({
      ...b,
      products: (b.products || []).filter(p => p.id !== productId),
    }));
    addAdminLog('Deleted Product', `Removed product ID ${productId} from business ID ${businessId}`);
  };

  const updateLeadStatus = (leadId: string, status: Lead['status'], internalNotes?: string) => {
    setLeads(prev =>
      prev.map(l => {
        if (l.id === leadId) {
          return {
            ...l,
            status,
            notes: internalNotes !== undefined ? internalNotes : l.notes,
          };
        }
        return l;
      })
    );
    addAdminLog('Updated Lead', `Changed lead ID ${leadId} status to ${status}`);
  };

  const deleteLead = (leadId: string) => {
    setLeads(prev => prev.filter(l => l.id !== leadId));
    addAdminLog('Deleted Lead', `Removed lead ID ${leadId}`);
  };

  const addEvent = (event: EventItem) => {
    setEvents(prev => [event, ...prev]);
    addAdminLog('Created Event', `Created event: ${event.title}`);
  };

  const deleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
    addAdminLog('Deleted Event', `Deleted event ID ${eventId}`);
  };

  const addOffer = (offer: OfferItem) => {
    setOffers(prev => [offer, ...prev]);
    addAdminLog('Created Offer', `Created discount offer: ${offer.title}`);
  };

  const deleteOffer = (offerId: string) => {
    setOffers(prev => prev.filter(o => o.id !== offerId));
    addAdminLog('Deleted Offer', `Deleted offer ID ${offerId}`);
  };

  const addCategory = (cat: Category) => {
    setCategories(prev => [...prev, cat]);
    addAdminLog('Added Category', `Added category: ${cat.name}`);
  };

  const deleteCategory = (catId: string) => {
    setCategories(prev => prev.filter(c => c.id !== catId));
    addAdminLog('Deleted Category', `Removed category ID ${catId}`);
  };

  const updateBusinessProfile = (businessId: string, updatedData: Partial<Business>) => {
    updateBusinessById(businessId, b => ({ ...b, ...updatedData }));
    addAdminLog('Updated Business', `Updated listing profile for ID ${businessId}`);
  };

  const trackInteraction = (
    businessId: string,
    type: 'views' | 'calls' | 'whatsappClicks' | 'websiteClicks'
  ) => {
    setBusinesses(prev =>
      prev.map(b => {
        if (b.id === businessId) {
          return {
            ...b,
            analytics: {
              ...b.analytics,
              [type]: (b.analytics[type] || 0) + 1,
            },
          };
        }
        return b;
      })
    );
  };

  const runAiSearch = async (naturalQuery: string) => {
    if (!naturalQuery.trim()) return;

    try {
      const res = await fetch('/api/ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: naturalQuery }),
      });
      const data = await res.json();

      if (data.success && data.parsed) {
        const { category, neighborhood, requiresOpenNow, requiresEmergency, interpretationSummary } = data.parsed;

        setFilters(prev => ({
          ...prev,
          query: naturalQuery,
          category: category || prev.category,
          neighborhood: neighborhood || prev.neighborhood,
          openNow: requiresOpenNow || prev.openNow,
        }));

        setAiSearchInterpretation(
          interpretationSummary || `AI filter applied: ${category || 'Businesses'} in Bozeman${neighborhood ? `, ${neighborhood}` : ''}`
        );
        setActiveTab('explore');
      }
    } catch (err) {
      console.warn('AI search fallback:', err);
      setFilters(prev => ({ ...prev, query: naturalQuery }));
      setActiveTab('explore');
    }
  };

  return (
    <DirectoryContext.Provider
      value={{
        businesses,
        setBusinesses,
        categories,
        events,
        offers,
        stories,
        leads,
        activeTab,
        setActiveTab,
        selectedBusinessId,
        selectedBusiness,
        openBusinessProfile,
        closeBusinessProfile,
        filters,
        setFilters,
        updateFilter,
        resetFilters,
        userRole,
        setUserRole,
        selectedCity,
        setSelectedCity,
        savedBusinesses,
        savedProducts,
        savedServices,
        toggleSaveBusiness,
        toggleSaveProduct,
        toggleSaveService,
        comparisonList,
        toggleCompare,
        removeFromCompare,
        clearCompare,
        isComparisonModalOpen,
        setIsComparisonModalOpen,
        isClaimModalOpen,
        setIsClaimModalOpen,
        closeClaimModal,
        claimTargetBusinessId,
        claimTargetBusiness,
        openClaimModal,
        leadModal,
        isLeadModalOpen: leadModal.isOpen,
        leadModalBusiness: leadModal.business,
        leadModalType: leadModal.type,
        leadModalItem: leadModal.preselectedItem,
        openLeadModal,
        closeLeadModal,
        submitLead,
        submitReview,
        claimBusiness,
        updateBusinessProfile,
        addBusiness,
        deleteBusiness,
        setCategories,
        addCategory,
        deleteCategory,
        setEvents,
        addEvent,
        deleteEvent,
        setOffers,
        addOffer,
        deleteOffer,
        setLeads,
        updateLeadStatus,
        deleteLead,
        addServiceToBusiness,
        updateServiceInBusiness,
        deleteServiceFromBusiness,
        addProductToBusiness,
        updateProductInBusiness,
        deleteProductFromBusiness,
        activeVendorBusinessId,
        setActiveVendorBusinessId,
        announcement,
        setAnnouncement,
        adminLogs,
        addAdminLog,
        trackInteraction,
        runAiSearch,
        aiSearchInterpretation,
        setAiSearchInterpretation,
      }}
    >
      {children}
    </DirectoryContext.Provider>
  );
};

export const useDirectory = () => {
  const context = useContext(DirectoryContext);
  if (!context) {
    throw new Error('useDirectory must be used within a DirectoryProvider');
  }
  return context;
};
