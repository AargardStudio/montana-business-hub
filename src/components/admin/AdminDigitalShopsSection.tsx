import React, { useState } from 'react';
import { useDirectory } from '../../context/DirectoryContext';
import { Trash2 } from 'lucide-react';

interface AggregatedShopItem {
  id: string;
  itemType: 'service' | 'product';
  businessId: string;
  businessName: string;
  name: string;
  price?: number;
  priceType?: string;
  description: string;
  imageUrl?: string;
  availability?: string;
}

interface AdminDigitalShopsSectionProps {
  showToast: (msg: string) => void;
}

/**
 * Master "Control All Digital Shops" tab: a cross-business catalog of every
 * service and product, filterable by vendor and item type.
 */
export const AdminDigitalShopsSection: React.FC<AdminDigitalShopsSectionProps> = ({ showToast }) => {
  const { businesses, deleteServiceFromBusiness, deleteProductFromBusiness, openBusinessProfile } =
    useDirectory();

  const [shopBizFilter, setShopBizFilter] = useState('all');
  const [shopTypeFilter, setShopTypeFilter] = useState<'all' | 'service' | 'product'>('all');

  const allShopItems: AggregatedShopItem[] = [];
  businesses.forEach((b) => {
    (b.services || []).forEach((s) => {
      allShopItems.push({
        id: s.id,
        itemType: 'service',
        businessId: b.id,
        businessName: b.name,
        name: s.name,
        price: s.price,
        priceType: s.priceType,
        description: s.description,
        imageUrl: s.imageUrl,
      });
    });
    (b.products || []).forEach((p) => {
      allShopItems.push({
        id: p.id,
        itemType: 'product',
        businessId: b.id,
        businessName: b.name,
        name: p.name,
        price: p.price,
        priceType: p.priceType,
        description: p.description,
        imageUrl: p.imageUrl,
        availability: p.availability,
      });
    });
  });

  const filteredShopItems = allShopItems.filter((item) => {
    const matchesBiz = shopBizFilter === 'all' || item.businessId === shopBizFilter;
    const matchesType = shopTypeFilter === 'all' || item.itemType === shopTypeFilter;
    return matchesBiz && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="font-heading font-bold text-base text-stone-900">
            Master Digital Shop Catalog (All Vendors)
          </h3>
          <p className="text-xs text-stone-500">
            Manage, edit pricing, verify stock, or purge products and bookable services across all
            registered businesses.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={shopBizFilter}
            onChange={(e) => setShopBizFilter(e.target.value)}
            className="text-xs bg-stone-50 border border-stone-300 rounded-xl px-3 py-1.5 text-stone-700"
          >
            <option value="all">All Vendors / Businesses</option>
            {businesses.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>

          <select
            value={shopTypeFilter}
            onChange={(e) => setShopTypeFilter(e.target.value as 'all' | 'service' | 'product')}
            className="text-xs bg-stone-50 border border-stone-300 rounded-xl px-3 py-1.5 text-stone-700"
          >
            <option value="all">All Items (Services & Products)</option>
            <option value="service">Services Only</option>
            <option value="product">Products Only</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredShopItems.map((item) => (
          <div
            key={`${item.itemType}-${item.id}`}
            className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between hover:border-amber-400 transition-colors"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    item.itemType === 'service'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {item.itemType}
                </span>

                <span className="font-heading font-extrabold text-stone-900 text-base">
                  {item.price !== undefined ? `$${item.price}` : 'Quote Only'}
                </span>
              </div>

              <h4 className="font-heading font-bold text-stone-900 text-sm mb-1">{item.name}</h4>
              <p className="text-[11px] font-medium text-amber-800 mb-2">
                Vendor: {item.businessName}
              </p>
              <p className="text-xs text-stone-500 line-clamp-2 mb-4">{item.description}</p>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
              <span className="text-[10px] text-stone-400 font-mono">ID: {item.id}</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openBusinessProfile(item.businessId)}
                  className="text-[11px] text-stone-600 hover:text-stone-900 font-bold px-2 py-1 bg-stone-100 rounded-lg cursor-pointer"
                >
                  View Shop
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Remove "${item.name}" from ${item.businessName}'s digital shop?`)) {
                      if (item.itemType === 'service') {
                        deleteServiceFromBusiness(item.businessId, item.id);
                      } else {
                        deleteProductFromBusiness(item.businessId, item.id);
                      }
                      showToast(`Removed item from ${item.businessName}`);
                    }
                  }}
                  className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
                  title="Delete Item"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
