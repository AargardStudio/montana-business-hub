import React, { useState } from 'react';
import { useDirectory } from '../../context/DirectoryContext';
import { Business, VerificationTier } from '../../types';
import { Search, Star, Edit, Trash2, ExternalLink } from 'lucide-react';
import { AdminBusinessModal } from './AdminBusinessModal';

interface AdminBusinessesSectionProps {
  showToast: (msg: string) => void;
}

/**
 * Master "Control Listings" tab: searchable/filterable business table with
 * inline tier/claim/featured overrides, plus the add/edit business modal.
 */
export const AdminBusinessesSection: React.FC<AdminBusinessesSectionProps> = ({ showToast }) => {
  const {
    businesses,
    categories,
    updateBusinessProfile,
    deleteBusiness,
    addAdminLog,
    openBusinessProfile,
  } = useDirectory();

  const [bizSearch, setBizSearch] = useState('');
  const [bizCategoryFilter, setBizCategoryFilter] = useState('all');
  const [bizTierFilter, setBizTierFilter] = useState<string>('all');
  const [bizClaimFilter, setBizClaimFilter] = useState<string>('all');

  const [bizModalOpen, setBizModalOpen] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);

  const openAddBizModal = () => {
    setEditingBusiness(null);
    setBizModalOpen(true);
  };

  const openEditBizModal = (b: Business) => {
    setEditingBusiness(b);
    setBizModalOpen(true);
  };

  const filteredBusinesses = businesses.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(bizSearch.toLowerCase()) ||
      b.categoryName.toLowerCase().includes(bizSearch.toLowerCase()) ||
      b.location.neighborhood.toLowerCase().includes(bizSearch.toLowerCase());
    const matchesCat = bizCategoryFilter === 'all' || b.categoryId === bizCategoryFilter;
    const matchesTier = bizTierFilter === 'all' || b.verificationTier === bizTierFilter;
    const matchesClaim = bizClaimFilter === 'all' || b.claimStatus === bizClaimFilter;
    return matchesSearch && matchesCat && matchesTier && matchesClaim;
  });

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={bizSearch}
            onChange={(e) => setBizSearch(e.target.value)}
            placeholder="Search by business name, category, or neighborhood..."
            className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-amber-500"
          />
          <Search size={14} className="text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={bizCategoryFilter}
            onChange={(e) => setBizCategoryFilter(e.target.value)}
            className="bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-1.5 text-xs text-stone-700"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={bizTierFilter}
            onChange={(e) => setBizTierFilter(e.target.value)}
            className="bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-1.5 text-xs text-stone-700"
          >
            <option value="all">All Verification Tiers</option>
            <option value="unclaimed">Unclaimed</option>
            <option value="claimed">Claimed</option>
            <option value="verified">Verified</option>
            <option value="credential_verified">Credential Verified</option>
            <option value="featured">Featured</option>
          </select>

          <select
            value={bizClaimFilter}
            onChange={(e) => setBizClaimFilter(e.target.value)}
            className="bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-1.5 text-xs text-stone-700"
          >
            <option value="all">All Claim Statuses</option>
            <option value="claimed">Claimed</option>
            <option value="unclaimed">Unclaimed</option>
          </select>

          <button
            onClick={openAddBizModal}
            className="bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold px-3 py-1.5 rounded-xl transition-colors shrink-0"
          >
            + New Business
          </button>
        </div>
      </div>

      {/* Business Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-600 uppercase font-bold border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Business & Location</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Verification Tier</th>
                <th className="py-3 px-3">Claim Status</th>
                <th className="py-3 px-3">Featured</th>
                <th className="py-3 px-3 text-center">Shop Items</th>
                <th className="py-3 px-4 text-right">Master Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {filteredBusinesses.map((b) => (
                <tr key={b.id} className="hover:bg-amber-50/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={b.logoUrl}
                        alt=""
                        className="w-10 h-10 rounded-xl object-cover border border-stone-200 bg-stone-100 shrink-0"
                      />
                      <div>
                        <span className="font-heading font-bold text-stone-900 block text-xs">
                          {b.name}
                        </span>
                        <span className="text-[11px] text-stone-500">
                          {b.location.neighborhood} • {b.contact.formattedPhone}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3 text-stone-600 font-medium">{b.categoryName}</td>

                  {/* Instant Tier Override Dropdown */}
                  <td className="py-3 px-3">
                    <select
                      value={b.verificationTier}
                      onChange={(e) => {
                        const newTier = e.target.value as VerificationTier;
                        updateBusinessProfile(b.id, {
                          verificationTier: newTier,
                          claimStatus: newTier === 'unclaimed' ? 'unclaimed' : 'claimed',
                        });
                        addAdminLog('Overrode Tier', `Changed tier of ${b.name} to ${newTier}`);
                        showToast(`Updated tier for ${b.name}`);
                      }}
                      className="text-[11px] font-bold bg-stone-50 border border-stone-300 rounded-lg px-2 py-1 text-stone-800 cursor-pointer"
                    >
                      <option value="unclaimed">Unclaimed</option>
                      <option value="claimed">Claimed</option>
                      <option value="verified">Verified</option>
                      <option value="credential_verified">Credential Verified</option>
                      <option value="featured">Featured</option>
                    </select>
                  </td>

                  {/* Claim Status Toggle */}
                  <td className="py-3 px-3">
                    <button
                      onClick={() => {
                        const newStatus = b.claimStatus === 'claimed' ? 'unclaimed' : 'claimed';
                        updateBusinessProfile(b.id, { claimStatus: newStatus });
                        addAdminLog('Toggled Claim Status', `${b.name} set to ${newStatus}`);
                        showToast(`${b.name} marked as ${newStatus}`);
                      }}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer uppercase tracking-wider ${
                        b.claimStatus === 'claimed'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      {b.claimStatus}
                    </button>
                  </td>

                  {/* Featured Star Toggle */}
                  <td className="py-3 px-3">
                    <button
                      onClick={() => {
                        updateBusinessProfile(b.id, { featured: !b.featured });
                        addAdminLog('Toggled Featured', `${b.name} featured: ${!b.featured}`);
                        showToast(`${b.name} ${!b.featured ? 'Featured' : 'Unfeatured'}`);
                      }}
                      className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                        b.featured ? 'text-amber-500 bg-amber-50' : 'text-stone-300 hover:text-stone-500'
                      }`}
                    >
                      <Star size={16} fill={b.featured ? 'currentColor' : 'none'} />
                    </button>
                  </td>

                  {/* Shop item counts */}
                  <td className="py-3 px-3 text-center text-stone-600">
                    <span className="font-mono font-bold">
                      {(b.services?.length || 0) + (b.products?.length || 0)}
                    </span>
                    <span className="text-[10px] text-stone-400 block">
                      {b.services?.length || 0}s / {b.products?.length || 0}p
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => openBusinessProfile(b.id)}
                        className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg cursor-pointer"
                        title="Preview Public Listing"
                      >
                        <ExternalLink size={14} />
                      </button>
                      <button
                        onClick={() => openEditBizModal(b)}
                        className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg cursor-pointer"
                        title="Edit Business"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Permanently delete "${b.name}" from Bozeman directory?`)) {
                            deleteBusiness(b.id);
                            showToast(`Deleted ${b.name}`);
                          }
                        }}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
                        title="Delete Business"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AdminBusinessModal
        isOpen={bizModalOpen}
        business={editingBusiness}
        onClose={() => setBizModalOpen(false)}
        showToast={showToast}
      />
    </div>
  );
};
