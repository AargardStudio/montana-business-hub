import React from 'react';
import { useDirectory } from '../../context/DirectoryContext';
import { Trash2 } from 'lucide-react';

interface AdminEventsDealsSectionProps {
  showToast: (msg: string) => void;
}

/**
 * Master "Deals & Events" tab: platform-wide moderation of merchant
 * discounts/coupons and community events.
 */
export const AdminEventsDealsSection: React.FC<AdminEventsDealsSectionProps> = ({ showToast }) => {
  const { events, offers, deleteEvent, deleteOffer } = useDirectory();

  return (
    <div className="space-y-8">
      {/* Deals */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-bold text-base text-stone-900">
            Active Merchant Discounts & Coupons ({offers.length})
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {offers.map((o) => (
            <div
              key={o.id}
              className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs flex items-center justify-between"
            >
              <div>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                  {o.discountTag}
                </span>
                <h4 className="font-bold text-stone-900 text-xs mt-1">{o.title}</h4>
                <p className="text-[11px] text-stone-500">
                  Business: {o.businessName} • Code: {o.code || 'None'}
                </p>
              </div>
              <button
                onClick={() => {
                  if (confirm(`Remove offer "${o.title}"?`)) {
                    deleteOffer(o.id);
                    showToast('Offer removed.');
                  }
                }}
                className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Events */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-bold text-base text-stone-900">
            Community Events & Workshops ({events.length})
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((e) => (
            <div
              key={e.id}
              className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs flex items-center justify-between"
            >
              <div>
                <h4 className="font-bold text-stone-900 text-xs">{e.title}</h4>
                <p className="text-[11px] text-stone-500">
                  {e.date} • {e.location} • Host: {e.businessName}
                </p>
              </div>
              <button
                onClick={() => {
                  if (confirm(`Remove event "${e.title}"?`)) {
                    deleteEvent(e.id);
                    showToast('Event removed.');
                  }
                }}
                className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
