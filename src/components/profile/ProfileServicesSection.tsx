import React from 'react';
import { useDirectory } from '../../context/DirectoryContext';
import { Business } from '../../types';
import { useProfileActions } from './useProfileActions';
import { MessageCircle } from 'lucide-react';

interface ProfileServicesSectionProps {
  business: Business;
}

/** "Services" tab: full bookable-services catalog with quote/WhatsApp actions. */
export const ProfileServicesSection: React.FC<ProfileServicesSectionProps> = ({ business }) => {
  const { openLeadModal } = useDirectory();
  const { handleWhatsAppItem } = useProfileActions(business);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-6">
      <div>
        <h2 className="font-heading text-xl font-bold text-stone-900 mb-1">Services Catalog</h2>
        <p className="text-xs text-stone-500">
          Explore available services, durations, pricing estimates, and request an itemized quote.
        </p>
      </div>

      {!business.services || business.services.length === 0 ? (
        <p className="text-xs text-stone-500 py-8 text-center">No individual services listed currently.</p>
      ) : (
        <div className="space-y-4">
          {business.services.map((srv) => (
            <div
              key={srv.id}
              className="border border-stone-200 rounded-xl p-5 hover:border-amber-400 hover:shadow-xs transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                {srv.imageUrl && (
                  <img
                    src={srv.imageUrl}
                    alt={srv.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 hidden sm:block"
                  />
                )}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-stone-900 text-sm sm:text-base">{srv.name}</h3>
                    {srv.popular && (
                      <span className="text-[10px] uppercase font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-600 mb-2 leading-relaxed">{srv.description}</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
                    {srv.duration && <span>⏱ Duration: {srv.duration}</span>}
                    {srv.category && <span>📁 {srv.category}</span>}
                  </div>
                </div>
              </div>

              <div className="w-full sm:w-auto text-left sm:text-right shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-100 flex sm:flex-col items-center sm:items-end justify-between gap-2">
                <div>
                  <div className="text-sm sm:text-base font-extrabold text-stone-900">
                    {srv.price ? `${srv.priceType === 'starting_at' ? 'Starting at ' : ''}$${srv.price}` : 'Contact for estimate'}
                  </div>
                  {srv.priceUnit && <div className="text-[11px] text-stone-400 font-medium">/{srv.priceUnit}</div>}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openLeadModal(business, 'quote', { type: 'service', id: srv.id, name: srv.name })}
                    className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-3.5 py-1.5 rounded-lg text-xs transition-colors"
                  >
                    Request Quote
                  </button>
                  <button
                    onClick={() => handleWhatsAppItem('service', srv.name)}
                    className="p-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg hover:bg-emerald-100"
                    title="Ask on WhatsApp"
                  >
                    <MessageCircle size={15} />
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
