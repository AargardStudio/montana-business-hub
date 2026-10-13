import React, { useState } from 'react';
import { useDirectory } from '../context/DirectoryContext';
import {
  Compass,
  MapPin,
  Layers,
  ShoppingBag,
  Calendar,
  BookOpen,
  Bookmark,
  Scale,
  Menu,
  X,
  Building2,
  ChevronDown,
  ShieldCheck,
  UserCheck,
  Globe2,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    closeBusinessProfile,
    selectedBusinessId,
    comparisonList,
    setIsComparisonModalOpen,
    savedBusinesses,
    openClaimModal,
    userRole,
    setUserRole,
    selectedCity,
    setSelectedCity,
  } = useDirectory();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const CITIES = [
    { name: 'Bozeman, Montana', label: 'Bozeman, MT (Active Hub)', active: true },
    { name: 'Missoula, Montana', label: 'Missoula, MT (Expanding)', active: false },
    { name: 'Billings, Montana', label: 'Billings, MT (Expanding)', active: false },
    { name: 'Denver, Colorado', label: 'Denver, CO (Future)', active: false },
    { name: 'Austin, Texas', label: 'Austin, TX (Future)', active: false },
    { name: 'Global Business Hub', label: 'Global Business Hub (Network)', active: false },
  ];

  const handleNavClick = (tab: any) => {
    closeBusinessProfile();
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-stone-900 text-stone-100 border-b border-stone-800 shadow-md">
      {/* Top micro-bar with City Selector and Global expansion note */}
      <div className="bg-stone-950 px-4 py-1 text-xs text-stone-400 border-b border-stone-850 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe2 size={13} className="text-amber-500" />
          <span className="text-stone-300 font-medium">Digital Business Network:</span>
          {/* City Selector */}
          <div className="relative inline-block">
            <button
              onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
              className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold cursor-pointer py-0.5 px-1 rounded transition-colors"
            >
              <span>{selectedCity}</span>
              <ChevronDown size={12} />
            </button>

            {cityDropdownOpen && (
              <div className="absolute left-0 mt-1 w-56 bg-stone-900 border border-stone-700 rounded-lg shadow-2xl py-1 z-50 text-stone-200">
                <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-stone-400 border-b border-stone-800">
                  Select Regional Hub
                </div>
                {CITIES.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => {
                      setSelectedCity(c.name);
                      setCityDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-stone-800 transition-colors ${
                      selectedCity === c.name ? 'text-amber-400 font-semibold bg-stone-800/60' : 'text-stone-300'
                    }`}
                  >
                    <span>{c.label}</span>
                    {selectedCity === c.name && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Demo Disclaimer & Role Indicator */}
        <div className="hidden sm:flex items-center gap-3">
          <span className="bg-stone-800 text-stone-300 px-2 py-0.5 rounded text-[11px] font-mono">
            Demo Architecture Ready for Global Scaling
          </span>

          {/* Quick Persona Switcher */}
          <div className="relative inline-block">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="inline-flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 px-2.5 py-0.5 rounded text-xs transition-colors cursor-pointer"
            >
              {userRole === 'visitor' && <UserCheck size={12} className="text-emerald-400" />}
              {userRole === 'business_owner' && <Building2 size={12} className="text-amber-400" />}
              {userRole === 'admin' && <ShieldCheck size={12} className="text-purple-400" />}
              <span>
                Mode: <strong className="capitalize">{userRole.replace('_', ' ')}</strong>
              </span>
              <ChevronDown size={11} />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-stone-900 border border-stone-700 rounded-lg shadow-xl py-1 z-50 text-stone-200">
                <div className="px-3 py-1 text-[11px] font-semibold text-stone-400 uppercase tracking-wider border-b border-stone-800">
                  Switch User Persona
                </div>
                <button
                  onClick={() => {
                    setUserRole('visitor');
                    setRoleDropdownOpen(false);
                    if (activeTab === 'owner_dashboard' || activeTab === 'admin_dashboard') setActiveTab('explore');
                  }}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-stone-800 flex items-center gap-2 ${
                    userRole === 'visitor' ? 'text-emerald-400 font-bold' : ''
                  }`}
                >
                  <UserCheck size={14} /> Visitor View
                </button>
                <button
                  onClick={() => {
                    setUserRole('business_owner');
                    setActiveTab('owner_dashboard');
                    closeBusinessProfile();
                    setRoleDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-stone-800 flex items-center gap-2 ${
                    userRole === 'business_owner' ? 'text-amber-400 font-bold' : ''
                  }`}
                >
                  <Building2 size={14} /> Business Owner Portal
                </button>
                <button
                  onClick={() => {
                    setUserRole('admin');
                    setActiveTab('admin_dashboard');
                    closeBusinessProfile();
                    setRoleDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-stone-800 flex items-center gap-2 ${
                    userRole === 'admin' ? 'text-purple-400 font-bold' : ''
                  }`}
                >
                  <ShieldCheck size={14} /> Platform Administrator
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => handleNavClick('explore')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center text-stone-950 font-bold text-lg shadow-md group-hover:scale-105 transition-transform">
                <span>BBH</span>
              </div>
              <div>
                <div className="font-heading font-extrabold text-lg sm:text-xl text-white tracking-tight flex items-center gap-1.5">
                  <span>Bozeman Business Hub</span>
                  <span className="hidden md:inline-block text-[10px] uppercase font-bold bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/30">
                    MT
                  </span>
                </div>
                <p className="text-[11px] text-stone-400 hidden sm:block">
                  Verified Local Discovery & Digital Catalog
                </p>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1 ml-4 text-sm font-medium">
              <button
                onClick={() => handleNavClick('explore')}
                className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'explore' && !selectedBusinessId
                    ? 'bg-stone-800 text-amber-400'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                }`}
              >
                <Compass size={16} />
                <span>Explore</span>
              </button>

              <button
                onClick={() => handleNavClick('categories')}
                className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'categories'
                    ? 'bg-stone-800 text-amber-400'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                }`}
              >
                <Layers size={16} />
                <span>Categories</span>
              </button>

              <button
                onClick={() => handleNavClick('map')}
                className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'map'
                    ? 'bg-stone-800 text-amber-400'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                }`}
              >
                <MapPin size={16} />
                <span>Local Map</span>
              </button>

              <button
                onClick={() => handleNavClick('shop')}
                className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'shop'
                    ? 'bg-stone-800 text-amber-400'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                }`}
              >
                <ShoppingBag size={16} />
                <span>Products & Services</span>
              </button>

              <button
                onClick={() => handleNavClick('events')}
                className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'events'
                    ? 'bg-stone-800 text-amber-400'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                }`}
              >
                <Calendar size={16} />
                <span>Events & Deals</span>
              </button>

              <button
                onClick={() => handleNavClick('stories')}
                className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'stories'
                    ? 'bg-stone-800 text-amber-400'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                }`}
              >
                <BookOpen size={16} />
                <span>Stories</span>
              </button>
            </nav>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Comparison button */}
            {comparisonList.length > 0 && (
              <button
                onClick={() => setIsComparisonModalOpen(true)}
                className="relative inline-flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-amber-400 px-3 py-1.5 rounded-lg text-xs font-semibold border border-amber-500/40 transition-colors cursor-pointer animate-pulse"
              >
                <Scale size={14} />
                <span>Compare ({comparisonList.length})</span>
              </button>
            )}

            {/* Saved businesses count */}
            {savedBusinesses.length > 0 && (
              <button
                onClick={() => handleNavClick('explore')}
                className="hidden sm:inline-flex items-center gap-1 text-stone-300 hover:text-white text-xs px-2.5 py-1.5 rounded-lg bg-stone-800/60"
                title={`${savedBusinesses.length} saved businesses`}
              >
                <Bookmark size={14} className="text-amber-500 fill-amber-500" />
                <span>{savedBusinesses.length}</span>
              </button>
            )}

            {/* Portal shortcut buttons: Vendor Dashboard & Master Dashboard */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  setUserRole('business_owner');
                  handleNavClick('owner_dashboard');
                }}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'owner_dashboard'
                    ? 'bg-amber-500 text-stone-950 shadow-xs'
                    : 'bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/25'
                }`}
                title="Vendor Dashboard: Manage listings, services, products, and customer leads"
              >
                <Building2 size={13} />
                <span className="hidden sm:inline">Vendor Hub</span>
                <span className="sm:hidden">Vendor</span>
              </button>

              <button
                onClick={() => {
                  setUserRole('admin');
                  handleNavClick('admin_dashboard');
                }}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'admin_dashboard'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-purple-900/30 text-purple-300 border border-purple-500/30 hover:bg-purple-900/50'
                }`}
                title="Master Dashboard: Platform-wide control of businesses, digital shops, leads, and system"
              >
                <ShieldCheck size={13} />
                <span className="hidden sm:inline">Master Control</span>
                <span className="sm:hidden">Master</span>
              </button>

            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-stone-900 border-b border-stone-800 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-800 mb-3">
            <button
              onClick={() => handleNavClick('explore')}
              className={`p-2.5 rounded-lg text-left text-xs font-semibold flex items-center gap-2 ${
                activeTab === 'explore' ? 'bg-amber-500/20 text-amber-400' : 'bg-stone-800 text-stone-200'
              }`}
            >
              <Compass size={15} />
              <span>Explore</span>
            </button>
            <button
              onClick={() => handleNavClick('categories')}
              className={`p-2.5 rounded-lg text-left text-xs font-semibold flex items-center gap-2 ${
                activeTab === 'categories' ? 'bg-amber-500/20 text-amber-400' : 'bg-stone-800 text-stone-200'
              }`}
            >
              <Layers size={15} />
              <span>Categories</span>
            </button>
            <button
              onClick={() => handleNavClick('map')}
              className={`p-2.5 rounded-lg text-left text-xs font-semibold flex items-center gap-2 ${
                activeTab === 'map' ? 'bg-amber-500/20 text-amber-400' : 'bg-stone-800 text-stone-200'
              }`}
            >
              <MapPin size={15} />
              <span>Map View</span>
            </button>
            <button
              onClick={() => handleNavClick('shop')}
              className={`p-2.5 rounded-lg text-left text-xs font-semibold flex items-center gap-2 ${
                activeTab === 'shop' ? 'bg-amber-500/20 text-amber-400' : 'bg-stone-800 text-stone-200'
              }`}
            >
              <ShoppingBag size={15} />
              <span>Products & Services</span>
            </button>
            <button
              onClick={() => handleNavClick('events')}
              className={`p-2.5 rounded-lg text-left text-xs font-semibold flex items-center gap-2 ${
                activeTab === 'events' ? 'bg-amber-500/20 text-amber-400' : 'bg-stone-800 text-stone-200'
              }`}
            >
              <Calendar size={15} />
              <span>Events & Deals</span>
            </button>
            <button
              onClick={() => handleNavClick('stories')}
              className={`p-2.5 rounded-lg text-left text-xs font-semibold flex items-center gap-2 ${
                activeTab === 'stories' ? 'bg-amber-500/20 text-amber-400' : 'bg-stone-800 text-stone-200'
              }`}
            >
              <BookOpen size={15} />
              <span>Stories</span>
            </button>
          </div>

          {/* Quick Dashboard Links in Mobile */}
          <div className="grid grid-cols-2 gap-2 pb-2">
            <button
              onClick={() => {
                setUserRole('business_owner');
                handleNavClick('owner_dashboard');
              }}
              className={`p-2.5 rounded-lg text-left text-xs font-bold flex items-center gap-2 border ${
                activeTab === 'owner_dashboard'
                  ? 'bg-amber-500 text-stone-950 border-amber-400'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}
            >
              <Building2 size={15} />
              <span>Vendor Dashboard</span>
            </button>
            <button
              onClick={() => {
                setUserRole('admin');
                handleNavClick('admin_dashboard');
              }}
              className={`p-2.5 rounded-lg text-left text-xs font-bold flex items-center gap-2 border ${
                activeTab === 'admin_dashboard'
                  ? 'bg-purple-600 text-white border-purple-400'
                  : 'bg-purple-900/20 text-purple-300 border-purple-500/30'
              }`}
            >
              <ShieldCheck size={15} />
              <span>Master Dashboard</span>
            </button>
          </div>

          <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-xs">
            <span className="text-stone-400">Select Persona:</span>
            <div className="flex gap-1">
              <button
                onClick={() => {
                  setUserRole('visitor');
                  setMobileMenuOpen(false);
                }}
                className={`px-2.5 py-1 rounded text-xs font-medium ${
                  userRole === 'visitor' ? 'bg-emerald-500 text-stone-950 font-bold' : 'bg-stone-800 text-stone-300'
                }`}
              >
                Visitor
              </button>
              <button
                onClick={() => {
                  setUserRole('business_owner');
                  setActiveTab('owner_dashboard');
                  setMobileMenuOpen(false);
                }}
                className={`px-2.5 py-1 rounded text-xs font-medium ${
                  userRole === 'business_owner' ? 'bg-amber-500 text-stone-950 font-bold' : 'bg-stone-800 text-stone-300'
                }`}
              >
                Owner
              </button>
              <button
                onClick={() => {
                  setUserRole('admin');
                  setActiveTab('admin_dashboard');
                  setMobileMenuOpen(false);
                }}
                className={`px-2.5 py-1 rounded text-xs font-medium ${
                  userRole === 'admin' ? 'bg-purple-600 text-white font-bold' : 'bg-stone-800 text-stone-300'
                }`}
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
