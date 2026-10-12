import React, { useState } from 'react';
import { Business, ServiceItem, ProductItem, ReviewItem } from '../types';
import { useDirectory } from '../context/DirectoryContext';
import { TrustBadge } from './TrustBadge';
import { InteractiveMap } from './InteractiveMap';
import { isBusinessOpen, getContextualWhatsAppUrl, generateLocalBusinessSchema, formatTimeString } from '../utils/helpers';
import {
  Star,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Mail,
  Globe,
  Navigation,
  Bookmark,
  Scale,
  ArrowLeft,
  Share2,
  Calendar,
  FileText,
  Award,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Send,
  Camera,
  ExternalLink,
  ChevronDown,
  UserCheck,
  Layers,
  ShoppingBag,
  BadgeCheck,
} from 'lucide-react';

interface BusinessProfileViewProps {
  business: Business;
}

export const BusinessProfileView: React.FC<BusinessProfileViewProps> = ({ business }) => {
  const {
    closeBusinessProfile,
    savedBusinesses,
    toggleSaveBusiness,
    comparisonList,
    toggleCompare,
    trackInteraction,
    openLeadModal,
    submitReview,
  } = useDirectory();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'services' | 'products' | 'portfolio' | 'credentials' | 'team' | 'reviews' | 'assistant'
  >('overview');

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // AI Assistant Chat state
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiChatHistory, setAiChatHistory] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: `Hello! I am the AI Assistant for ${business.name}. Ask me any question about their services, products, hours, credentials, or pricing!`,
    },
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Review Form state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewSubmittedSuccess, setReviewSubmittedSuccess] = useState(false);

  const openStatus = isBusinessOpen(business);
  const isSaved = savedBusinesses.includes(business.id);
  const isCompared = comparisonList.includes(business.id);

  const isProfileClaimed =
    business.claimStatus === 'claimed' ||
    business.claimStatus === 'verified' ||
    (business.claimStatus !== 'unclaimed' && business.verificationTier !== 'unclaimed');

  // JSON-LD Schema
  const schemaJson = JSON.stringify(generateLocalBusinessSchema(business));

  const handlePhoneClick = () => {
    trackInteraction(business.id, 'calls');
    window.location.href = `tel:${business.contact.phone}`;
  };

  const handleWhatsAppGeneral = () => {
    trackInteraction(business.id, 'whatsappClicks');
    const url = getContextualWhatsAppUrl(business.contact.whatsapp, business.name, { type: 'general' });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleWhatsAppItem = (type: 'service' | 'product', itemName: string) => {
    trackInteraction(business.id, 'whatsappClicks');
    const url = getContextualWhatsAppUrl(business.contact.whatsapp, business.name, { type, itemName });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleWebsiteClick = () => {
    trackInteraction(business.id, 'websiteClicks');
    window.open(business.contact.website, '_blank', 'noopener,noreferrer');
  };

  const handleDirectionsClick = () => {
    const query = encodeURIComponent(`${business.name}, ${business.location.address}, Bozeman, MT`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank', 'noopener,noreferrer');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${business.name} | Bozeman Business Hub`,
        text: business.tagline,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Profile link copied to clipboard!');
    }
  };

  const handleAiAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim() || isAiLoading) return;

    const question = aiQuestion.trim();
    setAiQuestion('');
    setAiChatHistory((prev) => [...prev, { role: 'user', text: question }]);
    setIsAiLoading(true);

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ business, question }),
      });
      const data = await res.json();
      setAiChatHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: data.answer || "This information isn't currently listed on the business profile. Please contact the business directly.",
        },
      ]);
    } catch (err) {
      setAiChatHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `You can reach ${business.name} directly at ${business.contact.formattedPhone} or via WhatsApp.`,
        },
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;

    submitReview(business.id, {
      authorName: newReviewAuthor,
      rating: newReviewRating,
      comment: newReviewComment,
    });

    setReviewSubmittedSuccess(true);
    setTimeout(() => {
      setReviewSubmittedSuccess(false);
      setReviewModalOpen(false);
      setNewReviewAuthor('');
      setNewReviewComment('');
    }, 1500);
  };

  return (
    <div className="bg-stone-50 min-h-screen pb-16">
      {/* Embedded LocalBusiness Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson }} />

      {/* Top Breadcrumb & Return Bar */}
      <div className="bg-white border-b border-stone-200 py-3 sticky top-16 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <button
            onClick={closeBusinessProfile}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-stone-700 hover:text-stone-950 transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to Bozeman Directory</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleCompare(business.id)}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                isCompared
                  ? 'bg-amber-500 text-stone-950 border-amber-600'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-300'
              }`}
            >
              <Scale size={14} />
              <span>{isCompared ? 'Comparing' : 'Compare'}</span>
            </button>

            <button
              onClick={() => toggleSaveBusiness(business.id)}
              className={`p-2 rounded-lg text-xs border transition-colors cursor-pointer ${
                isSaved
                  ? 'bg-amber-500 text-stone-950 border-amber-600'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-300'
              }`}
              title="Save to Favorites"
            >
              <Bookmark size={15} className={isSaved ? 'fill-stone-950' : ''} />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-lg text-xs border border-stone-300 bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
              title="Share profile"
            >
              <Share2 size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Cover Banner */}
      <div className="relative h-64 sm:h-80 lg:h-96 w-full bg-stone-900 overflow-hidden">
        <img
          src={business.coverUrl}
          alt={business.name}
          className="w-full h-full object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

        <div className="absolute bottom-6 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex items-end gap-4">
            <img
              src={business.logoUrl}
              alt={`${business.name} logo`}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white shadow-xl bg-stone-900 shrink-0"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider bg-amber-500 text-stone-950 px-2.5 py-0.5 rounded-md">
                  {business.categoryName}
                </span>
                <TrustBadge tier={business.verificationTier} verifiedItemsCount={business.verifiedItems.length} size="sm" />
              </div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="font-heading text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  {business.name}
                </h1>
                {isProfileClaimed && (
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-400/40 shadow-xs"
                    title="Verified Profile: Claimed and verified by business owner"
                  >
                    <BadgeCheck size={14} className="text-sky-400 fill-sky-400/20" />
                    <span>Verified</span>
                  </span>
                )}
              </div>
              <p className="text-stone-300 text-xs sm:text-sm font-medium mt-0.5 line-clamp-1">
                {business.tagline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-stone-900/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-stone-700/80 text-xs">
            <div className="flex items-center text-amber-400 font-bold">
              <Star size={16} className="fill-amber-400 mr-1" />
              <span className="text-sm">{business.rating}</span>
            </div>
            <span className="text-stone-400">({business.reviewsCount} reviews)</span>
            <span className="text-stone-500">•</span>
            <span className="text-stone-200">{business.yearsInBusiness} yrs in business</span>
          </div>
        </div>
      </div>

      {/* Main Sticky Action Bar */}
      <div className="bg-white border-b border-stone-200 shadow-sm sticky top-[105px] z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Status & Location quick text */}
          <div className="flex items-center gap-4 text-xs text-stone-600">
            <div className="flex items-center gap-1.5">
              <Clock size={15} className={openStatus.isOpen ? 'text-emerald-600' : 'text-stone-400'} />
              <span className={`font-semibold ${openStatus.isOpen ? 'text-emerald-700' : 'text-stone-600'}`}>
                {openStatus.text}
              </span>
            </div>
            <span className="hidden sm:inline text-stone-300">•</span>
            <div className="hidden sm:flex items-center gap-1.5">
              <MapPin size={15} className="text-stone-400" />
              <span>{business.location.address}, {business.location.neighborhood}</span>
            </div>
          </div>

          {/* Primary CTA Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handlePhoneClick}
              className="inline-flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold px-3.5 py-2 rounded-xl text-xs transition-colors cursor-pointer"
            >
              <Phone size={14} className="text-stone-600" />
              <span>Call Now</span>
            </button>

            <button
              onClick={handleWhatsAppGeneral}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
            >
              <MessageCircle size={14} />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={() => openLeadModal(business, 'quote')}
              className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
            >
              <FileText size={14} />
              <span>Request Quote</span>
            </button>

            <button
              onClick={() => openLeadModal(business, 'booking')}
              className="inline-flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold px-3.5 py-2 rounded-xl text-xs transition-colors cursor-pointer"
            >
              <Calendar size={14} />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto gap-1 text-xs font-semibold border-t border-stone-100 pt-1 pb-1 scrollbar-none">
          {[
            { id: 'overview', label: 'Overview & About' },
            { id: 'services', label: `Services (${business.services?.length || 0})` },
            { id: 'products', label: `Digital Shop / Catalog (${business.products?.length || 0})` },
            { id: 'portfolio', label: `Portfolio (${business.portfolio?.length || 0})` },
            { id: 'credentials', label: `Credentials & Trust (${business.credentials?.length || 0})` },
            { id: 'team', label: `Team & Story` },
            { id: 'reviews', label: `Reviews (${business.reviewsCount})` },
            { id: 'assistant', label: `AI Assistant (Ask Anything)` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-amber-50 text-amber-900 font-bold border-b-2 border-amber-600'
                  : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Left Column (Content according to tab) */}
          <div className="lg:col-span-8 space-y-8">
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* About Card */}
                <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-7 shadow-xs">
                  <h2 className="font-heading text-xl font-bold text-stone-900 mb-3">About {business.name}</h2>
                  <p className="text-stone-700 leading-relaxed text-sm whitespace-pre-line mb-6">
                    {business.description}
                  </p>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-stone-100 pt-5">
                    <div className="bg-stone-50 p-3 rounded-xl">
                      <span className="block text-[11px] text-stone-500 uppercase font-semibold">Founded</span>
                      <strong className="text-stone-900 text-sm">{business.foundedYear} ({business.yearsInBusiness} yrs)</strong>
                    </div>
                    <div className="bg-stone-50 p-3 rounded-xl">
                      <span className="block text-[11px] text-stone-500 uppercase font-semibold">Price Range</span>
                      <strong className="text-stone-900 text-sm">{business.priceRange}</strong>
                    </div>
                    <div className="bg-stone-50 p-3 rounded-xl">
                      <span className="block text-[11px] text-stone-500 uppercase font-semibold">Neighborhood</span>
                      <strong className="text-stone-900 text-sm truncate block">{business.location.neighborhood}</strong>
                    </div>
                    <div className="bg-stone-50 p-3 rounded-xl">
                      <span className="block text-[11px] text-stone-500 uppercase font-semibold">Verification</span>
                      <strong className="text-emerald-700 text-sm capitalize">{business.verificationTier.replace('_', ' ')}</strong>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mt-5">
                    {business.badges?.map((badge) => (
                      <span
                        key={badge}
                        className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-900 border border-amber-200/80 px-2.5 py-1 rounded-full font-medium"
                      >
                        <CheckCircle2 size={13} className="text-amber-600" />
                        <span>{badge}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Popular Services Teaser */}
                {business.services && business.services.length > 0 && (
                  <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-7 shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-heading text-lg font-bold text-stone-900">Featured Services</h3>
                      <button
                        onClick={() => setActiveTab('services')}
                        className="text-xs text-amber-700 hover:text-amber-800 font-bold"
                      >
                        View All Services →
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {business.services.slice(0, 2).map((srv) => (
                        <div key={srv.id} className="border border-stone-200 rounded-xl p-4 flex flex-col justify-between hover:border-amber-400 transition-colors">
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className="font-bold text-stone-900 text-sm">{srv.name}</h4>
                              {srv.price && (
                                <span className="text-xs font-extrabold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                                  {srv.priceType === 'starting_at' ? `From $${srv.price}` : `$${srv.price}`}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-stone-600 line-clamp-2 mb-3">{srv.description}</p>
                          </div>
                          <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                            <button
                              onClick={() => openLeadModal(business, 'quote', { type: 'service', id: srv.id, name: srv.name })}
                              className="flex-1 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 py-1.5 rounded-lg text-center"
                            >
                              Request Quote
                            </button>
                            <button
                              onClick={() => handleWhatsAppItem('service', srv.name)}
                              className="px-2.5 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg hover:bg-emerald-100"
                              title="Ask on WhatsApp"
                            >
                              <MessageCircle size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Products Teaser */}
                {business.products && business.products.length > 0 && (
                  <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-7 shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-heading text-lg font-bold text-stone-900">Featured Digital Catalog Products</h3>
                      <button
                        onClick={() => setActiveTab('products')}
                        className="text-xs text-amber-700 hover:text-amber-800 font-bold"
                      >
                        View Full Catalog →
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {business.products.slice(0, 2).map((prd) => (
                        <div key={prd.id} className="border border-stone-200 rounded-xl overflow-hidden flex flex-col justify-between">
                          <img src={prd.imageUrl} alt={prd.name} className="h-36 w-full object-cover" />
                          <div className="p-4">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className="font-bold text-stone-900 text-sm">{prd.name}</h4>
                              <span className="text-xs font-extrabold text-stone-900">
                                {prd.price ? `$${prd.price}` : 'Inquire for price'}
                              </span>
                            </div>
                            <p className="text-xs text-stone-600 line-clamp-2 mb-3">{prd.description}</p>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openLeadModal(business, 'inquiry', { type: 'product', id: prd.id, name: prd.name })}
                                className="flex-1 text-xs font-bold bg-stone-900 hover:bg-stone-800 text-white py-1.5 rounded-lg"
                              >
                                Ask About Product
                              </button>
                              <button
                                onClick={() => handleWhatsAppItem('product', prd.name)}
                                className="px-2.5 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg hover:bg-emerald-100"
                              >
                                <MessageCircle size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* FAQs Accordion */}
                {business.faqs && business.faqs.length > 0 && (
                  <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-7 shadow-xs">
                    <h3 className="font-heading text-lg font-bold text-stone-900 mb-4">Frequently Asked Questions</h3>
                    <div className="space-y-3">
                      {business.faqs.map((faq, idx) => (
                        <div key={idx} className="border border-stone-200 rounded-xl overflow-hidden">
                          <button
                            onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                            className="w-full text-left p-4 text-xs sm:text-sm font-bold text-stone-900 flex items-center justify-between hover:bg-stone-50 transition-colors"
                          >
                            <span>{faq.question}</span>
                            <ChevronDown
                              size={16}
                              className={`text-stone-500 transition-transform ${openFaqIndex === idx ? 'rotate-180' : ''}`}
                            />
                          </button>
                          {openFaqIndex === idx && (
                            <div className="p-4 pt-0 text-xs sm:text-sm text-stone-600 bg-stone-50/50 border-t border-stone-100 leading-relaxed">
                              {faq.answer}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SERVICES CATALOG TAB */}
            {activeTab === 'services' && (
              <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-6">
                <div>
                  <h2 className="font-heading text-xl font-bold text-stone-900 mb-1">Services Catalog</h2>
                  <p className="text-xs text-stone-500">
                    Explore available services, durations, pricing estimates, and request an itemized quote.
                  </p>
                </div>

                {(!business.services || business.services.length === 0) ? (
                  <p className="text-xs text-stone-500 py-8 text-center">No individual services listed currently.</p>
                ) : (
                  <div className="space-y-4">
                    {business.services.map((srv) => (
                      <div
                        key={srv.id}
                        className="border border-stone-200 rounded-xl p-5 hover:border-amber-400 hover:shadow-xs transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-start gap-4">
                          {srv.imageUrl && (
                            <img
                              src={srv.imageUrl}
                              alt={srv.name}
                              className="w-16 h-16 rounded-xl object-cover shrink-0 hidden sm:block"
                            />
                          )}
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-stone-900 text-sm sm:text-base">{srv.name}</h3>
                              {srv.popular && (
                                <span className="text-[10px] uppercase font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                                  Popular
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-stone-600 mb-2 leading-relaxed">{srv.description}</p>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
                              {srv.duration && <span>⏱ Duration: {srv.duration}</span>}
                              {srv.category && <span>📁 {srv.category}</span>}
                            </div>
                          </div>
                        </div>

                        <div className="w-full sm:w-auto text-left sm:text-right shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-100 flex sm:flex-col items-center sm:items-end justify-between gap-2">
                          <div>
                            <div className="text-sm sm:text-base font-extrabold text-stone-900">
                              {srv.price
                                ? `${srv.priceType === 'starting_at' ? 'Starting at ' : ''}$${srv.price}`
                                : 'Contact for estimate'}
                            </div>
                            {srv.priceUnit && (
                              <div className="text-[11px] text-stone-400 font-medium">/{srv.priceUnit}</div>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openLeadModal(business, 'quote', { type: 'service', id: srv.id, name: srv.name })}
                              className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-3.5 py-1.5 rounded-lg text-xs transition-colors"
                            >
                              Request Quote
                            </button>
                            <button
                              onClick={() => handleWhatsAppItem('service', srv.name)}
                              className="p-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg hover:bg-emerald-100"
                              title="Ask on WhatsApp"
                            >
                              <MessageCircle size={15} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* DIGITAL SHOP / PRODUCTS TAB */}
            {activeTab === 'products' && (
              <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-6">
                <div>
                  <h2 className="font-heading text-xl font-bold text-stone-900 mb-1">
                    Digital Shop & Product Catalog
                  </h2>
                  <p className="text-xs text-stone-500">
                    Browse locally crafted goods and inventory. Inquire directly or connect on WhatsApp without shopping cart friction.
                  </p>
                </div>

                {(!business.products || business.products.length === 0) ? (
                  <p className="text-xs text-stone-500 py-8 text-center">No physical products listed currently.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {business.products.map((prd) => (
                      <div
                        key={prd.id}
                        className="border border-stone-200 rounded-xl overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
                      >
                        <div className="relative h-48 w-full bg-stone-100">
                          <img src={prd.imageUrl} alt={prd.name} className="w-full h-full object-cover" />
                          <div className="absolute top-2.5 right-2.5 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded">
                            {prd.availability.replace('_', ' ')}
                          </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h3 className="font-bold text-stone-900 text-base">{prd.name}</h3>
                              <span className="text-sm font-extrabold text-amber-800">
                                {prd.price ? `$${prd.price}` : 'Contact for price'}
                              </span>
                            </div>

                            {prd.sku && (
                              <span className="text-[10px] text-stone-400 font-mono block mb-2">SKU: {prd.sku}</span>
                            )}

                            <p className="text-xs text-stone-600 mb-3 leading-relaxed">{prd.description}</p>

                            {/* Specs list */}
                            {prd.specs && Object.keys(prd.specs).length > 0 && (
                              <div className="bg-stone-50 p-2.5 rounded-lg text-[11px] space-y-1 mb-4">
                                {Object.entries(prd.specs).map(([k, v]) => (
                                  <div key={k} className="flex justify-between">
                                    <span className="text-stone-500">{k}:</span>
                                    <strong className="text-stone-800">{v}</strong>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-stone-100">
                            <button
                              onClick={() => openLeadModal(business, 'inquiry', { type: 'product', id: prd.id, name: prd.name })}
                              className="bg-stone-900 hover:bg-stone-800 text-white font-bold py-2 px-3 rounded-lg text-xs text-center"
                            >
                              Ask About Product
                            </button>
                            <button
                              onClick={() => handleWhatsAppItem('product', prd.name)}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5"
                            >
                              <MessageCircle size={14} />
                              <span>WhatsApp</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PORTFOLIO TAB */}
            {activeTab === 'portfolio' && (
              <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-6">
                <div>
                  <h2 className="font-heading text-xl font-bold text-stone-900 mb-1">Visual Portfolio & Completed Work</h2>
                  <p className="text-xs text-stone-500">
                    Real proof of craftsmanship, past builds, and local projects completed across Gallatin Valley.
                  </p>
                </div>

                {(!business.portfolio || business.portfolio.length === 0) ? (
                  <p className="text-xs text-stone-500 py-8 text-center">Portfolio gallery is being updated.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {business.portfolio.map((item) => (
                      <div key={item.id} className="border border-stone-200 rounded-xl overflow-hidden shadow-2xs">
                        <img src={item.imageUrl} alt={item.title} className="h-56 w-full object-cover" />
                        <div className="p-5">
                          <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                            {item.category}
                          </span>
                          <h3 className="font-heading font-bold text-base text-stone-900 mt-2 mb-1.5">
                            {item.title}
                          </h3>
                          <p className="text-xs text-stone-600 leading-relaxed mb-3">
                            {item.description}
                          </p>
                          <div className="flex items-center justify-between text-[11px] text-stone-400 border-t border-stone-100 pt-2">
                            {item.clientType && <span>Client: {item.clientType}</span>}
                            {item.completedDate && <span>Completed: {item.completedDate}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* CREDENTIALS TAB */}
            {activeTab === 'credentials' && (
              <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-6">
                <div>
                  <h2 className="font-heading text-xl font-bold text-stone-900 mb-1">Credentials, Licenses & Trust Verification</h2>
                  <p className="text-xs text-stone-500">
                    Documented state licenses, liability insurance, trade certifications, and verified accreditations.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {business.credentials?.map((cred) => (
                    <div
                      key={cred.id}
                      className="border border-stone-200 rounded-xl p-4 sm:p-5 flex items-start gap-3 bg-stone-50/50"
                    >
                      <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
                        <Award size={20} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="font-bold text-stone-900 text-sm sm:text-base">{cred.title}</h3>
                          {cred.verified && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                              <ShieldCheck size={12} /> Verified
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-600">Issued by: <strong>{cred.issuer}</strong></p>
                        {cred.credentialNumber && (
                          <span className="text-[11px] text-stone-500 font-mono block mt-1">
                            License / Reg #: {cred.credentialNumber}
                          </span>
                        )}
                        <div className="flex gap-4 text-[11px] text-stone-400 mt-2">
                          {cred.issueDate && <span>Issued: {cred.issueDate}</span>}
                          {cred.expirationDate && <span>Expires: {cred.expirationDate}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Platform Verification Checklist */}
                <div className="border border-emerald-200 bg-emerald-50/40 rounded-xl p-5">
                  <h4 className="font-bold text-emerald-950 text-sm mb-2 flex items-center gap-1.5">
                    <ShieldCheck size={16} className="text-emerald-700" />
                    Verified Items on File with Bozeman Business Hub:
                  </h4>
                  <ul className="space-y-1 text-xs text-emerald-900">
                    {business.verifiedItems.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* TEAM TAB */}
            {activeTab === 'team' && (
              <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-6">
                <div>
                  <h2 className="font-heading text-xl font-bold text-stone-900 mb-1">Founder & Key Leadership</h2>
                  <p className="text-xs text-stone-500">
                    The local Bozeman artisans, technicians, and founders behind the business.
                  </p>
                </div>

                {/* Full Story text if present */}
                {business.fullStory && (
                  <div className="bg-amber-50/40 border border-amber-200/60 rounded-xl p-5 mb-6">
                    <h3 className="font-heading font-bold text-stone-900 text-sm mb-2">The Founder's Journey</h3>
                    <p className="text-xs text-stone-700 leading-relaxed whitespace-pre-line">
                      {business.fullStory}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {business.team?.map((member) => (
                    <div key={member.id} className="border border-stone-200 rounded-xl p-4 flex gap-4 items-start">
                      <img
                        src={member.imageUrl}
                        alt={member.name}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 bg-stone-100"
                      />
                      <div>
                        <h4 className="font-bold text-stone-900 text-sm">{member.name}</h4>
                        <span className="text-xs text-amber-800 font-semibold block mb-1">{member.role}</span>
                        <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">{member.bio}</p>
                        {member.yearsWithBusiness && (
                          <span className="text-[10px] text-stone-400 mt-2 block">
                            {member.yearsWithBusiness} years with company
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* REVIEWS TAB */}
            {activeTab === 'reviews' && (
              <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-heading text-xl font-bold text-stone-900 mb-1">Customer Reviews & Testimonials</h2>
                    <p className="text-xs text-stone-500">
                      Verified customer feedback from Bozeman residents and clients.
                    </p>
                  </div>
                  <button
                    onClick={() => setReviewModalOpen(true)}
                    className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-3.5 py-2 rounded-xl text-xs transition-colors"
                  >
                    Write a Review
                  </button>
                </div>

                {/* Score Header */}
                <div className="bg-stone-50 rounded-xl p-5 flex items-center gap-6 border border-stone-200">
                  <div className="text-center">
                    <span className="text-4xl font-extrabold text-stone-900 block">{business.rating}</span>
                    <div className="flex justify-center text-amber-400 my-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className="fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs text-stone-500">{business.reviewsCount} reviews</span>
                  </div>
                  <div className="border-l border-stone-200 pl-6 text-xs text-stone-600 space-y-1">
                    <p>✓ 100% Verified customer review checks</p>
                    <p>✓ Business owner moderation rights with transparent responses</p>
                    <p>✓ Zero anonymous spam or paid ratings manipulation</p>
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                  {business.reviews?.map((r) => (
                    <div key={r.id} className="border border-stone-200 rounded-xl p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center font-bold text-stone-700 text-xs">
                            {r.authorName[0]}
                          </div>
                          <div>
                            <span className="font-bold text-stone-900 text-sm block">{r.authorName}</span>
                            <div className="flex items-center gap-1.5 text-xs text-stone-400">
                              <div className="flex text-amber-400">
                                {[...Array(r.rating)].map((_, i) => (
                                  <Star key={i} size={11} className="fill-amber-400" />
                                ))}
                              </div>
                              <span>•</span>
                              <span>{r.date}</span>
                            </div>
                          </div>
                        </div>

                        {r.verifiedCustomer && (
                          <span className="text-[11px] bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                            Verified Customer
                          </span>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">{r.comment}</p>

                      {/* Owner Response */}
                      {r.response && (
                        <div className="bg-stone-50 border-l-2 border-amber-500 p-3 rounded-r-lg text-xs space-y-1 mt-2">
                          <span className="font-bold text-stone-900">Response from {business.name}:</span>
                          <p className="text-stone-600">{r.response.text}</p>
                          <span className="text-[10px] text-stone-400 block">{r.response.date}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI ASSISTANT TAB */}
            {activeTab === 'assistant' && (
              <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-900 px-2.5 py-1 rounded-full text-xs font-semibold mb-2">
                    <Sparkles size={14} className="text-amber-600" />
                    <span>AI Profile Assistant</span>
                  </div>
                  <h2 className="font-heading text-xl font-bold text-stone-900 mb-1">
                    Ask About {business.name}
                  </h2>
                  <p className="text-xs text-stone-500">
                    Answers are strictly verified and grounded in {business.name}’s official profile, services, and credentials.
                  </p>
                </div>

                {/* Chat History Box */}
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 h-80 overflow-y-auto space-y-3">
                  {aiChatHistory.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-amber-500 text-stone-950 font-medium rounded-br-none'
                            : 'bg-white border border-stone-200 text-stone-800 rounded-bl-none shadow-2xs'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isAiLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-stone-200 text-stone-500 text-xs px-4 py-2.5 rounded-2xl rounded-bl-none flex items-center gap-2">
                        <Sparkles size={14} className="animate-spin text-amber-500" />
                        <span>Checking business facts...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Query Input */}
                <form onSubmit={handleAiAsk} className="flex gap-2">
                  <input
                    type="text"
                    value={aiQuestion}
                    onChange={(e) => setAiQuestion(e.target.value)}
                    placeholder={`Ask: "Do they work outside Bozeman?", "What are their hours?", "How do I request a quote?"`}
                    className="flex-1 bg-stone-50 border border-stone-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm outline-hidden focus:border-amber-500"
                  />
                  <button
                    type="submit"
                    disabled={isAiLoading || !aiQuestion.trim()}
                    className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Send</span>
                    <Send size={14} />
                  </button>
                </form>

                <div className="flex flex-wrap gap-1.5 text-xs text-stone-500">
                  <span className="font-semibold">Quick questions:</span>
                  {[
                    'What services do they offer?',
                    'Are they open today?',
                    'How long have they been in business?',
                    'How can I message on WhatsApp?',
                  ].map((q) => (
                    <button
                      key={q}
                      onClick={() => {
                        setAiQuestion(q);
                      }}
                      className="bg-stone-100 hover:bg-stone-200 px-2 py-0.5 rounded text-[11px] text-stone-700 cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Contact, Location Map & Hours */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Contact Card */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
              <h3 className="font-heading text-base font-bold text-stone-900 border-b border-stone-100 pb-3">
                Contact & Communication
              </h3>

              <div className="space-y-3 text-xs">
                <a
                  href={`tel:${business.contact.phone}`}
                  onClick={() => trackInteraction(business.id, 'calls')}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-800 transition-colors"
                >
                  <span className="flex items-center gap-2 font-medium">
                    <Phone size={15} className="text-amber-600" />
                    <span>{business.contact.formattedPhone}</span>
                  </span>
                  <span className="text-stone-400 font-bold">Call</span>
                </a>

                <button
                  onClick={handleWhatsAppGeneral}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2 font-medium">
                    <MessageCircle size={15} className="text-emerald-600" />
                    <span>WhatsApp Direct Chat</span>
                  </span>
                  <span className="font-bold text-emerald-700">Open</span>
                </button>

                <a
                  href={`mailto:${business.contact.email}`}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-800 transition-colors"
                >
                  <span className="flex items-center gap-2 font-medium">
                    <Mail size={15} className="text-stone-500" />
                    <span className="truncate max-w-[180px]">{business.contact.email}</span>
                  </span>
                  <span className="text-stone-400 font-bold">Email</span>
                </a>

                <button
                  onClick={handleWebsiteClick}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-800 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2 font-medium">
                    <Globe size={15} className="text-stone-500" />
                    <span>Official Website</span>
                  </span>
                  <ExternalLink size={13} className="text-stone-400" />
                </button>
              </div>

              {/* Lead Request Action */}
              <button
                onClick={() => openLeadModal(business, 'inquiry')}
                className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-2.5 rounded-xl text-xs transition-colors shadow-2xs cursor-pointer"
              >
                Send Direct Inquiry
              </button>
            </div>

            {/* Location & Interactive Mini Map */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="font-heading text-base font-bold text-stone-900">Location</h3>
                <button
                  onClick={handleDirectionsClick}
                  className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
                >
                  <Navigation size={13} />
                  <span>Directions</span>
                </button>
              </div>

              <p className="text-xs text-stone-700 font-medium leading-relaxed">
                {business.location.address}<br />
                {business.location.neighborhood}, {business.location.city}, {business.location.state} {business.location.postalCode}
              </p>

              {/* Mini Leaflet Map */}
              <InteractiveMap
                businesses={[business]}
                heightClass="h-44"
                selectedBusinessId={business.id}
              />
            </div>

            {/* Operating Hours Table */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-3">
              <h3 className="font-heading text-base font-bold text-stone-900 border-b border-stone-100 pb-3">
                Opening Hours
              </h3>
              <div className="space-y-1.5 text-xs">
                {(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const).map((day) => {
                  const h = business.hours[day];
                  return (
                    <div key={day} className="flex justify-between py-1 border-b border-stone-50 capitalize">
                      <span className="text-stone-600 font-medium">{day}</span>
                      <span className="font-semibold text-stone-900">
                        {h?.closed ? 'Closed' : `${formatTimeString(h.open)} - ${formatTimeString(h.close)}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-heading font-bold text-lg text-stone-900">Write a Review for {business.name}</h3>
            {reviewSubmittedSuccess ? (
              <div className="py-8 text-center text-emerald-700 font-bold text-sm">
                ✓ Thank you! Your review has been submitted and published.
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={newReviewAuthor}
                    onChange={(e) => setNewReviewAuthor(e.target.value)}
                    placeholder="e.g. Jessica Miller"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReviewRating(star)}
                        className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1 ${
                          newReviewRating >= star ? 'bg-amber-500 text-stone-950' : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        <Star size={14} className={newReviewRating >= star ? 'fill-stone-950' : ''} />
                        <span>{star}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Review</label>
                  <textarea
                    required
                    rows={4}
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    placeholder="Describe your experience with their services or products..."
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-xs"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReviewModalOpen(false)}
                    className="flex-1 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
