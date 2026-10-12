import React from 'react';
import { useDirectory } from '../context/DirectoryContext';
import { TrustBadge } from './TrustBadge';
import { isBusinessOpen, getContextualWhatsAppUrl } from '../utils/helpers';
import {
  X,
  Star,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Award,
  Trash2,
  Plus,
  Scale,
  CheckCircle2,
} from 'lucide-react';

export const ComparisonModal: React.FC = () => {
  const {
    comparisonList,
    businesses,
    isComparisonModalOpen,
    setIsComparisonModalOpen,
    removeFromCompare,
    clearCompare,
    openBusinessProfile,
    openLeadModal,
    trackInteraction,
  } = useDirectory();

  if (!isComparisonModalOpen) return null;

  const comparedBusinesses = businesses.filter((b) => comparisonList.includes(b.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-5xl w-full p-6 shadow-2xl relative my-8 border border-stone-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-900">
              <Scale size={20} />
            </div>
            <div>
              <h3 className="font-heading font-bold text-xl text-stone-900">
                Business Comparison Matrix
              </h3>
              <p className="text-xs text-stone-500">
                Compare verified Bozeman businesses side-by-side across ratings, credentials, services, and response channels.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {comparedBusinesses.length > 0 && (
              <button
                onClick={clearCompare}
                className="text-xs text-stone-500 hover:text-red-700 flex items-center gap-1 font-medium cursor-pointer"
              >
                <Trash2 size={13} />
                <span>Clear All</span>
              </button>
            )}
            <button
              onClick={() => setIsComparisonModalOpen(false)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="overflow-x-auto overflow-y-auto flex-1 pt-4">
          {comparedBusinesses.length === 0 ? (
            <div className="text-center py-16">
              <Scale size={40} className="text-stone-300 mx-auto mb-2" />
              <h4 className="font-heading font-bold text-stone-800 text-base">No businesses selected for comparison</h4>
              <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-4">
                Click the "Compare" scale icon on any business card in the directory to add it here (up to 4 businesses).
              </p>
              <button
                onClick={() => setIsComparisonModalOpen(false)}
                className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs"
              >
                Browse Businesses
              </button>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr>
                  <th className="p-3 bg-stone-100/70 font-bold text-stone-700 uppercase tracking-wider w-44 rounded-l-xl">
                    Attribute
                  </th>
                  {comparedBusinesses.map((b) => (
                    <th key={b.id} className="p-3 bg-stone-50 border-l border-stone-200 min-w-[210px] align-top">
                      <div className="relative">
                        <button
                          onClick={() => removeFromCompare(b.id)}
                          className="absolute -top-1 -right-1 text-stone-400 hover:text-red-600 p-1"
                          title="Remove"
                        >
                          <X size={15} />
                        </button>
                        <img src={b.logoUrl} alt={b.name} className="w-10 h-10 rounded-xl object-cover mb-2 border border-stone-200" />
                        <h4 className="font-heading font-bold text-stone-900 text-sm leading-tight line-clamp-1">
                          {b.name}
                        </h4>
                        <div className="mt-1">
                          <TrustBadge tier={b.verificationTier} size="sm" />
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {/* Category */}
                <tr>
                  <td className="p-3 font-semibold text-stone-600 bg-stone-50/50">Category</td>
                  {comparedBusinesses.map((b) => (
                    <td key={b.id} className="p-3 border-l border-stone-200 font-medium text-stone-900">
                      {b.categoryName} {b.subcategoryName ? `• ${b.subcategoryName}` : ''}
                    </td>
                  ))}
                </tr>

                {/* Rating & Reviews */}
                <tr>
                  <td className="p-3 font-semibold text-stone-600 bg-stone-50/50">Rating & Reviews</td>
                  {comparedBusinesses.map((b) => (
                    <td key={b.id} className="p-3 border-l border-stone-200">
                      <div className="flex items-center gap-1 text-amber-600 font-bold">
                        <Star size={13} className="fill-amber-500" />
                        <span>{b.rating}</span>
                        <span className="text-stone-400 font-normal">({b.reviewsCount} reviews)</span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Years in Bozeman */}
                <tr>
                  <td className="p-3 font-semibold text-stone-600 bg-stone-50/50">Experience</td>
                  {comparedBusinesses.map((b) => (
                    <td key={b.id} className="p-3 border-l border-stone-200 font-medium text-stone-800">
                      {b.yearsInBusiness} years (Est. {b.foundedYear})
                    </td>
                  ))}
                </tr>

                {/* Neighborhood & Location */}
                <tr>
                  <td className="p-3 font-semibold text-stone-600 bg-stone-50/50">Location</td>
                  {comparedBusinesses.map((b) => (
                    <td key={b.id} className="p-3 border-l border-stone-200 text-stone-700">
                      <div className="font-semibold text-stone-900">{b.location.neighborhood}</div>
                      <div className="text-[11px] text-stone-500 truncate">{b.location.address}</div>
                    </td>
                  ))}
                </tr>

                {/* Price Tier */}
                <tr>
                  <td className="p-3 font-semibold text-stone-600 bg-stone-50/50">Price Range</td>
                  {comparedBusinesses.map((b) => (
                    <td key={b.id} className="p-3 border-l border-stone-200 font-bold text-stone-800">
                      {b.priceRange}
                    </td>
                  ))}
                </tr>

                {/* Open Status */}
                <tr>
                  <td className="p-3 font-semibold text-stone-600 bg-stone-50/50">Hours Status</td>
                  {comparedBusinesses.map((b) => {
                    const status = isBusinessOpen(b);
                    return (
                      <td key={b.id} className="p-3 border-l border-stone-200">
                        <span className={`font-semibold ${status.isOpen ? 'text-emerald-700' : 'text-stone-500'}`}>
                          {status.text}
                        </span>
                      </td>
                    );
                  })}
                </tr>

                {/* Services Catalog */}
                <tr>
                  <td className="p-3 font-semibold text-stone-600 bg-stone-50/50">Services Listed</td>
                  {comparedBusinesses.map((b) => (
                    <td key={b.id} className="p-3 border-l border-stone-200">
                      <span className="font-bold text-stone-900">{b.services?.length || 0} services</span>
                      <ul className="mt-1 space-y-0.5 text-[11px] text-stone-600">
                        {b.services?.slice(0, 2).map((s) => (
                          <li key={s.id} className="truncate">• {s.name}</li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>

                {/* Digital Products */}
                <tr>
                  <td className="p-3 font-semibold text-stone-600 bg-stone-50/50">Digital Catalog</td>
                  {comparedBusinesses.map((b) => (
                    <td key={b.id} className="p-3 border-l border-stone-200">
                      <span className="font-bold text-stone-900">{b.products?.length || 0} items</span>
                      <ul className="mt-1 space-y-0.5 text-[11px] text-stone-600">
                        {b.products?.slice(0, 2).map((p) => (
                          <li key={p.id} className="truncate">• {p.name}</li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>

                {/* Verified Credentials */}
                <tr>
                  <td className="p-3 font-semibold text-stone-600 bg-stone-50/50">Key Credentials</td>
                  {comparedBusinesses.map((b) => (
                    <td key={b.id} className="p-3 border-l border-stone-200 text-[11px]">
                      {b.credentials?.slice(0, 2).map((c) => (
                        <div key={c.id} className="text-emerald-800 font-medium">✓ {c.title}</div>
                      ))}
                      {(!b.credentials || b.credentials.length === 0) && (
                        <span className="text-stone-400">Public directory data</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Direct Channels */}
                <tr>
                  <td className="p-3 font-semibold text-stone-600 bg-stone-50/50">Direct Response</td>
                  {comparedBusinesses.map((b) => (
                    <td key={b.id} className="p-3 border-l border-stone-200">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                          <CheckCircle2 size={12} /> WhatsApp Enabled
                        </div>
                        <div className="text-stone-600">{b.contact.formattedPhone}</div>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Quick Actions Footer */}
                <tr>
                  <td className="p-3 font-bold text-stone-700 bg-stone-100/70 rounded-bl-xl">Actions</td>
                  {comparedBusinesses.map((b) => (
                    <td key={b.id} className="p-3 border-l border-stone-200 space-y-1.5">
                      <button
                        onClick={() => {
                          setIsComparisonModalOpen(false);
                          openBusinessProfile(b.id);
                        }}
                        className="w-full py-1.5 px-2 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-lg text-xs transition-colors"
                      >
                        View Profile
                      </button>

                      <div className="grid grid-cols-2 gap-1">
                        <button
                          onClick={() => {
                            trackInteraction(b.id, 'calls');
                            window.location.href = `tel:${b.contact.phone}`;
                          }}
                          className="py-1 px-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded text-[11px] text-center"
                        >
                          Call
                        </button>
                        <button
                          onClick={() => {
                            trackInteraction(b.id, 'whatsappClicks');
                            const url = getContextualWhatsAppUrl(b.contact.whatsapp, b.name);
                            window.open(url, '_blank', 'noopener,noreferrer');
                          }}
                          className="py-1 px-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold rounded text-[11px] text-center"
                        >
                          WhatsApp
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          setIsComparisonModalOpen(false);
                          openLeadModal(b, 'quote');
                        }}
                        className="w-full py-1.5 px-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg text-xs transition-colors"
                      >
                        Request Quote
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
