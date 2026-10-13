import React, { useState } from 'react';
import { useDirectory } from '../../context/DirectoryContext';
import { Business } from '../../types';
import { useProfileActions } from './useProfileActions';
import { CheckCircle2, MessageCircle, ChevronDown } from 'lucide-react';
import type { ProfileTab } from './profileTabs';

interface ProfileOverviewSectionProps {
  business: Business;
  onNavigateTab: (tab: ProfileTab) => void;
}

/** "Overview & About" tab: description, highlights, featured services/products, and FAQs. */
export const ProfileOverviewSection: React.FC<ProfileOverviewSectionProps> = ({ business, onNavigateTab }) => {
  const { openLeadModal } = useDirectory();
  const { handleWhatsAppItem } = useProfileActions(business);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <div className="space-y-8">
      {/* About Card */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-7 shadow-xs">
        <h2 className="font-heading text-xl font-bold text-stone-900 mb-3">About {business.name}</h2>
        <p className="text-stone-700 leading-relaxed text-sm whitespace-pre-line mb-6">{business.description}</p>

        {/* Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-stone-100 pt-5">
          <div className="bg-stone-50 p-3 rounded-xl">
            <span className="block text-[11px] text-stone-500 uppercase font-semibold">Founded</span>
            <strong className="text-stone-900 text-sm">
              {business.foundedYear} ({business.yearsInBusiness} yrs)
            </strong>
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
            <strong className="text-emerald-700 text-sm capitalize">
              {business.verificationTier.replace('_', ' ')}
            </strong>
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
              onClick={() => onNavigateTab('services')}
              className="text-xs text-amber-700 hover:text-amber-800 font-bold"
            >
              View All Services →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {business.services.slice(0, 2).map((srv) => (
              <div
                key={srv.id}
                className="border border-stone-200 rounded-xl p-4 flex flex-col justify-between hover:border-amber-400 transition-colors"
              >
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
              onClick={() => onNavigateTab('products')}
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
  );
};
