import React, { useEffect, useState } from 'react';
import { useDirectory } from '../../context/DirectoryContext';
import { Business, ServiceItem } from '../../types';
import { X } from 'lucide-react';

interface OwnerServiceModalProps {
  isOpen: boolean;
  business: Business;
  /** The service being edited, or null when adding a new one. */
  service: ServiceItem | null;
  onClose: () => void;
  showToast: (msg: string) => void;
}

/** Modal for adding or editing a single bookable service in the digital shop. */
export const OwnerServiceModal: React.FC<OwnerServiceModalProps> = ({
  isOpen,
  business,
  service,
  onClose,
  showToast,
}) => {
  const { addServiceToBusiness, updateServiceInBusiness } = useDirectory();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [priceType, setPriceType] = useState<ServiceItem['priceType']>('starting_at');
  const [priceUnit, setPriceUnit] = useState('project');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [popular, setPopular] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (service) {
      setName(service.name);
      setPrice(service.price?.toString() || '');
      setPriceType(service.priceType || 'fixed');
      setPriceUnit(service.priceUnit || 'project');
      setDuration(service.duration || '');
      setDescription(service.description);
      setPopular(Boolean(service.popular));
    } else {
      setName('');
      setPrice('150');
      setPriceType('starting_at');
      setPriceUnit('project');
      setDuration('1-3 days');
      setDescription('');
      setPopular(false);
    }
  }, [isOpen, service]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (service) {
      updateServiceInBusiness(business.id, service.id, {
        name,
        price: price ? Number(price) : undefined,
        priceType,
        priceUnit,
        duration,
        description,
        popular,
      });
      showToast('Service updated successfully!');
    } else {
      const newService: ServiceItem = {
        id: 'srv-' + Date.now(),
        name,
        description: description || 'Available for booking in Bozeman and Gallatin County.',
        price: price ? Number(price) : undefined,
        priceType,
        priceUnit,
        duration,
        popular,
      };
      addServiceToBusiness(business.id, newService);
      showToast('New service published to your Digital Shop!');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
          <h3 className="font-heading font-bold text-lg text-stone-900">
            {service ? 'Edit Service' : 'Add New Service to Shop'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-stone-400 hover:text-stone-700">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-stone-700 uppercase mb-1">Service Title *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Custom Dining Table Fabrication"
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 uppercase mb-1">Price ($)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="150"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 uppercase mb-1">Pricing Structure</label>
              <select
                value={priceType}
                onChange={(e) => setPriceType(e.target.value as ServiceItem['priceType'])}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
              >
                <option value="starting_at">Starting At</option>
                <option value="fixed">Fixed Price</option>
                <option value="hourly">Hourly Rate</option>
                <option value="quote">Custom Quote Only</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 uppercase mb-1">Unit</label>
              <input
                type="text"
                value={priceUnit}
                onChange={(e) => setPriceUnit(e.target.value)}
                placeholder="project, hour, session"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 uppercase mb-1">Estimated Turnaround</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 1-2 weeks, 90 mins"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-700 uppercase mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail what is included, materials used, or client preparation..."
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="srvPop"
              checked={popular}
              onChange={(e) => setPopular(e.target.checked)}
              className="rounded text-amber-500"
            />
            <label htmlFor="srvPop" className="font-semibold text-stone-700">
              Feature as "Popular Service" in Digital Catalog
            </label>
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
              Save Service
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
