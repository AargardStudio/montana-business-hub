import React from 'react';
import { Business } from '../../types';
import { Award, ShieldCheck } from 'lucide-react';

interface ProfileCredentialsSectionProps {
  business: Business;
}

/** "Credentials & Trust" tab: licenses, certifications and the platform verification checklist. */
export const ProfileCredentialsSection: React.FC<ProfileCredentialsSectionProps> = ({ business }) => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-6">
      <div>
        <h2 className="font-heading text-xl font-bold text-stone-900 mb-1">
          Credentials, Licenses & Trust Verification
        </h2>
        <p className="text-xs text-stone-500">
          Documented state licenses, liability insurance, trade certifications, and verified accreditations.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {business.credentials?.map((cred) => (
          <div key={cred.id} className="border border-stone-200 rounded-xl p-4 sm:p-5 flex items-start gap-3 bg-stone-50/50">
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
              <Award size={20} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="font-bold text-stone-900 text-sm sm:text-base">{cred.title}</h3>
                {cred.verified && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                    <ShieldCheck size={12} /> Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-600">
                Issued by: <strong>{cred.issuer}</strong>
              </p>
              {cred.credentialNumber && (
                <span className="text-[11px] text-stone-500 font-mono block mt-1">
                  License / Reg #: {cred.credentialNumber}
                </span>
              )}
              <div className="flex gap-4 text-[11px] text-stone-400 mt-2">
                {cred.issueDate && <span>Issued: {cred.issueDate}</span>}
                {cred.expirationDate && <span>Expires: {cred.expirationDate}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Platform Verification Checklist */}
      <div className="border border-emerald-200 bg-emerald-50/40 rounded-xl p-5">
        <h4 className="font-bold text-emerald-950 text-sm mb-2 flex items-center gap-1.5">
          <ShieldCheck size={16} className="text-emerald-700" />
          Verified Items on File with Bozeman Business Hub:
        </h4>
        <ul className="space-y-1 text-xs text-emerald-900">
          {business.verifiedItems.map((item, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
