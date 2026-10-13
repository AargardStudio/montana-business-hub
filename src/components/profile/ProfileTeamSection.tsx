import React from 'react';
import { Business } from '../../types';

interface ProfileTeamSectionProps {
  business: Business;
}

/** "Team & Story" tab: founder's story and key team members. */
export const ProfileTeamSection: React.FC<ProfileTeamSectionProps> = ({ business }) => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-6">
      <div>
        <h2 className="font-heading text-xl font-bold text-stone-900 mb-1">Founder & Key Leadership</h2>
        <p className="text-xs text-stone-500">
          The local Bozeman artisans, technicians, and founders behind the business.
        </p>
      </div>

      {/* Full Story text if present */}
      {business.fullStory && (
        <div className="bg-amber-50/40 border border-amber-200/60 rounded-xl p-5 mb-6">
          <h3 className="font-heading font-bold text-stone-900 text-sm mb-2">The Founder's Journey</h3>
          <p className="text-xs text-stone-700 leading-relaxed whitespace-pre-line">{business.fullStory}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {business.team?.map((member) => (
          <div key={member.id} className="border border-stone-200 rounded-xl p-4 flex gap-4 items-start">
            <img
              src={member.imageUrl}
              alt={member.name}
              className="w-16 h-16 rounded-xl object-cover shrink-0 bg-stone-100"
            />
            <div>
              <h4 className="font-bold text-stone-900 text-sm">{member.name}</h4>
              <span className="text-xs text-amber-800 font-semibold block mb-1">{member.role}</span>
              <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">{member.bio}</p>
              {member.yearsWithBusiness && (
                <span className="text-[10px] text-stone-400 mt-2 block">
                  {member.yearsWithBusiness} years with company
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
