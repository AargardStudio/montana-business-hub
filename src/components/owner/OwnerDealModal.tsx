import React, { useEffect, useState } from 'react';
import { useDirectory } from '../../context/DirectoryContext';
import { Business, OfferItem } from '../../types';
import { X } from 'lucide-react';

interface OwnerDealModalProps {
  isOpen: boolean;
  business: Business;
  onClose: () => void;
  showToast: (msg: string) => void;
}

/** Modal for creating a new local deal/promo-code offer for the active business. */
export const OwnerDealModal: React.FC<OwnerDealModalProps> = ({ isOpen, business, onClose, showToast }) => {
  const { addOffer } = useDirectory();

  const [dealTitle, setDealTitle] = useState('');
  const [dealTag, setDealTag] = useState('15% OFF');
  const [dealCode, setDealCode] = useState('LOCAL15');
  const [dealDesc, setDealDesc] = useState('');
  const [dealValid, setDealValid] = useState('End of month');

  useEffect(() => {
    if (!isOpen) return;
    setDealTitle('');
    setDealTag('15% OFF');
    setDealCode('LOCAL15');
    setDealDesc('');
    setDealValid('End of month');
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dealTitle.trim()) return;
    const newOffer: OfferItem = {
      id: 'off-' + Date.now(),
      businessId: business.id,
      businessName: business.name,
      title: dealTitle,
      discountTag: dealTag,
      description: dealDesc,
      code: dealCode,
      validUntil: dealValid,
    };
    addOffer(newOffer);
    showToast('Promotional deal published for Bozeman shoppers!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
          <h3 className="font-heading font-bold text-lg text-stone-900">Create Special Deal</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-stone-400 hover:text-stone-700">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-stone-700 uppercase mb-1">Offer Headline *</label>
            <input
              type="text"
              required
              value={dealTitle}
              onChange={(e) => setDealTitle(e.target.value)}
              placeholder="e.g. 15% Off Handcrafted Cutting Boards"
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 uppercase mb-1">Discount Tag *</label>
              <input
                type="text"
                required
                value={dealTag}
                onChange={(e) => setDealTag(e.target.value)}
                placeholder="15% OFF, $20 OFF"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 uppercase mb-1">Promo Code</label>
              <input
                type="text"
                value={dealCode}
                onChange={(e) => setDealCode(e.target.value)}
                placeholder="BOZEMAN15"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-700 uppercase mb-1">Valid Until</label>
            <input
              type="text"
              value={dealValid}
              onChange={(e) => setDealValid(e.target.value)}
              placeholder="e.g. Next Sunday, End of October"
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 uppercase mb-1">Terms & Details</label>
            <textarea
              rows={2}
              value={dealDesc}
              onChange={(e) => setDealDesc(e.target.value)}
              placeholder="Valid for in-store pickup or local delivery..."
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
            />
          </div>

          <div className="pt-4 border-t border-stone-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-stone-100 text-stone-700 font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl"
            >
              Save Deal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
