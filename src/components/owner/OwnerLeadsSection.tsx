import React, { useState } from 'react';
import { useDirectory } from '../../context/DirectoryContext';
import { Business, Lead } from '../../types';
import { Phone, Mail, Calendar, MessageCircle, FileText } from 'lucide-react';

interface OwnerLeadsSectionProps {
  business: Business;
  showToast: (msg: string) => void;
}

const LEAD_FILTERS = ['all', 'new', 'contacted', 'in_progress', 'closed'] as const;

/** "Customer Leads & Inquiries" tab: inbound quote/booking inbox for the active business. */
export const OwnerLeadsSection: React.FC<OwnerLeadsSectionProps> = ({ business, showToast }) => {
  const { leads, updateLeadStatus } = useDirectory();
  const [leadFilter, setLeadFilter] = useState<(typeof LEAD_FILTERS)[number]>('all');

  const myLeads = leads.filter((l) => l.businessId === business.id);
  const filteredLeads = myLeads.filter((l) => (leadFilter === 'all' ? true : l.status === leadFilter));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <h3 className="font-heading font-bold text-base text-stone-900">
            Inbound Leads & WhatsApp Inquiry Inbox
          </h3>
          <p className="text-xs text-stone-500">
            Direct quotes and messages from Bozeman customers with direct WhatsApp response links.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl text-xs font-semibold">
          {LEAD_FILTERS.map((st) => (
            <button
              key={st}
              onClick={() => setLeadFilter(st)}
              className={`px-3 py-1 rounded-lg capitalize transition-colors ${
                leadFilter === st ? 'bg-white text-stone-950 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredLeads.length > 0 ? (
          filteredLeads.map((lead) => {
            const whatsappReplyUrl = lead.customerPhone
              ? `https://wa.me/${lead.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                  `Hi ${lead.customerName}, this is ${business.name} in Bozeman responding to your inquiry regarding ${lead.serviceOrProduct || 'our services'}.`
                )}`
              : null;

            return (
              <div
                key={lead.id}
                className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 hover:border-amber-400 transition-colors"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        lead.type === 'quote'
                          ? 'bg-purple-100 text-purple-800'
                          : lead.type === 'booking'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {lead.type}
                    </span>
                    <span className="font-heading font-bold text-sm text-stone-900">{lead.customerName}</span>
                    <span className="text-xs text-stone-400 font-mono">
                      • {new Date(lead.createdAt).toLocaleDateString()} at{' '}
                      {new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {lead.serviceOrProduct && (
                    <p className="text-xs font-semibold text-amber-800">
                      Item: {lead.serviceOrProduct} {lead.budget && `• Budget: ${lead.budget}`}
                    </p>
                  )}

                  <p className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                    "{lead.message || lead.notes || 'Inquiry submitted through Bozeman Business Hub'}"
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 pt-1">
                    {lead.customerPhone && (
                      <span className="flex items-center gap-1">
                        <Phone size={12} className="text-stone-400" />
                        <span>{lead.customerPhone}</span>
                      </span>
                    )}
                    {lead.customerEmail && (
                      <span className="flex items-center gap-1">
                        <Mail size={12} className="text-stone-400" />
                        <span>{lead.customerEmail}</span>
                      </span>
                    )}
                    {lead.preferredDate && (
                      <span className="flex items-center gap-1">
                        <Calendar size={12} className="text-stone-400" />
                        <span>Prefers: {lead.preferredDate}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions & Status */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-end gap-2 shrink-0 w-full lg:w-auto pt-3 lg:pt-0 border-t lg:border-t-0 border-stone-100">
                  <div className="flex items-center gap-2">
                    <label className="text-[11px] text-stone-500 font-medium">Status:</label>
                    <select
                      value={lead.status}
                      onChange={(e) => {
                        updateLeadStatus(lead.id, e.target.value as Lead['status']);
                        showToast(`Lead marked as ${e.target.value}`);
                      }}
                      className="text-xs font-bold bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-1 text-stone-800"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="in_progress">In Progress</option>
                      <option value="closed">Closed / Won</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    {whatsappReplyUrl && (
                      <a
                        href={whatsappReplyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition-colors"
                      >
                        <MessageCircle size={13} />
                        <span>Reply via WhatsApp</span>
                      </a>
                    )}

                    {lead.customerEmail && (
                      <a
                        href={`mailto:${lead.customerEmail}?subject=${encodeURIComponent(`Bozeman Business Hub Inquiry - ${business.name}`)}`}
                        className="inline-flex items-center gap-1 bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition-colors"
                      >
                        <Mail size={13} />
                        <span>Email</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-stone-50 border-2 border-dashed border-stone-300 rounded-2xl p-12 text-center">
            <FileText size={36} className="mx-auto text-stone-400 mb-3" />
            <h4 className="font-heading font-bold text-stone-700 text-base">No leads in this view</h4>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
              Customer quote requests and direct messages submitted on your profile or services
              catalog appear here in real time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
