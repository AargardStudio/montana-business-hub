import React from 'react';
import { Business } from '../types';
import { useDirectory } from '../context/DirectoryContext';
import { TrustBadge } from './TrustBadge';
import { isBusinessOpen, getContextualWhatsAppUrl } from '../utils/helpers';
import {
  Star,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Bookmark,
  Scale,
  ArrowUpRight,
  Sparkles,
  CalendarCheck,
  BadgeCheck,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react';

interface BusinessCardProps {
  business: Business;
  compact?: boolean;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({ business, compact = false }) => {
  const {
    openBusinessProfile,
    savedBusinesses,
    toggleSaveBusiness,
    comparisonList,
    toggleCompare,
    trackInteraction,
    openLeadModal,
    openClaimModal,
  } = useDirectory();

  const openStatus = isBusinessOpen(business);
  const isSaved = savedBusinesses.includes(business.id);
  const isCompared = comparisonList.includes(business.id);

  // Profile is considered claimed if claimStatus is 'claimed' or 'verified',
  // or if not explicitly unclaimed and verificationTier is active.
  const isProfileClaimed =
    business.claimStatus === 'claimed' ||
    business.claimStatus === 'verified' ||
    (business.claimStatus !== 'unclaimed' && business.verificationTier !== 'unclaimed');

  const handleCardClick = () => {
    openBusinessProfile(business.id);
  };

  const handlePhoneClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    trackInteraction(business.id, 'calls');
    window.location.href = `tel:${business.contact.phone}`;
  };

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    trackInteraction(business.id, 'whatsappClicks');
    const url = getContextualWhatsAppUrl(business.contact.whatsapp, business.name);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSaveBusiness(business.id);
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleCompare(business.id);
  };

  const handleQuickQuote = (e: React.MouseEvent) => {
    e.stopPropagation();
    openLeadModal(business, 'quote');
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between cursor-pointer"
    >
      <div>
        {/* Cover Image & Badges */}
        <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-stone-100">
          <img
            src={business.coverUrl}
            alt={business.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Top Actions: Save & Compare */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
            <button
              onClick={handleCompareClick}
              title={isCompared ? 'Remove from comparison' : 'Add to compare'}
              className={`p-2 rounded-xl backdrop-blur-md transition-colors ${
                isCompared
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : 'bg-stone-900/60 text-white hover:bg-stone-900/80'
              }`}
            >
              <Scale size={15} />
            </button>

            <button
              onClick={handleSaveClick}
              title={isSaved ? 'Remove from saved' : 'Save business'}
              className={`p-2 rounded-xl backdrop-blur-md transition-colors ${
                isSaved
                  ? 'bg-amber-500 text-stone-950'
                  : 'bg-stone-900/60 text-white hover:bg-stone-900/80'
              }`}
            >
              <Bookmark size={15} className={isSaved ? 'fill-stone-950' : ''} />
            </button>
          </div>

          {/* Top Left: Verification Tier */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
            <TrustBadge
              tier={business.claimStatus === 'unclaimed' ? 'unclaimed' : business.verificationTier}
              verifiedItemsCount={business.verifiedItems?.length || 0}
            />
          </div>

          {/* Logo & Category */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white z-10">
            <div className="flex items-center gap-2.5">
              <img
                src={business.logoUrl}
                alt={`${business.name} logo`}
                className="w-11 h-11 rounded-xl object-cover border-2 border-white shadow-md bg-stone-900 shrink-0"
              />
              <div>
                <span className="inline-block text-[11px] font-semibold bg-stone-900/80 backdrop-blur-xs px-2 py-0.5 rounded text-amber-300 mb-0.5">
                  {business.categoryName}
                </span>
                <div className="flex items-center gap-1.5 text-xs text-stone-200">
                  <span className="flex items-center text-amber-400 font-bold">
                    <Star size={13} className="fill-amber-400 mr-0.5" />
                    {business.rating}
                  </span>
                  <span>({business.reviewsCount})</span>
                  <span>•</span>
                  <span>{business.priceRange}</span>
                </div>
              </div>
            </div>

            {/* Years in Business Badge */}
            <span className="text-[11px] font-medium bg-stone-900/80 px-2 py-0.5 rounded text-stone-200 backdrop-blur-xs">
              {business.yearsInBusiness} yrs in Bozeman
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1.5 flex-wrap min-w-0">
              <h3 className="font-heading text-lg font-bold text-stone-900 group-hover:text-amber-700 transition-colors line-clamp-1">
                {business.name}
              </h3>

              {/* Verified Badge Icon for Claimed Profiles */}
              {isProfileClaimed ? (
                <div className="relative group/verified inline-flex items-center">
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200/90 shadow-2xs hover:bg-sky-100 hover:border-sky-300 transition-colors shrink-0 cursor-help"
                    title="Verified Profile: Claimed and verified by business owner"
                  >
                    <BadgeCheck size={13} className="text-sky-600 fill-sky-100 shrink-0" />
                    <span>Verified</span>
                  </span>

                  {/* Trust Signal Hover Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover/verified:flex flex-col items-center z-30 pointer-events-none">
                    <div className="bg-stone-900 text-stone-100 text-[11px] font-normal px-2.5 py-1.5 rounded-lg shadow-xl whitespace-nowrap text-center leading-snug border border-stone-700">
                      <div className="font-semibold text-sky-300 flex items-center justify-center gap-1">
                        <BadgeCheck size={12} className="text-sky-400" />
                        <span>Verified & Claimed Profile</span>
                      </div>
                      <div className="text-[10px] text-stone-300 mt-0.5">
                        Business ownership & Bozeman credentials confirmed
                      </div>
                    </div>
                    <div className="w-2 h-2 bg-stone-900 rotate-45 -mt-1 border-r border-b border-stone-700" />
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openClaimModal(business.id);
                  }}
                  title="Unclaimed listing: Click to claim this business profile"
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-stone-100 hover:bg-amber-100 text-stone-600 hover:text-amber-900 border border-stone-200 hover:border-amber-300 transition-colors shrink-0 cursor-pointer"
                >
                  <HelpCircle size={11} className="text-stone-400" />
                  <span>Unclaimed • Claim</span>
                </button>
              )}
            </div>
            <ArrowUpRight size={18} className="text-stone-400 group-hover:text-amber-600 transition-colors shrink-0" />
          </div>

          <p className="text-xs text-stone-600 line-clamp-2 mb-3 leading-relaxed">
            {business.tagline || business.description}
          </p>

          {/* Trust Signal Bar */}
          {isProfileClaimed ? (
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 bg-emerald-50/70 border border-emerald-200/60 rounded-lg px-2.5 py-1 mb-2.5">
              <ShieldCheck size={13} className="text-emerald-600 shrink-0" />
              <span className="line-clamp-1 font-medium">
                Verified Profile • {business.verifiedItems?.[0] || 'Official Bozeman contact credentials verified'}
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-1.5 text-[11px] text-stone-500 bg-stone-50 border border-stone-200/80 rounded-lg px-2.5 py-1 mb-2.5">
              <div className="flex items-center gap-1.5 line-clamp-1">
                <HelpCircle size={13} className="text-stone-400 shrink-0" />
                <span>Unclaimed business profile</span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openClaimModal(business.id);
                }}
                className="text-amber-700 font-semibold hover:underline shrink-0 text-[10px] cursor-pointer"
              >
                Claim now →
              </button>
            </div>
          )}

          {/* Location and Open Hours Status */}
          <div className="space-y-1 text-xs text-stone-500 mb-3 border-t border-stone-100 pt-2.5">
            <div className="flex items-center gap-1.5">
              <MapPin size={13} className="text-stone-400 shrink-0" />
              <span className="line-clamp-1">
                {business.location.neighborhood} • {business.location.address}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Clock size={13} className="text-stone-400 shrink-0" />
              <span
                className={`font-medium ${
                  openStatus.isOpen ? 'text-emerald-700' : 'text-stone-500'
                }`}
              >
                {openStatus.text}
              </span>
            </div>
          </div>

          {/* Highlighted Services/Products Pills */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {business.services?.slice(0, 2).map((srv) => (
              <span
                key={srv.id}
                className="text-[11px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md font-medium"
              >
                {srv.name}
              </span>
            ))}
            {business.products?.slice(0, 1).map((prd) => (
              <span
                key={prd.id}
                className="text-[11px] bg-amber-50 text-amber-800 border border-amber-200/60 px-2 py-0.5 rounded-md font-medium"
              >
                Catalog: {prd.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 pt-0 border-t border-stone-100 mt-2">
        <div className="grid grid-cols-3 gap-1.5 pt-3">
          <button
            onClick={handlePhoneClick}
            className="flex items-center justify-center gap-1 bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium py-2 px-2 rounded-xl text-xs transition-colors cursor-pointer"
            title={`Call ${business.contact.formattedPhone}`}
          >
            <Phone size={13} className="text-stone-600" />
            <span>Call</span>
          </button>

          <button
            onClick={handleWhatsAppClick}
            className="flex items-center justify-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-medium py-2 px-2 rounded-xl text-xs transition-colors cursor-pointer"
            title="Chat via WhatsApp"
          >
            <MessageCircle size={13} className="text-emerald-600" />
            <span>WhatsApp</span>
          </button>

          <button
            onClick={handleQuickQuote}
            className="flex items-center justify-center gap-1 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-2 px-2 rounded-xl text-xs transition-colors cursor-pointer shadow-2xs"
          >
            <span>Inquire</span>
          </button>
        </div>
      </div>
    </div>
  );
};
