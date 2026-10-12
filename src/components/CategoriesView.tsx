import React from 'react';
import { useDirectory } from '../context/DirectoryContext';
import {
  Hammer,
  UtensilsCrossed,
  Mountain,
  Car,
  ShoppingBag,
  Briefcase,
  HeartPulse,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export const CategoriesView: React.FC = () => {
  const { categories, businesses, updateFilter, setActiveTab, openBusinessProfile } = useDirectory();

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Hammer':
        return Hammer;
      case 'UtensilsCrossed':
        return UtensilsCrossed;
      case 'Mountain':
        return Mountain;
      case 'Car':
        return Car;
      case 'ShoppingBag':
        return ShoppingBag;
      case 'Briefcase':
        return Briefcase;
      case 'HeartPulse':
        return HeartPulse;
      case 'Sparkles':
      default:
        return Sparkles;
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    updateFilter('category', categoryId);
    setActiveTab('explore');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="max-w-3xl mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
          Bozeman Industries
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mt-2 mb-3">
          Explore Bozeman by Category
        </h1>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
          Discover verified contractors, outdoor outfitters, artisan bakeries, and essential services across Gallatin County.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const IconComp = getCategoryIcon(cat.iconName || cat.icon || '');
          const categoryBusinesses = businesses.filter((b) => b.categoryId === cat.id);

          return (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs hover:shadow-md hover:border-amber-400 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="p-3 rounded-xl bg-amber-50 text-amber-900 border border-amber-200/60">
                    <IconComp size={24} />
                  </div>
                  <span className="text-xs font-bold bg-stone-100 text-stone-700 px-2.5 py-1 rounded-full">
                    {categoryBusinesses.length} {categoryBusinesses.length === 1 ? 'business' : 'businesses'}
                  </span>
                </div>

                <h2 className="font-heading text-lg font-bold text-stone-900 mb-1.5">{cat.name}</h2>
                <p className="text-xs text-stone-600 mb-4 leading-relaxed">{cat.description}</p>

                {/* Subcategories */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {cat.subcategories?.map((sub) => (
                    <span
                      key={sub}
                      className="text-[11px] bg-stone-50 text-stone-600 px-2 py-0.5 rounded border border-stone-150"
                    >
                      {sub}
                    </span>
                  ))}
                </div>

                {/* Sample Businesses */}
                {categoryBusinesses.length > 0 && (
                  <div className="border-t border-stone-100 pt-3 space-y-1.5 mb-4">
                    <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                      Featured in this category:
                    </span>
                    {categoryBusinesses.slice(0, 2).map((b) => (
                      <button
                        key={b.id}
                        onClick={() => openBusinessProfile(b.id)}
                        className="w-full text-left flex items-center justify-between text-xs text-stone-700 hover:text-amber-800 py-1 transition-colors"
                      >
                        <span className="font-semibold truncate">{b.name}</span>
                        <span className="text-stone-400 text-[11px] shrink-0">★ {b.rating}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => handleCategorySelect(cat.id)}
                className="w-full inline-flex items-center justify-center gap-1.5 bg-stone-100 hover:bg-amber-500 hover:text-stone-950 text-stone-800 font-bold py-2.5 px-4 rounded-xl text-xs transition-all cursor-pointer"
              >
                <span>View {cat.name} Directory</span>
                <ArrowRight size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
