import React, { useState } from 'react';
import { useDirectory } from '../context/DirectoryContext';
import { getContextualWhatsAppUrl } from '../utils/helpers';
import {
  Calendar,
  Tag,
  Clock,
  MapPin,
  Building,
  Ticket,
  MessageCircle,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export const EventsAndDealsView: React.FC = () => {
  const { events, offers, businesses, openBusinessProfile, trackInteraction } = useDirectory();
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'events' | 'deals'>('all');

  const handleClaimDealOnWhatsApp = (deal: (typeof offers)[0]) => {
    const biz = businesses.find((b) => b.id === deal.businessId);
    if (!biz) return;
    trackInteraction(biz.id, 'whatsappClicks');
    const url = getContextualWhatsAppUrl(biz.contact.whatsapp, biz.name, {
      type: 'general',
      itemName: `${deal.title}${deal.code ? ` (Promo Code: ${deal.code})` : ''}`,
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="max-w-3xl mb-8">
        <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-900 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-semibold mb-3">
          <Calendar size={14} className="text-amber-600" />
          <span>Bozeman Community Hub</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mb-2">
          Local Events & Special Deals
        </h1>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
          Stay connected with Gallatin Valley workshops, seasonal pop-ups, tasting dinners, and exclusive promotions from verified Bozeman merchants.
        </p>
      </div>

      {/* Sub-tab switcher */}
      <div className="flex gap-2 mb-8 border-b border-stone-200 pb-3">
        <button
          onClick={() => setActiveSubTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeSubTab === 'all'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          All Activity
        </button>
        <button
          onClick={() => setActiveSubTab('events')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'events'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <Calendar size={14} />
          <span>Upcoming Events ({events.length})</span>
        </button>
        <button
          onClick={() => setActiveSubTab('deals')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'deals'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <Tag size={14} />
          <span>Merchant Deals ({offers.length})</span>
        </button>
      </div>

      {/* EVENTS SECTION */}
      {(activeSubTab === 'all' || activeSubTab === 'events') && (
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-xl font-bold text-stone-900 flex items-center gap-2">
              <Calendar size={20} className="text-amber-600" />
              <span>Upcoming Bozeman Events</span>
            </h2>
            <span className="text-xs text-stone-500 font-medium">Gallatin Valley Community Calendar</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 w-full bg-stone-100">
                    <img src={ev.imageUrl} alt={ev.title} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-xs text-white text-xs font-bold px-3 py-1 rounded-lg">
                      {ev.date}
                    </div>
                  </div>

                  <div className="p-5">
                    <button
                      onClick={() => openBusinessProfile(ev.businessId)}
                      className="text-xs font-semibold text-amber-800 hover:text-amber-900 flex items-center gap-1 mb-1.5"
                    >
                      <Building size={12} />
                      <span>Presented by {ev.businessName}</span>
                    </button>

                    <h3 className="font-heading font-bold text-lg text-stone-900 mb-2">{ev.title}</h3>
                    <p className="text-xs text-stone-600 leading-relaxed mb-4">{ev.description}</p>

                    <div className="space-y-1.5 text-xs text-stone-500 border-t border-stone-100 pt-3">
                      <div className="flex items-center gap-2">
                        <Clock size={13} className="text-stone-400" />
                        <span>{ev.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={13} className="text-stone-400" />
                        <span>{ev.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-stone-100 mt-2 flex items-center justify-between">
                  <span className="font-heading font-extrabold text-stone-900 text-sm">
                    {ev.admissionPrice || 'Free Entry'}
                  </span>
                  <button
                    onClick={() => openBusinessProfile(ev.businessId)}
                    className="inline-flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-white font-bold px-3.5 py-2 rounded-xl text-xs"
                  >
                    <Ticket size={14} />
                    <span>RSVP / Details</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SPECIAL DEALS SECTION */}
      {(activeSubTab === 'all' || activeSubTab === 'deals') && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-xl font-bold text-stone-900 flex items-center gap-2">
              <Tag size={20} className="text-amber-600" />
              <span>Exclusive Verified Merchant Deals</span>
            </h2>
            <span className="text-xs text-stone-500 font-medium">Claim directly via WhatsApp or mention promo code</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {offers.map((deal) => (
              <div
                key={deal.id}
                className="bg-white rounded-2xl border-2 border-dashed border-amber-300 p-6 shadow-xs hover:border-amber-500 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md">
                      {deal.discountTag}
                    </span>
                    <span className="text-[11px] text-stone-400">Valid until {deal.validUntil}</span>
                  </div>

                  <button
                    onClick={() => openBusinessProfile(deal.businessId)}
                    className="text-xs font-semibold text-stone-500 hover:text-stone-900 flex items-center gap-1 mb-1"
                  >
                    <Building size={12} />
                    <span>{deal.businessName}</span>
                  </button>

                  <h3 className="font-heading font-bold text-base text-stone-900 mb-2">{deal.title}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed mb-4">{deal.description}</p>
                </div>

                <div className="border-t border-stone-100 pt-3 flex items-center justify-between gap-3">
                  {deal.code ? (
                    <div>
                      <span className="text-[10px] uppercase font-bold text-stone-400 block">Promo Code</span>
                      <span className="font-mono font-bold text-xs bg-stone-100 text-stone-800 px-2 py-0.5 rounded border border-stone-200">
                        {deal.code}
                      </span>
                    </div>
                  ) : (
                    <span />
                  )}

                  <button
                    onClick={() => handleClaimDealOnWhatsApp(deal)}
                    className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs shadow-2xs"
                  >
                    <MessageCircle size={14} />
                    <span>Claim on WhatsApp</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
