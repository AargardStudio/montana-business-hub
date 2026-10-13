import React from 'react';
import { useDirectory } from '../../context/DirectoryContext';
import { Business } from '../../types';
import { Sparkles, MessageCircle, ShoppingBag } from 'lucide-react';

interface OwnerTelemetryCardsProps {
  business: Business;
}

function getCompleteness(business: Business): number {
  let score = 30;
  if (business.contact.whatsapp) score += 15;
  if (business.services && business.services.length > 0) score += 20;
  if (business.products && business.products.length > 0) score += 15;
  if (business.credentials && business.credentials.length > 0) score += 10;
  if (business.fullStory) score += 10;
  return Math.min(score, 100);
}

/** Profile completeness meter + quick KPI tiles for the active managed business. */
export const OwnerTelemetryCards: React.FC<OwnerTelemetryCardsProps> = ({ business }) => {
  const { leads } = useDirectory();
  const myLeads = leads.filter((l) => l.businessId === business.id);
  const completeness = getCompleteness(business);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs lg:col-span-2 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-amber-600" />
            <span className="font-heading font-bold text-sm text-stone-900">
              Digital Shop & Listing Health
            </span>
          </div>
          <span className="text-xs font-extrabold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
            {completeness}% Score
          </span>
        </div>

        <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${completeness}%` }}
          />
        </div>

        <p className="text-xs text-stone-500">
          {completeness === 100
            ? 'Excellent! Your listing and digital shop are fully populated with active services and direct WhatsApp channels.'
            : 'Tip: Add products, describe your artisanal story, or add operating hours to maximize customer trust and quote requests.'}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-stone-500 text-xs">
          <span>Direct Inquiries</span>
          <MessageCircle size={15} className="text-amber-600" />
        </div>
        <div className="mt-2">
          <span className="font-heading font-extrabold text-2xl text-stone-900 block">
            {myLeads.length}
          </span>
          <span className="text-[11px] text-emerald-700 font-medium">
            {myLeads.filter((l) => l.status === 'new').length} pending review
          </span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-stone-500 text-xs">
          <span>Shop Catalog Items</span>
          <ShoppingBag size={15} className="text-amber-600" />
        </div>
        <div className="mt-2">
          <span className="font-heading font-extrabold text-2xl text-stone-900 block">
            {(business.services?.length || 0) + (business.products?.length || 0)}
          </span>
          <span className="text-[11px] text-stone-500">
            {business.services?.length || 0} services • {business.products?.length || 0} products
          </span>
        </div>
      </div>
    </div>
  );
};
