import React, { useState } from 'react';
import { useDirectory } from '../../context/DirectoryContext';
import { Business } from '../../types';
import { Plus, Trash2, Percent } from 'lucide-react';
import { OwnerDealModal } from './OwnerDealModal';

interface OwnerDealsSectionProps {
  business: Business;
  showToast: (msg: string) => void;
}

/** "Local Deals & Promotions" tab: promo codes/coupons for the active business. */
export const OwnerDealsSection: React.FC<OwnerDealsSectionProps> = ({ business, showToast }) => {
  const { offers, deleteOffer } = useDirectory();
  const [dealModalOpen, setDealModalOpen] = useState(false);

  const myDeals = offers.filter((o) => o.businessId === business.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <h3 className="font-heading font-bold text-base text-stone-900">
            Special Offers, Local Coupons & Discounts
          </h3>
          <p className="text-xs text-stone-500">
            Create promotional discount codes featured on the Bozeman Community Deals page to drive
            foot traffic.
          </p>
        </div>
        <button
          onClick={() => setDealModalOpen(true)}
          className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus size={15} />
          <span>+ Create Special Offer</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {myDeals.length > 0 ? (
          myDeals.map((d) => (
            <div
              key={d.id}
              className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-amber-500/20 text-amber-900 border border-amber-500/30 text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                    {d.discountTag}
                  </span>
                  <span className="text-xs text-stone-400">Valid: {d.validUntil}</span>
                </div>
                <h4 className="font-heading font-bold text-stone-900 text-base mb-1">{d.title}</h4>
                <p className="text-xs text-stone-600 mb-3">{d.description}</p>
                {d.code && (
                  <div className="inline-flex items-center gap-1.5 bg-stone-100 border border-dashed border-stone-300 px-3 py-1 rounded-lg text-xs font-mono font-bold text-stone-800">
                    <span>Code:</span>
                    <span className="text-amber-700">{d.code}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 mt-3 border-t border-stone-100 flex justify-end">
                <button
                  onClick={() => {
                    if (confirm('Delete this deal?')) {
                      deleteOffer(d.id);
                      showToast('Deal removed.');
                    }
                  }}
                  className="text-red-500 hover:text-red-700 text-xs font-bold inline-flex items-center gap-1"
                >
                  <Trash2 size={13} />
                  <span>Remove Deal</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 bg-stone-50 border-2 border-dashed border-stone-300 rounded-2xl p-12 text-center">
            <Percent size={36} className="mx-auto text-stone-400 mb-3" />
            <h4 className="font-heading font-bold text-stone-700 text-base">No active offers or coupons</h4>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-4">
              Boost your customer acquisition by offering 10% off for first-time Bozeman residents or
              seasonal discounts.
            </p>
            <button
              onClick={() => setDealModalOpen(true)}
              className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors"
            >
              + Create Your First Offer
            </button>
          </div>
        )}
      </div>

      <OwnerDealModal
        isOpen={dealModalOpen}
        business={business}
        onClose={() => setDealModalOpen(false)}
        showToast={showToast}
      />
    </div>
  );
};
