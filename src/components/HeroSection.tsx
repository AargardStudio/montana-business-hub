import React, { useState, useEffect } from 'react';
import { useDirectory } from '../context/DirectoryContext';
import { Search, Sparkles, MapPin, ArrowRight, Layers, X } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { filters, setFilters, updateFilter, setActiveTab, runAiSearch, aiSearchInterpretation } = useDirectory();
  const [queryInput, setQueryInput] = useState(filters.query || '');
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  // Synchronize local input when global filter changes (e.g. from BusinessDirectory or reset)
  useEffect(() => {
    setQueryInput(filters.query || '');
  }, [filters.query]);

  const EXAMPLE_SEARCHES = [
    'Best steakhouse & wood-fired',
    'Emergency plumber 24/7',
    'Custom timber frame contractor',
    'Fly fishing guided float',
    'Ski tuning & mountain bikes',
    'Family dentist North 7th',
    'Diesel truck repair',
    'Montana handcrafted leather',
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQueryInput(value);
    // Real-time filtering across name, category, or description
    updateFilter('query', value);
  };

  const handleClearSearch = () => {
    setQueryInput('');
    updateFilter('query', '');
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter('query', queryInput);
    setActiveTab('explore');

    // Check if natural language sentence query with > 3 words
    const isNaturalSentence = queryInput.split(' ').length > 3 || queryInput.includes('near me') || queryInput.includes('looking for');
    if (isNaturalSentence && queryInput.trim()) {
      setIsAiProcessing(true);
      await runAiSearch(queryInput);
      setIsAiProcessing(false);
    }

    // Smooth scroll down to the directory listings
    const dirElement = document.getElementById('business-directory-section');
    if (dirElement) {
      dirElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleChipClick = async (term: string) => {
    setQueryInput(term);
    updateFilter('query', term);
    setActiveTab('explore');
    const dirElement = document.getElementById('business-directory-section');
    if (dirElement) {
      dirElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="relative bg-stone-900 text-stone-100 overflow-hidden border-b border-stone-800">
      {/* Subtle background ambient overlay with Bozeman mountain aesthetic */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-stone-900/90 to-stone-900 pointer-events-none" />
      <div
        className="absolute inset-0 opacity-15 bg-cover bg-center pointer-events-none mix-blend-luminosity"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&auto=format&fit=crop&q=80")',
        }}
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-14 text-center">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3.5 py-1 rounded-full text-xs font-semibold mb-5 shadow-xs">
          <Sparkles size={14} className="text-amber-400" />
          <span>Local Digital Business Network & Verified Directory</span>
        </div>

        {/* Main Headline */}
        <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 leading-tight">
          Discover Bozeman Businesses
        </h1>

        {/* Subheading */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-stone-300 font-normal leading-relaxed mb-8">
          Find local businesses, services, products, portfolios, and certified professionals — all in one place. Connect directly via WhatsApp or phone.
        </p>

        {/* Intelligent Real-Time Search Box */}
        <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto mb-5">
          <div className="relative flex flex-col sm:flex-row items-stretch bg-stone-800/90 backdrop-blur-md rounded-2xl p-2 border border-stone-700 shadow-2xl focus-within:border-amber-500/80 transition-all">
            <div className="relative flex-1 flex items-center px-3 py-2">
              <Search size={20} className="text-amber-400 shrink-0 mr-3" />
              <input
                id="hero-search-input"
                type="text"
                value={queryInput}
                onChange={handleInputChange}
                placeholder="Search in real-time (e.g. 'Bakery', 'Plumber', 'Wood-fired sourdough', 'Solar')..."
                className="w-full bg-transparent text-white placeholder-stone-400 text-sm sm:text-base outline-hidden"
                aria-label="Search businesses by name, category, or description keywords"
              />
              {queryInput && (
                <button
                  type="button"
                  id="hero-clear-search-btn"
                  onClick={handleClearSearch}
                  className="p-1.5 text-stone-400 hover:text-stone-100 rounded-lg transition-colors cursor-pointer mr-2 shrink-0"
                  title="Clear search"
                  aria-label="Clear search"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 sm:border-l border-stone-700 sm:pl-2">
              <button
                type="submit"
                id="hero-search-submit-btn"
                disabled={isAiProcessing}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {isAiProcessing ? (
                  <>
                    <Sparkles size={16} className="animate-spin text-stone-950" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>Search</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* AI Interpretation Notification if active */}
        {aiSearchInterpretation && (
          <div className="max-w-2xl mx-auto mb-4 bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs px-4 py-2 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2 text-left">
              <Sparkles size={14} className="text-amber-400 shrink-0" />
              <span>{aiSearchInterpretation}</span>
            </div>
            <button
              onClick={() => {
                setFilters((prev) => ({ ...prev, query: '', category: '', neighborhood: '' }));
                setQueryInput('');
              }}
              className="text-stone-400 hover:text-stone-200 underline font-medium ml-3 cursor-pointer shrink-0"
            >
              Reset
            </button>
          </div>
        )}

        {/* Search Example Chips */}
        <div className="max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-1.5 text-xs text-stone-400 mb-8">
          <span className="text-stone-500 font-medium mr-1">Popular searches:</span>
          {EXAMPLE_SEARCHES.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => handleChipClick(term)}
              className="bg-stone-800/80 hover:bg-stone-700 hover:text-amber-300 text-stone-300 px-2.5 py-1 rounded-full border border-stone-750 transition-colors cursor-pointer"
            >
              {term}
            </button>
          ))}
        </div>

        {/* Navigation Quick Triggers */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
          <button
            onClick={() => setActiveTab('explore')}
            className="inline-flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-stone-100 font-medium px-4 py-2 rounded-xl border border-stone-700 transition-colors"
          >
            <span>Explore All Businesses</span>
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className="inline-flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-stone-100 font-medium px-4 py-2 rounded-xl border border-stone-700 transition-colors"
          >
            <Layers size={16} className="text-amber-400" />
            <span>Browse Categories</span>
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className="inline-flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-stone-100 font-medium px-4 py-2 rounded-xl border border-stone-700 transition-colors"
          >
            <MapPin size={16} className="text-amber-400" />
            <span>Interactive Map View</span>
          </button>
        </div>
      </div>
    </div>
  );
};
