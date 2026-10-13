import React from 'react';
import { Business } from '../../types';

interface ProfilePortfolioSectionProps {
  business: Business;
}

/** "Portfolio" tab: gallery of completed work / past projects. */
export const ProfilePortfolioSection: React.FC<ProfilePortfolioSectionProps> = ({ business }) => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-6">
      <div>
        <h2 className="font-heading text-xl font-bold text-stone-900 mb-1">Visual Portfolio & Completed Work</h2>
        <p className="text-xs text-stone-500">
          Real proof of craftsmanship, past builds, and local projects completed across Gallatin Valley.
        </p>
      </div>

      {!business.portfolio || business.portfolio.length === 0 ? (
        <p className="text-xs text-stone-500 py-8 text-center">Portfolio gallery is being updated.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {business.portfolio.map((item) => (
            <div key={item.id} className="border border-stone-200 rounded-xl overflow-hidden shadow-2xs">
              <img src={item.imageUrl} alt={item.title} className="h-56 w-full object-cover" />
              <div className="p-5">
                <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                  {item.category}
                </span>
                <h3 className="font-heading font-bold text-base text-stone-900 mt-2 mb-1.5">{item.title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed mb-3">{item.description}</p>
                <div className="flex items-center justify-between text-[11px] text-stone-400 border-t border-stone-100 pt-2">
                  {item.clientType && <span>Client: {item.clientType}</span>}
                  {item.completedDate && <span>Completed: {item.completedDate}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
