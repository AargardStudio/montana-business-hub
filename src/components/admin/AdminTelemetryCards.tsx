import React from 'react';
import { useDirectory } from '../../context/DirectoryContext';

/**
 * High-level KPI cards shown at the top of the master admin dashboard.
 */
export const AdminTelemetryCards: React.FC = () => {
  const { businesses, leads, categories } = useDirectory();

  const totalCount = businesses.length;
  const claimedCount = businesses.filter((b) => b.claimStatus === 'claimed').length;
  const credentialCount = businesses.filter(
    (b) => b.verificationTier === 'credential_verified'
  ).length;

  const totalServices = businesses.reduce((acc, b) => acc + (b.services?.length || 0), 0);
  const totalProducts = businesses.reduce((acc, b) => acc + (b.products?.length || 0), 0);
  const totalShopItems = totalServices + totalProducts;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-8">
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs">
        <span className="text-[11px] text-stone-500 font-medium block">Total Listings</span>
        <span className="font-heading font-extrabold text-2xl text-stone-900 block mt-1">{totalCount}</span>
        <span className="text-[10px] text-stone-400">All Bozeman listings</span>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs">
        <span className="text-[11px] text-stone-500 font-medium block">Claimed Vendors</span>
        <span className="font-heading font-extrabold text-2xl text-amber-700 block mt-1">{claimedCount}</span>
        <span className="text-[10px] text-stone-400">
          {totalCount > 0 ? Math.round((claimedCount / totalCount) * 100) : 0}% claimed
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs">
        <span className="text-[11px] text-stone-500 font-medium block">Verified Shield</span>
        <span className="font-heading font-extrabold text-2xl text-emerald-700 block mt-1">{credentialCount}</span>
        <span className="text-[10px] text-emerald-600 font-medium">Audited & approved</span>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs">
        <span className="text-[11px] text-stone-500 font-medium block">Digital Shop Items</span>
        <span className="font-heading font-extrabold text-2xl text-blue-700 block mt-1">{totalShopItems}</span>
        <span className="text-[10px] text-stone-400">{totalServices} srv • {totalProducts} prod</span>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs">
        <span className="text-[11px] text-stone-500 font-medium block">Customer Leads</span>
        <span className="font-heading font-extrabold text-2xl text-purple-700 block mt-1">{leads.length}</span>
        <span className="text-[10px] text-purple-600 font-medium">Quotes & bookings</span>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs">
        <span className="text-[11px] text-stone-500 font-medium block">Categories</span>
        <span className="font-heading font-extrabold text-2xl text-stone-900 block mt-1">{categories.length}</span>
        <span className="text-[10px] text-stone-400">Active taxonomies</span>
      </div>
    </div>
  );
};
