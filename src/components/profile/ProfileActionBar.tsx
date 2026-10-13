import React from 'react';
import { useDirectory } from '../../context/DirectoryContext';
import { Business } from '../../types';
import { isBusinessOpen } from '../../utils/helpers';
import { useProfileActions } from './useProfileActions';
import { Clock, MapPin, Phone, MessageCircle, FileText, Calendar } from 'lucide-react';
import type { ProfileTab } from './profileTabs';

interface ProfileActionBarProps {
  business: Business;
  activeTab: ProfileTab;
  setActiveTab: (tab: ProfileTab) => void;
}

/** Sticky status/CTA bar plus the section navigation tabs below the cover banner. */
export const ProfileActionBar: React.FC<ProfileActionBarProps> = ({ business, activeTab, setActiveTab }) => {
  const { openLeadModal } = useDirectory();
  const { handlePhoneClick, handleWhatsAppGeneral } = useProfileActions(business);

  const openStatus = isBusinessOpen(business);

  const tabs: { id: ProfileTab; label: string }[] = [
    { id: 'overview', label: 'Overview & About' },
    { id: 'services', label: `Services (${business.services?.length || 0})` },
    { id: 'products', label: `Digital Shop / Catalog (${business.products?.length || 0})` },
    { id: 'portfolio', label: `Portfolio (${business.portfolio?.length || 0})` },
    { id: 'credentials', label: `Credentials & Trust (${business.credentials?.length || 0})` },
    { id: 'team', label: `Team & Story` },
    { id: 'reviews', label: `Reviews (${business.reviewsCount})` },
    { id: 'assistant', label: `AI Assistant (Ask Anything)` },
  ];

  return (
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
            <span>
              {business.location.address}, {business.location.neighborhood}
            </span>
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
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
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
  );
};
