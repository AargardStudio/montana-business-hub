import React, { useState } from 'react';
import { useDirectory } from '../context/DirectoryContext';
import {
  ShieldCheck,
  Building2,
  ShoppingBag,
  FileText,
  Percent,
  Layers,
  Activity,
  CheckCircle,
} from 'lucide-react';
import { AdminTelemetryCards } from './admin/AdminTelemetryCards';
import { AdminBusinessesSection } from './admin/AdminBusinessesSection';
import { AdminDigitalShopsSection } from './admin/AdminDigitalShopsSection';
import { AdminLeadsSection } from './admin/AdminLeadsSection';
import { AdminEventsDealsSection } from './admin/AdminEventsDealsSection';
import { AdminCategoriesSection } from './admin/AdminCategoriesSection';
import { AdminLogsSection } from './admin/AdminLogsSection';

type MasterTab = 'businesses' | 'digital_shops' | 'leads' | 'events_deals' | 'categories' | 'logs';

/**
 * Platform master dashboard. This component is a thin tab router + toast
 * host; each tab's filtering, mutation, and modal logic lives in its own
 * section component under ./admin/ so no single file carries all of it.
 */
export const AdminDashboard: React.FC = () => {
  const { businesses, categories, events, offers, leads, adminLogs } = useDirectory();

  const [masterTab, setMasterTab] = useState<MasterTab>('businesses');

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const totalShopItems = businesses.reduce(
    (acc, b) => acc + (b.services?.length || 0) + (b.products?.length || 0),
    0
  );

  const TABS: { id: MasterTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'businesses',
      label: `Control Listings (${businesses.length})`,
      icon: <Building2 size={14} />,
    },
    {
      id: 'digital_shops',
      label: `Control All Digital Shops (${totalShopItems})`,
      icon: <ShoppingBag size={14} />,
    },
    { id: 'leads', label: `Leads & Inquiries (${leads.length})`, icon: <FileText size={14} /> },
    {
      id: 'events_deals',
      label: `Deals & Events (${offers.length + events.length})`,
      icon: <Percent size={14} />,
    },
    { id: 'categories', label: `Categories (${categories.length})`, icon: <Layers size={14} /> },
    {
      id: 'logs',
      label: `Broadcast & Audit Logs (${adminLogs.length})`,
      icon: <Activity size={14} />,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-stone-900 text-amber-400 border border-amber-500/40 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <CheckCircle size={18} className="text-emerald-400" />
          <span className="text-xs font-semibold text-white">{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-stone-950 rounded-3xl p-6 sm:p-8 text-white mb-8 border border-stone-800 shadow-2xl">
        <div className="inline-flex items-center gap-1.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2.5 py-0.5 rounded-full text-xs font-bold mb-2">
          <ShieldCheck size={14} className="text-purple-400" />
          <span>Master Administrative Control Center</span>
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Platform Master Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-2xl">
          Controlled by Us to Control Everything: Directory listings, vendor digital shops,
          customer leads, pricing, categories, and system-wide policies.
        </p>
      </div>

      {/* High-Level Telemetry Cards */}
      <AdminTelemetryCards />

      {/* Master Navigation Bar */}
      <div className="flex items-center overflow-x-auto gap-2 border-b border-stone-200 pb-2 mb-8 text-xs font-bold scrollbar-none">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setMasterTab(tab.id)}
            className={`px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 cursor-pointer shrink-0 ${
              masterTab === tab.id
                ? 'bg-stone-900 text-amber-400 shadow-xs'
                : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {masterTab === 'businesses' && <AdminBusinessesSection showToast={showToast} />}
      {masterTab === 'digital_shops' && <AdminDigitalShopsSection showToast={showToast} />}
      {masterTab === 'leads' && <AdminLeadsSection showToast={showToast} />}
      {masterTab === 'events_deals' && <AdminEventsDealsSection showToast={showToast} />}
      {masterTab === 'categories' && <AdminCategoriesSection showToast={showToast} />}
      {masterTab === 'logs' && <AdminLogsSection showToast={showToast} />}
    </div>
  );
};
