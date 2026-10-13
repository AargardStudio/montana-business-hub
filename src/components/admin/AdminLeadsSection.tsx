import React from 'react';
import { useDirectory } from '../../context/DirectoryContext';
import { Download, Trash2 } from 'lucide-react';
import { downloadJSON } from '../../utils/helpers';
import { Lead } from '../../types';

interface AdminLeadsSectionProps {
  showToast: (msg: string) => void;
}

/**
 * Master "Leads & Inquiries" tab: the full cross-business lead pipeline with
 * status updates and JSON export.
 */
export const AdminLeadsSection: React.FC<AdminLeadsSectionProps> = ({ showToast }) => {
  const { leads, updateLeadStatus, deleteLead } = useDirectory();

  const exportLeadsJSON = () => {
    downloadJSON(leads, 'bozeman_leads_export');
    showToast('Downloaded leads JSON data.');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-heading font-bold text-base text-stone-900">
            Universal Customer Leads & Quote Pipeline
          </h3>
          <p className="text-xs text-stone-500">
            Monitor all consumer inquiries, direct bookings, and quote requests generated across
            Bozeman.
          </p>
        </div>
        <button
          onClick={exportLeadsJSON}
          className="inline-flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
        >
          <Download size={14} />
          <span>Export Full CSV / JSON</span>
        </button>
      </div>

      <div className="space-y-3">
        {leads.map((l: Lead) => (
          <div
            key={l.id}
            className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-heading font-bold text-sm text-stone-900">
                  {l.customerName}
                </span>
                <span className="text-xs text-stone-400">• Target Business:</span>
                <span className="text-xs font-bold text-amber-800">{l.businessName}</span>
                <span className="text-xs text-stone-400 font-mono">
                  • {new Date(l.createdAt).toLocaleDateString()}
                </span>
              </div>

              <p className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                "{l.message || l.notes || 'No message provided'}"
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 pt-1">
                {l.customerPhone && <span>Phone: {l.customerPhone}</span>}
                {l.customerEmail && <span>Email: {l.customerEmail}</span>}
                {l.budget && <span>Budget: {l.budget}</span>}
                {l.serviceOrProduct && <span>Requested: {l.serviceOrProduct}</span>}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-stone-100 w-full lg:w-auto justify-end">
              <select
                value={l.status}
                onChange={(e) => {
                  updateLeadStatus(l.id, e.target.value as Lead['status']);
                  showToast(`Lead status updated to ${e.target.value}`);
                }}
                className="text-xs font-bold bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-1 text-stone-800 cursor-pointer"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="in_progress">In Progress</option>
                <option value="closed">Closed / Won</option>
              </select>

              <button
                onClick={() => {
                  if (confirm('Delete this customer lead?')) {
                    deleteLead(l.id);
                    showToast('Lead removed.');
                  }
                }}
                className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
                title="Delete Lead"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
