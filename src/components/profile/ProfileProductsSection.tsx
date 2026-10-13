import React from 'react';
import { useDirectory } from '../../context/DirectoryContext';
import { Business } from '../../types';
import { useProfileActions } from './useProfileActions';
import { MessageCircle } from 'lucide-react';

interface ProfileProductsSectionProps {
  business: Business;
}

/** "Digital Shop / Catalog" tab: full product catalog with inquiry/WhatsApp actions. */
export const ProfileProductsSection: React.FC<ProfileProductsSectionProps> = ({ business }) => {
  const { openLeadModal } = useDirectory();
  const { handleWhatsAppItem } = useProfileActions(business);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-6">
      <div>
        <h2 className="font-heading text-xl font-bold text-stone-900 mb-1">Digital Shop & Product Catalog</h2>
        <p className="text-xs text-stone-500">
          Browse locally crafted goods and inventory. Inquire directly or connect on WhatsApp without shopping
          cart friction.
        </p>
      </div>

      {!business.products || business.products.length === 0 ? (
        <p className="text-xs text-stone-500 py-8 text-center">No physical products listed currently.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {business.products.map((prd) => (
            <div
              key={prd.id}
              className="border border-stone-200 rounded-xl overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="relative h-48 w-full bg-stone-100">
                <img src={prd.imageUrl} alt={prd.name} className="w-full h-full object-cover" />
                <div className="absolute top-2.5 right-2.5 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded">
                  {prd.availability.replace('_', ' ')}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold text-stone-900 text-base">{prd.name}</h3>
                    <span className="text-sm font-extrabold text-amber-800">
                      {prd.price ? `$${prd.price}` : 'Contact for price'}
                    </span>
                  </div>

                  {prd.sku && <span className="text-[10px] text-stone-400 font-mono block mb-2">SKU: {prd.sku}</span>}

                  <p className="text-xs text-stone-600 mb-3 leading-relaxed">{prd.description}</p>

                  {/* Specs list */}
                  {prd.specs && Object.keys(prd.specs).length > 0 && (
                    <div className="bg-stone-50 p-2.5 rounded-lg text-[11px] space-y-1 mb-4">
                      {Object.entries(prd.specs).map(([k, v]) => (
                        <div key={k} className="flex justify-between">
                          <span className="text-stone-500">{k}:</span>
                          <strong className="text-stone-800">{v}</strong>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-stone-100">
                  <button
                    onClick={() => openLeadModal(business, 'inquiry', { type: 'product', id: prd.id, name: prd.name })}
                    className="bg-stone-900 hover:bg-stone-800 text-white font-bold py-2 px-3 rounded-lg text-xs text-center"
                  >
                    Ask About Product
                  </button>
                  <button
                    onClick={() => handleWhatsAppItem('product', prd.name)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle size={14} />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
