import React, { useState, useMemo } from 'react';
import { useDirectory } from '../context/DirectoryContext';
import { BusinessCard } from './BusinessCard';
import { InteractiveMap } from './InteractiveMap';
import { NEIGHBORHOODS } from '../data/mockData';
import { isBusinessOpen } from '../utils/helpers';
import {
  List,
  Map as MapIcon,
  Columns2,
  Filter,
  SlidersHorizontal,
  X,
  RotateCcw,
  Search,
  Check,
  ShieldCheck,
  Award,
  Sparkles,
  Building,
} from 'lucide-react';

export const BusinessDirectory: React.FC = () => {
  const { businesses, categories, filters, setFilters, updateFilter, resetFilters } = useDirectory();
  const [viewMode, setViewMode] = useState<'list' | 'map' | 'split'>('split');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [activeHoveredId, setActiveHoveredId] = useState<string | null>(null);

  // Filter and sort businesses
  const filteredBusinesses = useMemo(() => {
    return businesses
      .filter((b) => {
        // Real-time query search across business name, category, or description keywords
        if (filters.query && filters.query.trim()) {
          const q = filters.query.toLowerCase().trim();
          const words = q.split(/\s+/).filter(Boolean);

          const nameText = b.name.toLowerCase();
          const catText = `${b.categoryName} ${b.subcategoryName || ''}`.toLowerCase();
          const descText = `${b.description} ${b.tagline || ''}`.toLowerCase();
          const tagsText = (b.tags || []).join(' ').toLowerCase();
          const servicesText = (b.services || []).map((s) => `${s.name} ${s.description}`).join(' ').toLowerCase();
          const productsText = (b.products || []).map((p) => `${p.name} ${p.description}`).join(' ').toLowerCase();
          const searchableText = `${nameText} ${catText} ${descText} ${tagsText} ${servicesText} ${productsText}`;

          const matchesPhrase = searchableText.includes(q);
          const matchesAllWords = words.every((word) => searchableText.includes(word));

          if (!matchesPhrase && !matchesAllWords) {
            return false;
          }
        }

        // Category
        if (filters.category && b.categoryId !== filters.category) {
          return false;
        }

        // Neighborhood
        if (filters.neighborhood && b.location.neighborhood !== filters.neighborhood) {
          return false;
        }

        // Verification Tier
        if (filters.verificationTier) {
          if (filters.verificationTier === 'credential_verified' && b.verificationTier !== 'credential_verified') {
            return false;
          }
          if (filters.verificationTier === 'verified' && b.verificationTier !== 'verified' && b.verificationTier !== 'credential_verified') {
            return false;
          }
          if (filters.verificationTier === 'claimed' && b.claimStatus === 'unclaimed') {
            return false;
          }
        }

        // Open Now
        if (filters.openNow) {
          const openStatus = isBusinessOpen(b);
          if (!openStatus.isOpen) return false;
        }

        // Has WhatsApp
        if (filters.hasWhatsApp && !b.contact.whatsapp) {
          return false;
        }

        // Has Services Catalog
        if (filters.hasServices && (!b.services || b.services.length === 0)) {
          return false;
        }

        // Has Products Catalog
        if (filters.hasProducts && (!b.products || b.products.length === 0)) {
          return false;
        }

        // Price range
        if (filters.priceRange.length > 0 && !filters.priceRange.includes(b.priceRange)) {
          return false;
        }

        // Min rating
        if (filters.minRating > 0 && b.rating < filters.minRating) {
          return false;
        }

        // Min years
        if (filters.minYears > 0 && b.yearsInBusiness < filters.minYears) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'rating') return b.rating - a.rating;
        if (filters.sortBy === 'reviews') return b.reviewsCount - a.reviewsCount;
        if (filters.sortBy === 'years') return b.yearsInBusiness - a.yearsInBusiness;
        if (filters.sortBy === 'recently_added') return b.foundedYear - a.foundedYear;
        // Default relevance: verified first, then rating
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return b.rating - a.rating;
      });
  }, [businesses, filters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.query && filters.query.trim()) count++;
    if (filters.category) count++;
    if (filters.neighborhood) count++;
    if (filters.verificationTier) count++;
    if (filters.openNow) count++;
    if (filters.hasWhatsApp) count++;
    if (filters.hasServices) count++;
    if (filters.hasProducts) count++;
    if (filters.priceRange.length > 0) count++;
    if (filters.minRating > 0) count++;
    if (filters.minYears > 0) count++;
    return count;
  }, [filters]);

  const togglePriceRange = (range: string) => {
    setFilters((prev) => {
      const exists = prev.priceRange.includes(range);
      return {
        ...prev,
        priceRange: exists ? prev.priceRange.filter((r) => r !== range) : [...prev.priceRange, range],
      };
    });
  };

  return (
    <div id="business-directory-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header & View Toggles */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-200">
        <div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Bozeman Business Directory
          </h2>
          <p className="text-sm text-stone-600">
            Showing <strong className="text-stone-900">{filteredBusinesses.length}</strong> verified local businesses in Gallatin Valley
          </p>
        </div>

        {/* View Switcher & Sorting Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden inline-flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-800 px-3.5 py-2 rounded-xl text-xs font-semibold border border-stone-300"
          >
            <Filter size={15} />
            <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
          </button>

          {/* Sort dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-stone-600 bg-white border border-stone-300 rounded-xl px-3 py-1.5 shadow-2xs">
            <span className="text-stone-400 font-medium">Sort:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilter('sortBy', e.target.value as any)}
              aria-label="Sort businesses by"
              className="bg-transparent font-semibold text-stone-800 outline-hidden cursor-pointer"
            >
              <option value="relevance">Recommended</option>
              <option value="rating">Highest Rated</option>
              <option value="reviews">Most Reviewed</option>
              <option value="years">Years in Business</option>
            </select>
          </div>

          {/* View Mode Buttons */}
          <div className="inline-flex bg-stone-100 p-1 rounded-xl border border-stone-200">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'list' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
              title="List View"
            >
              <List size={16} />
              <span className="hidden sm:inline">Cards</span>
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'split' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Split View (Map & List)"
            >
              <Columns2 size={16} />
              <span className="hidden sm:inline">Split</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'map' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Interactive Map Only"
            >
              <MapIcon size={16} />
              <span className="hidden sm:inline">Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* Prominent Real-time Search Bar */}
      <div className="relative mb-6">
        <div className="relative flex items-center bg-white border border-stone-300 rounded-2xl shadow-xs focus-within:ring-2 focus-within:ring-amber-500 focus-within:border-amber-500 transition-all p-2 sm:p-2.5">
          <div className="pl-3 pr-2 text-stone-400">
            <Search size={20} className="text-amber-500 shrink-0" />
          </div>
          <input
            id="directory-search-input"
            type="text"
            value={filters.query}
            onChange={(e) => updateFilter('query', e.target.value)}
            placeholder="Search by business name, category (e.g. Bakery, Auto, Solar), or description keywords..."
            className="w-full bg-transparent text-stone-900 placeholder-stone-400 text-sm sm:text-base outline-hidden py-1 pr-2"
            aria-label="Search businesses by name, category, or description keywords"
          />
          {filters.query && (
            <button
              type="button"
              id="directory-clear-search-btn"
              onClick={() => updateFilter('query', '')}
              className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-400 hover:text-stone-700 transition-colors mr-2 cursor-pointer shrink-0"
              title="Clear search"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
          <div className="hidden sm:flex items-center text-xs font-semibold text-stone-600 px-3 py-1.5 bg-stone-100 rounded-xl whitespace-nowrap shrink-0">
            {filteredBusinesses.length} {filteredBusinesses.length === 1 ? 'business' : 'businesses'}
          </div>
        </div>

        {/* Live Search Keyword Indicator */}
        {filters.query && (
          <div className="flex items-center justify-between mt-2 px-1 text-xs text-stone-600">
            <span>
              Real-time results matching <strong className="text-stone-900 font-semibold">&ldquo;{filters.query}&rdquo;</strong> across business names, categories, or descriptions
            </span>
            <button
              type="button"
              onClick={() => updateFilter('query', '')}
              className="text-amber-700 hover:text-amber-900 font-semibold cursor-pointer underline ml-2"
            >
              Clear keyword
            </button>
          </div>
        )}
      </div>

      {/* Main Layout: Filters Sidebar + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={17} className="text-stone-700" />
                <h3 className="font-heading font-bold text-stone-900 text-sm">Filters</h3>
                {activeFilterCount > 0 && (
                  <span className="bg-amber-100 text-amber-900 text-[11px] font-bold px-1.5 py-0.2 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              {activeFilterCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw size={12} />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Industry Category
              </label>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                <button
                  onClick={() => updateFilter('category', '')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                    !filters.category ? 'bg-amber-50 text-amber-900 font-bold' : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span>All Categories</span>
                  {!filters.category && <Check size={14} className="text-amber-600" />}
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => updateFilter('category', c.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      filters.category === c.id
                        ? 'bg-amber-50 text-amber-900 font-bold'
                        : 'text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span className="truncate">{c.name}</span>
                    {filters.category === c.id && <Check size={14} className="text-amber-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Neighborhood Filter */}
            <div className="mb-5 border-t border-stone-100 pt-4">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Bozeman Area
              </label>
              <select
                value={filters.neighborhood}
                onChange={(e) => updateFilter('neighborhood', e.target.value)}
                aria-label="Filter by Bozeman Area"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 font-medium outline-hidden"
              >
                <option value="">All Neighborhoods</option>
                {NEIGHBORHOODS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            {/* Verification Status */}
            <div className="mb-5 border-t border-stone-100 pt-4">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Trust & Verification
              </label>
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                  <input
                    type="radio"
                    name="verificationTier"
                    checked={!filters.verificationTier}
                    onChange={() => updateFilter('verificationTier', '')}
                    className="text-amber-600 focus:ring-amber-500"
                  />
                  <span>Any Status</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                  <input
                    type="radio"
                    name="verificationTier"
                    checked={filters.verificationTier === 'credential_verified'}
                    onChange={() => updateFilter('verificationTier', 'credential_verified')}
                    className="text-amber-600 focus:ring-amber-500"
                  />
                  <span className="flex items-center gap-1">
                    <Award size={13} className="text-emerald-600" />
                    <strong>Credential Verified</strong>
                  </span>
                </label>
                <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                  <input
                    type="radio"
                    name="verificationTier"
                    checked={filters.verificationTier === 'verified'}
                    onChange={() => updateFilter('verificationTier', 'verified')}
                    className="text-amber-600 focus:ring-amber-500"
                  />
                  <span className="flex items-center gap-1">
                    <ShieldCheck size={13} className="text-blue-600" />
                    <span>Verified Business</span>
                  </span>
                </label>
              </div>
            </div>

            {/* Quick toggles */}
            <div className="mb-5 border-t border-stone-100 pt-4 space-y-2">
              <label className="flex items-center justify-between text-xs text-stone-700 cursor-pointer">
                <span>Open Now</span>
                <input
                  type="checkbox"
                  checked={filters.openNow}
                  onChange={(e) => updateFilter('openNow', e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
              </label>
              <label className="flex items-center justify-between text-xs text-stone-700 cursor-pointer">
                <span>WhatsApp Direct Chat</span>
                <input
                  type="checkbox"
                  checked={filters.hasWhatsApp}
                  onChange={(e) => updateFilter('hasWhatsApp', e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
              </label>
              <label className="flex items-center justify-between text-xs text-stone-700 cursor-pointer">
                <span>Digital Services Catalog</span>
                <input
                  type="checkbox"
                  checked={filters.hasServices}
                  onChange={(e) => updateFilter('hasServices', e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
              </label>
              <label className="flex items-center justify-between text-xs text-stone-700 cursor-pointer">
                <span>Digital Product Catalog</span>
                <input
                  type="checkbox"
                  checked={filters.hasProducts}
                  onChange={(e) => updateFilter('hasProducts', e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
              </label>
            </div>

            {/* Price Range */}
            <div className="border-t border-stone-100 pt-4">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Price Tier
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {['$', '$$', '$$$', '$$$$'].map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => togglePriceRange(tier)}
                    className={`py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                      filters.priceRange.includes(tier)
                        ? 'bg-amber-500 text-stone-950 border-amber-600'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-3">
          {/* Active Filter Chips */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mb-4">
              <span className="text-xs text-stone-500 font-medium">Active filters:</span>
              {filters.query && (
                <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-950 border border-amber-300 text-xs px-2.5 py-1 rounded-full font-medium">
                  <span>Keyword: &ldquo;{filters.query}&rdquo;</span>
                  <button
                    onClick={() => updateFilter('query', '')}
                    aria-label="Remove search keyword filter"
                    className="hover:text-amber-800 cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
              {filters.category && (
                <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200 text-xs px-2.5 py-1 rounded-full font-medium">
                  {categories.find((c) => c.id === filters.category)?.name}
                  <button onClick={() => updateFilter('category', '')} aria-label="Remove category filter">
                    <X size={12} />
                  </button>
                </span>
              )}
              {filters.neighborhood && (
                <span className="inline-flex items-center gap-1 bg-stone-100 text-stone-800 text-xs px-2.5 py-1 rounded-full font-medium">
                  {filters.neighborhood}
                  <button onClick={() => updateFilter('neighborhood', '')} aria-label="Remove neighborhood filter">
                    <X size={12} />
                  </button>
                </span>
              )}
              {filters.openNow && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs px-2.5 py-1 rounded-full font-medium">
                  Open Now
                  <button onClick={() => updateFilter('openNow', false)} aria-label="Remove open now filter">
                    <X size={12} />
                  </button>
                </span>
              )}
              {filters.verificationTier && (
                <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 border border-blue-200 text-xs px-2.5 py-1 rounded-full font-medium">
                  {filters.verificationTier.replace('_', ' ')}
                  <button onClick={() => updateFilter('verificationTier', '')} aria-label="Remove verification tier filter">
                    <X size={12} />
                  </button>
                </span>
              )}
              <button
                onClick={resetFilters}
                className="text-xs text-stone-500 hover:text-stone-900 underline font-medium ml-1 cursor-pointer"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Views render */}
          {viewMode === 'map' ? (
            /* MAP ONLY VIEW */
            <div>
              <InteractiveMap
                businesses={filteredBusinesses}
                heightClass="h-[650px]"
                selectedBusinessId={activeHoveredId}
              />
            </div>
          ) : viewMode === 'split' ? (
            /* SPLIT VIEW (Map & List) */
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
              {/* Cards column */}
              <div className="xl:col-span-7 space-y-4">
                {filteredBusinesses.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 p-8">
                    <Building size={40} className="text-stone-300 mx-auto mb-3" />
                    <h3 className="font-heading font-bold text-stone-900 text-lg mb-1">No businesses match your search</h3>
                    <p className="text-sm text-stone-500 max-w-sm mx-auto mb-4">
                      Try relaxing some filters or exploring all Bozeman categories.
                    </p>
                    <button
                      onClick={resetFilters}
                      className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  filteredBusinesses.map((b) => (
                    <div key={b.id} onMouseEnter={() => setActiveHoveredId(b.id)}>
                      <BusinessCard business={b} />
                    </div>
                  ))
                )}
              </div>

              {/* Map Column (Sticky on desktop) */}
              <div className="xl:col-span-5 sticky top-24">
                <InteractiveMap
                  businesses={filteredBusinesses}
                  heightClass="h-[600px]"
                  selectedBusinessId={activeHoveredId}
                />
              </div>
            </div>
          ) : (
            /* LIST ONLY VIEW (Grid of cards) */
            <div>
              {filteredBusinesses.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 p-8">
                  <Building size={40} className="text-stone-300 mx-auto mb-3" />
                  <h3 className="font-heading font-bold text-stone-900 text-lg mb-1">No businesses found</h3>
                  <p className="text-sm text-stone-500 max-w-sm mx-auto mb-4">
                    Try adjusting your search terms or filters.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredBusinesses.map((b) => (
                    <BusinessCard key={b.id} business={b} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer Modal */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
          <div className="bg-white w-full max-w-md max-h-[85vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-heading font-bold text-base text-stone-900">Filter Businesses</h3>
              <button onClick={() => setMobileFiltersOpen(false)} aria-label="Close filter drawer">
                <X size={20} className="text-stone-500" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-2">Search Keywords</label>
              <div className="relative flex items-center bg-stone-50 border border-stone-300 rounded-xl px-3 py-2">
                <Search size={16} className="text-amber-500 mr-2 shrink-0" />
                <input
                  type="text"
                  value={filters.query}
                  onChange={(e) => updateFilter('query', e.target.value)}
                  placeholder="Filter name, category, description..."
                  className="w-full bg-transparent text-xs text-stone-900 outline-hidden"
                  aria-label="Filter businesses by keywords"
                />
                {filters.query && (
                  <button
                    type="button"
                    onClick={() => updateFilter('query', '')}
                    className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer shrink-0"
                    title="Clear keyword"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => updateFilter('category', e.target.value)}
                aria-label="Filter by category"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-2">Neighborhood</label>
              <select
                value={filters.neighborhood}
                onChange={(e) => updateFilter('neighborhood', e.target.value)}
                aria-label="Filter by neighborhood"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs"
              >
                <option value="">All Neighborhoods</option>
                {NEIGHBORHOODS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2 border-t border-stone-100 flex gap-2">
              <button
                onClick={() => {
                  resetFilters();
                  setMobileFiltersOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs"
              >
                Show {filteredBusinesses.length} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
