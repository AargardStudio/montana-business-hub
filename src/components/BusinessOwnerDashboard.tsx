import React, { useState } from 'react';
import { useDirectory } from '../context/DirectoryContext';
import {
  Building2,
  Eye,
  CheckCircle2,
  Layers,
  ShoppingBag,
  FileText,
  Percent,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import { OwnerTelemetryCards } from './owner/OwnerTelemetryCards';
import { OwnerListingSection } from './owner/OwnerListingSection';
import { OwnerServicesSection } from './owner/OwnerServicesSection';
import { OwnerProductsSection } from './owner/OwnerProductsSection';
import { OwnerLeadsSection } from './owner/OwnerLeadsSection';
import { OwnerDealsSection } from './owner/OwnerDealsSection';
import { OwnerCredentialsSection } from './owner/OwnerCredentialsSection';

type OwnerTab = 'listing' | 'services' | 'products' | 'leads' | 'deals' | 'credentials';

/** Vendor control dashboard: thin orchestrator that switches between the owner/ section components. */
export const BusinessOwnerDashboard: React.FC = () => {
  const { businesses, leads, offers, openBusinessProfile, activeVendorBusinessId, setActiveVendorBusinessId } =
    useDirectory();

  // Selected vendor business
  const currentBusiness =
    businesses.find((b) => b.id === activeVendorBusinessId) ||
    businesses.find((b) => b.claimStatus === 'claimed') ||
    businesses[0];

  const businessId = currentBusiness?.id || 'b1';

  const [activeTab, setActiveTab] = useState<OwnerTab>('listing');

  // Feedback notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const myLeads = leads.filter((l) => l.businessId === businessId);
  const myDeals = offers.filter((o) => o.businessId === businessId);

  const TABS: { key: OwnerTab; label: string; icon: React.ElementType; count?: number }[] = [
    { key: 'listing', label: 'Control Listing & Branding', icon: Building2 },
    { key: 'services', label: `Digital Shop: Services (${currentBusiness.services?.length || 0})`, icon: Layers },
    { key: 'products', label: `Digital Shop: Products (${currentBusiness.products?.length || 0})`, icon: ShoppingBag },
    { key: 'leads', label: `Customer Leads & Inquiries (${myLeads.length})`, icon: FileText },
    { key: 'deals', label: `Local Deals & Promo Codes (${myDeals.length})`, icon: Percent },
    { key: 'credentials', label: 'Trust & Verified Credentials', icon: ShieldCheck },
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
                onChange={(e) => setActiveVendorBusinessId(e.target.value)}
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
      <OwnerTelemetryCards business={currentBusiness} />

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center overflow-x-auto gap-2 border-b border-stone-200 pb-2 mb-8 text-xs font-bold scrollbar-none">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === key
                ? 'bg-stone-900 text-amber-400 shadow-xs'
                : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
            }`}
          >
            <Icon size={14} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'listing' && <OwnerListingSection business={currentBusiness} showToast={showToast} />}
      {activeTab === 'services' && <OwnerServicesSection business={currentBusiness} showToast={showToast} />}
      {activeTab === 'products' && <OwnerProductsSection business={currentBusiness} showToast={showToast} />}
      {activeTab === 'leads' && <OwnerLeadsSection business={currentBusiness} showToast={showToast} />}
      {activeTab === 'deals' && <OwnerDealsSection business={currentBusiness} showToast={showToast} />}
      {activeTab === 'credentials' && <OwnerCredentialsSection business={currentBusiness} showToast={showToast} />}
    </div>
  );
};
