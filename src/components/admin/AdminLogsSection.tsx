import React, { useState } from 'react';
import { useDirectory } from '../../context/DirectoryContext';

interface AdminLogsSectionProps {
  showToast: (msg: string) => void;
}

/**
 * Master "Broadcast & Audit Logs" tab: manages the global announcement
 * banner and displays the immutable admin action audit trail.
 */
export const AdminLogsSection: React.FC<AdminLogsSectionProps> = ({ showToast }) => {
  const { announcement, setAnnouncement, adminLogs, addAdminLog } = useDirectory();
  const [announcementInput, setAnnouncementInput] = useState(announcement || '');

  const handleSaveAnnouncement = () => {
    setAnnouncement(announcementInput.trim() ? announcementInput : null);
    addAdminLog(
      'Updated Announcement',
      announcementInput.trim() ? `Set banner: "${announcementInput}"` : 'Cleared broadcast banner'
    );
    showToast('Platform announcement broadcast saved!');
  };

  return (
    <div className="space-y-6">
      {/* Broadcast Banner Manager */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
        <h3 className="font-heading font-bold text-base text-stone-900 mb-1">
          Global Platform Broadcast Banner
        </h3>
        <p className="text-xs text-stone-500 mb-4">
          This message appears at the top of the entire application for all visitors. Leave empty
          to disable.
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            value={announcementInput}
            onChange={(e) => setAnnouncementInput(e.target.value)}
            placeholder="e.g. Welcome to Bozeman Business Hub! All local vendor catalogs are 100% direct."
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
          />
          <button
            onClick={handleSaveAnnouncement}
            className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-5 py-2 rounded-xl text-xs transition-colors shrink-0 cursor-pointer"
          >
            Update Banner
          </button>
        </div>
      </div>

      {/* Audit Logs */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
        <h3 className="font-heading font-bold text-base text-stone-900 mb-1">
          Master Admin Action Audit Trail
        </h3>
        <p className="text-xs text-stone-500 mb-4">
          Immutable chronological record of updates, tier alterations, and listings management.
        </p>

        <div className="divide-y divide-stone-100 font-mono text-xs">
          {adminLogs.map((log) => (
            <div key={log.id} className="py-2.5 flex items-start justify-between gap-4">
              <div>
                <span className="font-bold text-stone-900 mr-2">{log.action}:</span>
                <span className="text-stone-600">{log.details}</span>
              </div>
              <span className="text-stone-400 text-[10px] shrink-0">{log.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
