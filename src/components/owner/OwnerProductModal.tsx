import React, { useEffect, useState } from 'react';
import { useDirectory } from '../../context/DirectoryContext';
import { Business, ProductItem } from '../../types';
import { X } from 'lucide-react';

interface OwnerProductModalProps {
  isOpen: boolean;
  business: Business;
  /** The product being edited, or null when adding a new one. */
  product: ProductItem | null;
  onClose: () => void;
  showToast: (msg: string) => void;
}

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80';

/** Modal for adding or editing a single product in the digital shop catalog. */
export const OwnerProductModal: React.FC<OwnerProductModalProps> = ({
  isOpen,
  business,
  product,
  onClose,
  showToast,
}) => {
  const { addProductToBusiness, updateProductInBusiness } = useDirectory();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [availability, setAvailability] = useState<ProductItem['availability']>('in_stock');
  const [sku, setSku] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    if (product) {
      setName(product.name);
      setPrice(product.price !== undefined ? product.price.toString() : '');
      setDescription(product.description);
      setImageUrl(product.imageUrl);
      setAvailability(product.availability);
      setSku(product.sku || '');
    } else {
      setName('');
      setPrice('45');
      setDescription('');
      setImageUrl(DEFAULT_IMAGE);
      setAvailability('in_stock');
      setSku('BZN-' + Math.floor(1000 + Math.random() * 9000));
    }
  }, [isOpen, product]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (product) {
      updateProductInBusiness(business.id, product.id, {
        name,
        price: Number(price) || 0,
        description,
        imageUrl,
        availability,
        sku,
      });
      showToast('Product updated successfully!');
    } else {
      const newProd: ProductItem = {
        id: 'prod-' + Date.now(),
        name,
        priceType: 'fixed',
        price: Number(price) || 0,
        description: description || 'Local handcrafted product from Bozeman, MT.',
        imageUrl: imageUrl || DEFAULT_IMAGE,
        availability,
        sku: sku || 'BZN-101',
        tags: ['Local Goods', 'Bozeman Made'],
      };
      addProductToBusiness(business.id, newProd);
      showToast('Product added to your Digital Catalog!');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
          <h3 className="font-heading font-bold text-lg text-stone-900">
            {product ? 'Edit Product' : 'Add New Product to Digital Shop'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-stone-400 hover:text-stone-700">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-stone-700 uppercase mb-1">Product Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Handcrafted Walnut Cutting Board"
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 uppercase mb-1">Price ($) *</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="85"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 uppercase mb-1">Availability Status</label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value as ProductItem['availability'])}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
              >
                <option value="in_stock">In Stock</option>
                <option value="low_stock">Low Stock</option>
                <option value="made_to_order">Made to Order</option>
                <option value="pre_order">Pre-Order</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-700 uppercase mb-1">Image URL</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 uppercase mb-1">SKU / Product Code</label>
            <input
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="e.g. BZN-WOOD-01"
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 uppercase mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Artisan materials, dimensions, local Bozeman pickup details..."
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
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
