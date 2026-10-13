import React from 'react';
import { Business } from '../../types';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

interface OwnerCredentialsSectionProps {
  business: Business;
  showToast: (msg: string) => void;
}

/** "Trust & Verified Credentials" tab: license/insurance badges and the audit-request action. */
export const OwnerCredentialsSection: React.FC<OwnerCredentialsSectionProps> = ({ business, showToast }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-4">
          <div>
            <h3 className="font-heading font-bold text-base text-stone-900">
              Trust Badges & Montana License Verification
            </h3>
            <p className="text-xs text-stone-500">
              Credentialed businesses receive the green verified shield and top placement in search
              results.
            </p>
          </div>
          <span className="text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider">
            Current Tier: {business.verificationTier.replace('_', ' ')}
          </span>
        </div>

        <div className="space-y-3">
          {business.credentials && business.credentials.length > 0 ? (
            business.credentials.map((c) => (
              <div
                key={c.id}
                className="p-4 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-xs">{c.title}</h4>
                    <p className="text-[11px] text-stone-500">
                      {c.issuer} {c.credentialNumber && `• ID: ${c.credentialNumber}`}{' '}
                      {c.expirationDate && `• Exp: ${c.expirationDate}`}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Verified by Platform
                </span>
              </div>
            ))
          ) : (
            <p className="text-xs text-stone-500 italic py-2">No official documents uploaded yet.</p>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-stone-100 bg-amber-50/50 p-4 rounded-xl border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h4 className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
              <ShieldCheck size={15} className="text-amber-700" />
              <span>Request Credential Audit from Master Admin</span>
            </h4>
            <p className="text-[11px] text-stone-600">
              Submit your Montana contractor registration or business liability insurance for official
              badge verification.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              showToast('Verification audit request submitted to Master Platform Admins!');
            }}
            className="bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold px-4 py-2 rounded-xl text-xs transition-colors shrink-0"
          >
            Submit for Audit
          </button>
        </div>
      </div>
    </div>
  );
};
