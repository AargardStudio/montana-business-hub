import React from 'react';
import { useDirectory } from '../../context/DirectoryContext';
import { Business } from '../../types';
import { TrustBadge } from '../TrustBadge';
import { useProfileActions } from './useProfileActions';
import { ArrowLeft, Scale, Bookmark, Share2, Star, BadgeCheck } from 'lucide-react';

interface ProfileHeaderProps {
  business: Business;
}

/** Top breadcrumb/return bar + hero cover banner for a business profile. */
export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ business }) => {
  const { closeBusinessProfile, savedBusinesses, toggleSaveBusiness, comparisonList, toggleCompare } =
    useDirectory();
  const { handleShare } = useProfileActions(business);

  const isSaved = savedBusinesses.includes(business.id);
  const isCompared = comparisonList.includes(business.id);

  const isProfileClaimed =
    business.claimStatus === 'claimed' ||
    business.claimStatus === 'verified' ||
    (business.claimStatus !== 'unclaimed' && business.verificationTier !== 'unclaimed');

  return (
    <>
      {/* Top Breadcrumb & Return Bar */}
      <div className="bg-white border-b border-stone-200 py-3 sticky top-16 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <button
            onClick={closeBusinessProfile}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-stone-700 hover:text-stone-950 transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to Bozeman Directory</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleCompare(business.id)}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                isCompared
                  ? 'bg-amber-500 text-stone-950 border-amber-600'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-300'
              }`}
            >
              <Scale size={14} />
              <span>{isCompared ? 'Comparing' : 'Compare'}</span>
            </button>

            <button
              onClick={() => toggleSaveBusiness(business.id)}
              className={`p-2 rounded-lg text-xs border transition-colors cursor-pointer ${
                isSaved
                  ? 'bg-amber-500 text-stone-950 border-amber-600'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-300'
              }`}
              title="Save to Favorites"
            >
              <Bookmark size={15} className={isSaved ? 'fill-stone-950' : ''} />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-lg text-xs border border-stone-300 bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
              title="Share profile"
            >
              <Share2 size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Cover Banner */}
      <div className="relative h-64 sm:h-80 lg:h-96 w-full bg-stone-900 overflow-hidden">
        <img src={business.coverUrl} alt={business.name} className="w-full h-full object-cover opacity-85" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

        <div className="absolute bottom-6 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex items-end gap-4">
            <img
              src={business.logoUrl}
              alt={`${business.name} logo`}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white shadow-xl bg-stone-900 shrink-0"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider bg-amber-500 text-stone-950 px-2.5 py-0.5 rounded-md">
                  {business.categoryName}
                </span>
                <TrustBadge
                  tier={business.verificationTier}
                  verifiedItemsCount={business.verifiedItems.length}
                  size="sm"
                />
              </div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="font-heading text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  {business.name}
                </h1>
                {isProfileClaimed && (
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-400/40 shadow-xs"
                    title="Verified Profile: Claimed and verified by business owner"
                  >
                    <BadgeCheck size={14} className="text-sky-400 fill-sky-400/20" />
                    <span>Verified</span>
                  </span>
                )}
              </div>
              <p className="text-stone-300 text-xs sm:text-sm font-medium mt-0.5 line-clamp-1">
                {business.tagline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-stone-900/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-stone-700/80 text-xs">
            <div className="flex items-center text-amber-400 font-bold">
              <Star size={16} className="fill-amber-400 mr-1" />
              <span className="text-sm">{business.rating}</span>
            </div>
            <span className="text-stone-400">({business.reviewsCount} reviews)</span>
            <span className="text-stone-500">•</span>
            <span className="text-stone-200">{business.yearsInBusiness} yrs in business</span>
          </div>
        </div>
      </div>
    </>
  );
};
