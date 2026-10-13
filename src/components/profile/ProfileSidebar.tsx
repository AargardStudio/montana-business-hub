import React from 'react';
import { useDirectory } from '../../context/DirectoryContext';
import { Business } from '../../types';
import { InteractiveMap } from '../InteractiveMap';
import { formatTimeString } from '../../utils/helpers';
import { useProfileActions } from './useProfileActions';
import { Phone, MessageCircle, Mail, Globe, ExternalLink, Navigation } from 'lucide-react';

interface ProfileSidebarProps {
  business: Business;
}

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

/** Right-column sidebar: quick contact card, location/map, and operating hours. */
export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ business }) => {
  const { openLeadModal, trackInteraction } = useDirectory();
  const { handleWhatsAppGeneral, handleWebsiteClick, handleDirectionsClick } = useProfileActions(business);

  return (
    <div className="lg:col-span-4 space-y-6">
      {/* Quick Contact Card */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
        <h3 className="font-heading text-base font-bold text-stone-900 border-b border-stone-100 pb-3">
          Contact & Communication
        </h3>

        <div className="space-y-3 text-xs">
          <a
            href={`tel:${business.contact.phone}`}
            onClick={() => trackInteraction(business.id, 'calls')}
            className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-800 transition-colors"
          >
            <span className="flex items-center gap-2 font-medium">
              <Phone size={15} className="text-amber-600" />
              <span>{business.contact.formattedPhone}</span>
            </span>
            <span className="text-stone-400 font-bold">Call</span>
          </a>

          <button
            onClick={handleWhatsAppGeneral}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2 font-medium">
              <MessageCircle size={15} className="text-emerald-600" />
              <span>WhatsApp Direct Chat</span>
            </span>
            <span className="font-bold text-emerald-700">Open</span>
          </button>

          <a
            href={`mailto:${business.contact.email}`}
            className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-800 transition-colors"
          >
            <span className="flex items-center gap-2 font-medium">
              <Mail size={15} className="text-stone-500" />
              <span className="truncate max-w-[180px]">{business.contact.email}</span>
            </span>
            <span className="text-stone-400 font-bold">Email</span>
          </a>

          <button
            onClick={handleWebsiteClick}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-800 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2 font-medium">
              <Globe size={15} className="text-stone-500" />
              <span>Official Website</span>
            </span>
            <ExternalLink size={13} className="text-stone-400" />
          </button>
        </div>

        {/* Lead Request Action */}
        <button
          onClick={() => openLeadModal(business, 'inquiry')}
          className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-2.5 rounded-xl text-xs transition-colors shadow-2xs cursor-pointer"
        >
          Send Direct Inquiry
        </button>
      </div>

      {/* Location & Interactive Mini Map */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <h3 className="font-heading text-base font-bold text-stone-900">Location</h3>
          <button
            onClick={handleDirectionsClick}
            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
          >
            <Navigation size={13} />
            <span>Directions</span>
          </button>
        </div>

        <p className="text-xs text-stone-700 font-medium leading-relaxed">
          {business.location.address}
          <br />
          {business.location.neighborhood}, {business.location.city}, {business.location.state}{' '}
          {business.location.postalCode}
        </p>

        {/* Mini Leaflet Map */}
        <InteractiveMap businesses={[business]} heightClass="h-44" selectedBusinessId={business.id} />
      </div>

      {/* Operating Hours Table */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-3">
        <h3 className="font-heading text-base font-bold text-stone-900 border-b border-stone-100 pb-3">
          Opening Hours
        </h3>
        <div className="space-y-1.5 text-xs">
          {DAYS.map((day) => {
            const h = business.hours[day];
            return (
              <div key={day} className="flex justify-between py-1 border-b border-stone-50 capitalize">
                <span className="text-stone-600 font-medium">{day}</span>
                <span className="font-semibold text-stone-900">
                  {h?.closed ? 'Closed' : `${formatTimeString(h.open)} - ${formatTimeString(h.close)}`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
