export type VerificationTier = 'unclaimed' | 'claimed' | 'verified' | 'credential_verified' | 'featured';

export type PriceRange = '$' | '$$' | '$$$' | '$$$$';

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface BusinessHours {
  open: string;
  close: string;
  closed?: boolean;
}

export interface BusinessLocation {
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  neighborhood: string;
  lat: number;
  lng: number;
}

export interface BusinessContact {
  phone: string;
  formattedPhone: string;
  email: string;
  website: string;
  whatsapp: string; // e.g., '14065550192'
}

export interface BusinessSocials {
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  twitter?: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  priceType: 'fixed' | 'starting_at' | 'hourly' | 'contact_for_price';
  price?: number;
  priceUnit?: string;
  duration?: string;
  imageUrl?: string;
  category?: string;
  popular?: boolean;
}

export interface ProductItem {
  id: string;
  name: string;
  description: string;
  priceType: 'fixed' | 'contact_for_price';
  price?: number;
  sku?: string;
  availability: 'in_stock' | 'made_to_order' | 'limited' | 'out_of_stock';
  imageUrl: string;
  tags: string[];
  specs?: Record<string, string>;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  completedDate?: string;
  clientType?: string;
}

export interface CredentialItem {
  id: string;
  type: 'license' | 'certification' | 'insurance' | 'award' | 'association';
  title: string;
  issuer: string;
  issueDate?: string;
  expirationDate?: string;
  credentialNumber?: string;
  verified: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  yearsWithBusiness?: number;
}

export interface ReviewItem {
  id: string;
  authorName: string;
  authorAvatar?: string;
  rating: number;
  date: string;
  comment: string;
  photos?: string[];
  verifiedCustomer: boolean;
  response?: {
    text: string;
    date: string;
  };
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface BusinessAnalytics {
  views: number;
  searchImpressions: number;
  calls: number;
  whatsappClicks: number;
  websiteClicks: number;
  leads: number;
  quoteRequests: number;
  quotesRequested?: number;
  bookings: number;
}

export interface Business {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  fullStory?: string;
  categoryId: string;
  categoryName: string;
  subcategoryId?: string;
  subcategoryName?: string;
  tags: string[];
  logoUrl: string;
  coverUrl: string;
  location: BusinessLocation;
  contact: BusinessContact;
  socials: BusinessSocials;
  hours: Record<DayOfWeek, BusinessHours>;
  yearsInBusiness: number;
  foundedYear: number;
  priceRange: PriceRange;
  verificationTier: VerificationTier;
  verifiedItems: string[];
  claimStatus: 'unclaimed' | 'claimed' | 'verified';
  credentials: CredentialItem[];
  services: ServiceItem[];
  products: ProductItem[];
  portfolio: PortfolioItem[];
  team: TeamMember[];
  faqs: FAQItem[];
  reviews: ReviewItem[];
  rating: number;
  reviewsCount: number;
  badges: string[];
  featured?: boolean;
  analytics: BusinessAnalytics;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  icon?: string;
  description: string;
  businessCount: number;
  popularServices: string[];
  subcategories: string[];
}

export interface Lead {
  id: string;
  businessId: string;
  businessName: string;
  type: 'quote' | 'inquiry' | 'booking';
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  message?: string;
  serviceOrProduct?: string;
  budget?: string;
  notes?: string;
  preferredDate?: string;
  preferredTime?: string;
  details?: {
    serviceId?: string;
    serviceName?: string;
    productId?: string;
    productName?: string;
    preferredDate?: string;
    preferredTime?: string;
    budget?: string;
    timeline?: string;
  };
  createdAt: string;
  status: 'new' | 'contacted' | 'in_progress' | 'closed';
}

export interface EventItem {
  id: string;
  businessId: string;
  businessName: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  imageUrl: string;
  category: string;
  admissionPrice?: string;
}

export interface OfferItem {
  id: string;
  businessId: string;
  businessName: string;
  title: string;
  discountTag: string;
  description: string;
  validUntil: string;
  code?: string;
  terms?: string;
}

export interface BusinessStory {
  id: string;
  businessId: string;
  businessName: string;
  title: string;
  subtitle: string;
  coverUrl: string;
  author: string;
  publishDate: string;
  readTime: string;
  content: string[];
}

export interface SearchFilterState {
  query: string;
  category: string;
  neighborhood: string;
  verificationTier: string;
  openNow: boolean;
  hasWhatsApp: boolean;
  hasServices: boolean;
  hasProducts: boolean;
  priceRange: string[];
  minRating: number;
  minYears: number;
  sortBy: 'relevance' | 'rating' | 'reviews' | 'years' | 'recently_added';
}

export interface AdminLogItem {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  adminUser?: string;
}
