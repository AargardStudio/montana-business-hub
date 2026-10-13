import React, { useState } from 'react';
import { useDirectory } from '../../context/DirectoryContext';
import { Business, ProductItem } from '../../types';
import { Plus, Edit, Trash2, ShoppingBag } from 'lucide-react';
import { OwnerProductModal } from './OwnerProductModal';

interface OwnerProductsSectionProps {
  business: Business;
  showToast: (msg: string) => void;
}

const AVAILABILITY_BADGE_CLASS: Record<string, string> = {
  in_stock: 'bg-emerald-600 text-white',
  made_to_order: 'bg-amber-600 text-white',
  limited: 'bg-orange-600 text-white',
};

/** "Digital Shop: Products" tab: retail/inventory catalog for the active business. */
export const OwnerProductsSection: React.FC<OwnerProductsSectionProps> = ({ business, showToast }) => {
  const { deleteProductFromBusiness, updateProductInBusiness } = useDirectory();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  const openAdd = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };
  const openEdit = (p: ProductItem) => {
    setEditingProduct(p);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <h3 className="font-heading font-bold text-base text-stone-900">
            Products & Inventory Catalog
          </h3>
          <p className="text-xs text-stone-500">
            Handcrafted wares, outdoor gear, artisanal provisions, and retail goods sold locally with
            direct WhatsApp reservation.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus size={15} />
          <span>+ Add New Product</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {business.products && business.products.length > 0 ? (
          business.products.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs flex flex-col justify-between hover:border-amber-400 transition-colors"
            >
              <div>
                <div className="h-44 w-full bg-stone-100 relative overflow-hidden">
                  <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wider ${
                        AVAILABILITY_BADGE_CLASS[p.availability] || 'bg-stone-700 text-white'
                      }`}
                    >
                      {p.availability.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-heading font-bold text-sm text-stone-900 line-clamp-1">
                      {p.name}
                    </h4>
                    <span className="font-heading font-extrabold text-amber-800 text-base shrink-0">
                      ${p.price}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 line-clamp-2 mb-2">{p.description}</p>
                  {p.sku && <span className="text-[10px] text-stone-400 font-mono">SKU: {p.sku}</span>}
                </div>
              </div>

              <div className="p-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                {/* Quick Stock toggle */}
                <select
                  value={p.availability}
                  onChange={(e) => {
                    updateProductInBusiness(business.id, p.id, {
                      availability: e.target.value as ProductItem['availability'],
                    });
                    showToast(`Updated stock status for ${p.name}`);
                  }}
                  className="text-[11px] bg-white border border-stone-300 rounded-lg px-2 py-1 text-stone-700 cursor-pointer"
                >
                  <option value="in_stock">In Stock</option>
                  <option value="limited">Limited Run</option>
                  <option value="made_to_order">Made to Order</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEdit(p)}
                    className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
                    title="Edit Product"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete product "${p.name}"?`)) {
                        deleteProductFromBusiness(business.id, p.id);
                        showToast('Product deleted.');
                      }
                    }}
                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete Product"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 bg-stone-50 border-2 border-dashed border-stone-300 rounded-2xl p-12 text-center">
            <ShoppingBag size={36} className="mx-auto text-stone-400 mb-3" />
            <h4 className="font-heading font-bold text-stone-700 text-base">
              No products in your digital shop
            </h4>
            <p className="text-xs text-stone-500 max-w-md mx-auto mt-1 mb-4">
              Showcase your handcrafted goods, merchandise, or packaged specialties. Customers can
              order or reserve with 1 click via WhatsApp.
            </p>
            <button
              onClick={openAdd}
              className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors"
            >
              + Add Your First Product
            </button>
          </div>
        )}
      </div>

      <OwnerProductModal
        isOpen={modalOpen}
        business={business}
        product={editingProduct}
        onClose={() => setModalOpen(false)}
        showToast={showToast}
      />
    </div>
  );
};
