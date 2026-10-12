import React, { useState } from 'react';
import { VerificationTier } from '../types';
import { ShieldCheck, Award, CheckCircle2, Star, HelpCircle } from 'lucide-react';

interface TrustBadgeProps {
  tier: VerificationTier;
  verifiedItemsCount?: number;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const TrustBadge: React.FC<TrustBadgeProps> = ({
  tier,
  verifiedItemsCount = 0,
  showText = true,
  size = 'md',
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const getTierConfig = () => {
    switch (tier) {
      case 'credential_verified':
        return {
          icon: Award,
          label: 'Credential Verified',
          badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-emerald-600/20',
          iconColor: 'text-emerald-700',
          tooltip:
            'Credential Verified: State contractor licenses, professional certifications, and commercial liability insurance have been independently validated by platform auditors.',
        };
      case 'verified':
        return {
          icon: ShieldCheck,
          label: 'Verified Business',
          badgeClass: 'bg-blue-50 text-blue-800 border-blue-300 ring-blue-600/20',
          iconColor: 'text-blue-700',
          tooltip:
            'Verified Business: Business ownership, physical Bozeman address, phone, and official contact channels have been verified.',
        };
      case 'claimed':
        return {
          icon: CheckCircle2,
          label: 'Claimed by Owner',
          badgeClass: 'bg-amber-50 text-amber-800 border-amber-300 ring-amber-600/20',
          iconColor: 'text-amber-700',
          tooltip:
            'Claimed Profile: Business owner has claimed this profile and actively updates services, products, and contact details.',
        };
      case 'featured':
        return {
          icon: Star,
          label: 'Featured Partner',
          badgeClass: 'bg-purple-50 text-purple-800 border-purple-300 ring-purple-600/20',
          iconColor: 'text-purple-700',
          tooltip:
            'Featured Partner: Highlighted local business partner. (Note: Featured status indicates visibility placement, not comparative endorsement).',
        };
      case 'unclaimed':
      default:
        return {
          icon: HelpCircle,
          label: 'Unclaimed Listing',
          badgeClass: 'bg-stone-100 text-stone-600 border-stone-300 ring-stone-500/10',
          iconColor: 'text-stone-500',
          tooltip:
            'Unclaimed Listing: Basic public business directory entry. Business owner has not yet claimed or verified this profile.',
        };
    }
  };

  const config = getTierConfig();
  const IconComponent = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  }[size];

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  }[size];

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={(e) => {
        e.stopPropagation();
        setShowTooltip(!showTooltip);
      }}
    >
      <span
        className={`inline-flex items-center font-medium border rounded-full shadow-xs cursor-pointer select-none transition-all hover:brightness-95 ${config.badgeClass} ${sizeClasses}`}
      >
        <IconComponent size={iconSizes} className={`shrink-0 ${config.iconColor}`} />
        {showText && <span>{config.label}</span>}
      </span>

      {showTooltip && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2.5 bg-stone-900 text-stone-100 text-xs rounded-lg shadow-xl pointer-events-none transition-opacity duration-150 animate-in fade-in">
          <p className="font-medium mb-1 text-stone-50">{config.label}</p>
          <p className="text-stone-300 leading-relaxed">{config.tooltip}</p>
          {verifiedItemsCount > 0 && (
            <p className="mt-1.5 pt-1.5 border-t border-stone-800 text-emerald-400 font-medium">
              ✓ {verifiedItemsCount} credentials verified
            </p>
          )}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-stone-900" />
        </div>
      )}
    </div>
  );
};
