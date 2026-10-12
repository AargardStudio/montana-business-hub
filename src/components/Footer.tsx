import React from 'react';
import { useDirectory } from '../context/DirectoryContext';
import {
  Building2,
  Globe2,
  ShieldCheck,
  Award,
  Heart,
  ExternalLink,
  MessageCircle,
  Download,
  FolderArchive,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab, openClaimModal, updateFilter, closeBusinessProfile, openDownloadModal } = useDirectory();

  const handleCategoryClick = (catId: string) => {
    closeBusinessProfile();
    updateFilter('category', catId);
    setActiveTab('explore');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-850 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-850">
          {/* Column 1: Brand & Manifesto */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-stone-950 font-bold flex items-center justify-center text-base">
                BBH
              </div>
              <span className="font-heading font-extrabold text-xl text-white tracking-tight">
                Bozeman Business Hub
              </span>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              The premier digital business discovery, intelligence platform, and verified directory for Bozeman, Montana and the greater Gallatin Valley.
            </p>

            <div className="p-3 bg-stone-900/80 rounded-xl border border-stone-800 text-xs text-stone-400 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                <ShieldCheck size={14} />
                <span>Our Trust Standard</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                We believe in verified craftsmanship, real credentials, and direct communication without intermediary commissions.
              </p>
            </div>
          </div>

          {/* Column 2: Explore */}
          <div>
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider mb-4">
              Explore Bozeman
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    closeBusinessProfile();
                    setActiveTab('explore');
                  }}
                  className="text-stone-400 hover:text-amber-400 transition-colors"
                >
                  All Businesses
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    closeBusinessProfile();
                    setActiveTab('map');
                  }}
                  className="text-stone-400 hover:text-amber-400 transition-colors"
                >
                  Interactive Map
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    closeBusinessProfile();
                    setActiveTab('shop');
                  }}
                  className="text-stone-400 hover:text-amber-400 transition-colors"
                >
                  Products & Services Catalog
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    closeBusinessProfile();
                    setActiveTab('events');
                  }}
                  className="text-stone-400 hover:text-amber-400 transition-colors"
                >
                  Community Events & Deals
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    closeBusinessProfile();
                    setActiveTab('stories');
                  }}
                  className="text-stone-400 hover:text-amber-400 transition-colors"
                >
                  Founder Stories & Spotlights
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Top Categories */}
          <div>
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider mb-4">
              Top Industries
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => handleCategoryClick('contractors')}
                  className="text-stone-400 hover:text-amber-400 transition-colors"
                >
                  Contractors & Builders
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('restaurants')}
                  className="text-stone-400 hover:text-amber-400 transition-colors"
                >
                  Restaurants & Bakeries
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('outdoor')}
                  className="text-stone-400 hover:text-amber-400 transition-colors"
                >
                  Outdoor & Recreation
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('automotive')}
                  className="text-stone-400 hover:text-amber-400 transition-colors"
                >
                  Automotive & Diesel
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('retail')}
                  className="text-stone-400 hover:text-amber-400 transition-colors"
                >
                  Artisans & Retail
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: For Businesses & Global Network */}
          <div>
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider mb-4">
              For Businesses
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => openClaimModal()}
                  className="font-bold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1"
                >
                  <span>Claim Your Business</span>
                  <ExternalLink size={12} />
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('owner_dashboard');
                  }}
                  className="text-stone-400 hover:text-white transition-colors"
                >
                  Business Owner Portal
                </button>
              </li>
              <li>
                <button
                  onClick={openDownloadModal}
                  className="text-stone-300 hover:text-amber-400 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Download size={13} className="text-amber-400" />
                  <span>Download Project File (.ZIP / .JSON)</span>
                </button>
              </li>
              <li>
                <span className="text-stone-500 block pt-3 text-[11px] font-semibold uppercase tracking-wider">
                  Expanding Architecture:
                </span>
                <span className="text-stone-400 text-xs">
                  Missoula • Billings • Austin • Denver • Global
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} Bozeman Business Hub. Built for Gallatin County, Montana.</p>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              onClick={openDownloadModal}
              className="inline-flex items-center gap-1.5 text-stone-400 hover:text-amber-400 transition-colors cursor-pointer font-medium"
            >
              <Download size={12} className="text-amber-400" />
              <span>Download Project File</span>
            </button>
            <span>•</span>
            <span>Structured for Schema.org & Local SEO</span>
            <span>•</span>
            <span>Direct WhatsApp & Phone Routing</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
