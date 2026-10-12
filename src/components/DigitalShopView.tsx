import React, { useState, useMemo } from 'react';
import { useDirectory } from '../context/DirectoryContext';
import { getContextualWhatsAppUrl } from '../utils/helpers';
import {
  ShoppingBag,
  Wrench,
  Search,
  Filter,
  MessageCircle,
  FileText,
  Building,
  ExternalLink,
} from 'lucide-react';

export const DigitalShopView: React.FC = () => {
  const { businesses, openLeadModal, openBusinessProfile, trackInteraction } = useDirectory();
  const [filterType, setFilterType] = useState<'all' | 'services' | 'products'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Collect all services and products across all businesses
  const catalogItems = useMemo(() => {
    const items: Array<{
      id: string;
      businessId: string;
      businessName: string;
      businessCategory: string;
      businessNeighborhood: string;
      businessPhone: string;
      businessWhatsapp: string;
      itemType: 'service' | 'product';
      name: string;
      description: string;
      price?: number;
      priceType?: string;
      priceUnit?: string;
      imageUrl: string;
      extraInfo?: string;
    }> = [];

    businesses.forEach((b) => {
      // Add services
      b.services?.forEach((s) => {
        items.push({
          id: `srv-${s.id}`,
          businessId: b.id,
          businessName: b.name,
          businessCategory: b.categoryName,
          businessNeighborhood: b.location.neighborhood,
          businessPhone: b.contact.phone,
          businessWhatsapp: b.contact.whatsapp,
          itemType: 'service',
          name: s.name,
          description: s.description,
          price: s.price,
          priceType: s.priceType,
          priceUnit: s.priceUnit,
          imageUrl: s.imageUrl || b.coverUrl,
          extraInfo: s.duration ? `Duration: ${s.duration}` : undefined,
        });
      });

      // Add products
      b.products?.forEach((p) => {
        items.push({
          id: `prd-${p.id}`,
          businessId: b.id,
          businessName: b.name,
          businessCategory: b.categoryName,
          businessNeighborhood: b.location.neighborhood,
          businessPhone: b.contact.phone,
          businessWhatsapp: b.contact.whatsapp,
          itemType: 'product',
          name: p.name,
          description: p.description,
          price: p.price,
          priceType: 'fixed',
          imageUrl: p.imageUrl,
          extraInfo: p.availability ? `Status: ${p.availability.replace('_', ' ')}` : undefined,
        });
      });
    });

    return items;
  }, [businesses]);

  const filteredItems = useMemo(() => {
    return catalogItems.filter((item) => {
      if (filterType !== 'all' && item.itemType !== (filterType === 'services' ? 'service' : 'product')) {
        return false;
      }
      if (selectedCategory && item.businessCategory !== selectedCategory) {
        return false;
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchBiz = item.businessName.toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchBiz) return false;
      }
      return true;
    });
  }, [catalogItems, filterType, selectedCategory, searchQuery]);

  const allCategories = Array.from(new Set(catalogItems.map((i) => i.businessCategory)));

  const handleWhatsAppChat = (item: any) => {
    trackInteraction(item.businessId, 'whatsappClicks');
    const url = getContextualWhatsAppUrl(item.businessWhatsapp, item.businessName, {
      type: item.itemType,
      itemName: item.name,
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleItemInquire = (item: any) => {
    const business = businesses.find((b) => b.id === item.businessId);
    if (!business) return;
    openLeadModal(business, item.itemType === 'service' ? 'quote' : 'inquiry', {
      type: item.itemType,
      id: item.id,
      name: item.name,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="max-w-3xl mb-8">
        <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-900 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-semibold mb-3">
          <ShoppingBag size={14} className="text-amber-600" />
          <span>Bozeman Digital Storefronts & Services</span>
        </div>
        <h1 className="font-heading text-3xl font-extrabold text-stone-900 tracking-tight mb-2">
          Local Products & Services Catalog
        </h1>
        <p className="text-sm text-stone-600 leading-relaxed">
          Browse items, equipment, consultations, and craft services offered by local Bozeman businesses. Order, book, or connect directly on WhatsApp without commission markups.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Type Toggle */}
        <div className="inline-flex bg-stone-100 p-1 rounded-xl">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              filterType === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
            }`}
          >
            All Catalog ({catalogItems.length})
          </button>
          <button
            onClick={() => setFilterType('services')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ${
              filterType === 'services' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
            }`}
          >
            <Wrench size={13} />
            <span>Services</span>
          </button>
          <button
            onClick={() => setFilterType('products')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ${
              filterType === 'products' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
            }`}
          >
            <ShoppingBag size={13} />
            <span>Products</span>
          </button>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md relative">
          <Search size={16} className="text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items, timber frames, ski tunes, sourdough..."
            className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-900 outline-hidden focus:border-amber-500"
          />
        </div>

        {/* Category dropdown */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-800 font-medium outline-hidden"
        >
          <option value="">All Categories</option>
          {allCategories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative h-48 w-full bg-stone-100 overflow-hidden">
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-2.5 left-2.5 flex gap-1">
                  <span className="text-[10px] uppercase font-bold bg-stone-900/80 backdrop-blur-xs text-amber-300 px-2 py-0.5 rounded">
                    {item.itemType}
                  </span>
                  {item.extraInfo && (
                    <span className="text-[10px] bg-black/60 backdrop-blur-xs text-white px-2 py-0.5 rounded">
                      {item.extraInfo}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-5">
                <button
                  onClick={() => openBusinessProfile(item.businessId)}
                  className="text-xs font-semibold text-amber-800 hover:text-amber-900 flex items-center gap-1 mb-1"
                >
                  <Building size={12} />
                  <span>{item.businessName}</span>
                </button>

                <h3 className="font-heading font-bold text-base text-stone-900 mb-1 leading-snug">
                  {item.name}
                </h3>

                <p className="text-xs text-stone-600 line-clamp-2 mb-3 leading-relaxed">
                  {item.description}
                </p>

                <div className="flex items-baseline justify-between border-t border-stone-100 pt-3">
                  <span className="text-xs text-stone-400">
                    {item.itemType === 'service' ? 'Service Rate' : 'Price'}
                  </span>
                  <span className="font-heading font-extrabold text-stone-900 text-base">
                    {item.price ? `${item.priceType === 'starting_at' ? 'From ' : ''}$${item.price}` : 'Inquire for pricing'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 pt-0 border-t border-stone-100 mt-2">
              <div className="grid grid-cols-2 gap-2 pt-3">
                <button
                  onClick={() => handleItemInquire(item)}
                  className="py-2 px-3 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl text-xs text-center transition-colors"
                >
                  {item.itemType === 'service' ? 'Get Quote' : 'Inquire'}
                </button>

                <button
                  onClick={() => handleWhatsAppChat(item)}
                  className="py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageCircle size={14} />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
