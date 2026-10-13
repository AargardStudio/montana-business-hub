import React, { useState } from 'react';
import { useDirectory } from '../../context/DirectoryContext';
import { Business, ServiceItem } from '../../types';
import { Plus, Edit, Trash2, Clock, Layers } from 'lucide-react';
import { OwnerServiceModal } from './OwnerServiceModal';

interface OwnerServicesSectionProps {
  business: Business;
  showToast: (msg: string) => void;
}

/** "Digital Shop: Services" tab: bookable service catalog for the active business. */
export const OwnerServicesSection: React.FC<OwnerServicesSectionProps> = ({ business, showToast }) => {
  const { deleteServiceFromBusiness } = useDirectory();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  const openAdd = () => {
    setEditingService(null);
    setModalOpen(true);
  };
  const openEdit = (s: ServiceItem) => {
    setEditingService(s);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <h3 className="font-heading font-bold text-base text-stone-900">
            Services Catalog & Quote Configurator
          </h3>
          <p className="text-xs text-stone-500">
            List your bookable services. Shoppers can request tailored quotes or book consultations
            directly.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus size={15} />
          <span>+ Add New Service</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {business.services && business.services.length > 0 ? (
          business.services.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between hover:border-amber-400 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-heading font-bold text-sm text-stone-900">{s.name}</h4>
                      {s.popular && (
                        <span className="bg-amber-500/15 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Popular
                        </span>
                      )}
                    </div>
                    {s.duration && (
                      <span className="text-[11px] text-stone-400 flex items-center gap-1 mt-0.5">
                        <Clock size={11} />
                        <span>Estimated: {s.duration}</span>
                      </span>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="font-heading font-extrabold text-stone-900 text-base">
                      {s.price ? `$${s.price}` : 'Quote Only'}
                    </span>
                    {s.priceType && s.priceType !== 'fixed' && (
                      <span className="block text-[10px] text-stone-500 capitalize">
                        {s.priceType.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-stone-600 mb-4 line-clamp-2">{s.description}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                <span className="text-[11px] text-stone-400 font-mono">ID: {s.id}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(s)}
                    className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                    title="Edit Service"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Remove "${s.name}" from your digital shop?`)) {
                        deleteServiceFromBusiness(business.id, s.id);
                        showToast('Service removed.');
                      }
                    }}
                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete Service"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 bg-stone-50 border-2 border-dashed border-stone-300 rounded-2xl p-12 text-center">
            <Layers size={36} className="mx-auto text-stone-400 mb-3" />
            <h4 className="font-heading font-bold text-stone-700 text-base">No services listed yet</h4>
            <p className="text-xs text-stone-500 max-w-md mx-auto mt-1 mb-4">
              Add consulting, custom fabrication, maintenance, or repair services to allow customers
              to request direct quotes.
            </p>
            <button
              onClick={openAdd}
              className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors"
            >
              + Add Your First Service
            </button>
          </div>
        )}
      </div>

      <OwnerServiceModal
        isOpen={modalOpen}
        business={business}
        service={editingService}
        onClose={() => setModalOpen(false)}
        showToast={showToast}
      />
    </div>
  );
};
