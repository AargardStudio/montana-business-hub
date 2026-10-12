import React, { useState } from 'react';
import { useDirectory } from '../context/DirectoryContext';
import {
  X,
  Building2,
  CheckCircle2,
  Upload,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Phone,
  Mail,
  FileCheck,
  Sparkles,
} from 'lucide-react';

export const ClaimBusinessModal: React.FC = () => {
  const {
    isClaimModalOpen,
    closeClaimModal,
    claimTargetBusiness,
    businesses,
    claimBusiness,
    setUserRole,
    setActiveTab,
    openBusinessProfile,
  } = useDirectory();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>(claimTargetBusiness?.id || '');

  // Step 2: Verification details
  const [ownerName, setOwnerName] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [einOrTaxId, setEinOrTaxId] = useState('');
  const [uploadedDocName, setUploadedDocName] = useState('');

  // Step 3: Digital setup
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [addedServices, setAddedServices] = useState('Timber Framing Consultation, Project Estimate, On-site Inspection');
  const [yearsInBiz, setYearsInBiz] = useState('12');

  if (!isClaimModalOpen) return null;

  const targetBusiness = businesses.find((b) => b.id === selectedBusinessId) || claimTargetBusiness;

  const handleSelectBusiness = (bId: string) => {
    setSelectedBusinessId(bId);
    setStep(2);
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedDocName(e.target.files[0].name);
    }
  };

  const handleFinalPublish = () => {
    if (selectedBusinessId) {
      claimBusiness(selectedBusinessId, {
        ownerName,
        email: businessEmail,
        phone: businessPhone,
        title: 'Owner',
        businessEmail,
        businessPhone,
        whatsappNumber,
      });
    }

    setStep(4);
  };

  const handleGoToDashboard = () => {
    closeClaimModal();
    setUserRole('business_owner');
    setActiveTab('owner_dashboard');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8 border border-stone-200">
        <button
          onClick={closeClaimModal}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
        >
          <X size={20} />
        </button>

        {/* Wizard Step Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500 mb-2">
            <span className={step >= 1 ? 'text-amber-600' : ''}>1. Find Business</span>
            <span className={step >= 2 ? 'text-amber-600' : ''}>2. Verify Ownership</span>
            <span className={step >= 3 ? 'text-amber-600' : ''}>3. Digital Storefront</span>
            <span className={step >= 4 ? 'text-emerald-600' : ''}>4. Active Hub</span>
          </div>
          <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden flex">
            <div
              className={`h-full transition-all duration-300 ${
                step === 4 ? 'bg-emerald-500 w-full' : 'bg-amber-500'
              }`}
              style={{ width: step === 1 ? '25%' : step === 2 ? '50%' : step === 3 ? '75%' : '100%' }}
            />
          </div>
        </div>

        {/* STEP 1: Search & Find */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h3 className="font-heading font-bold text-xl text-stone-900">Claim Your Bozeman Business</h3>
              <p className="text-xs text-stone-500 mt-1">
                Search for your existing Bozeman listing to claim ownership and manage your digital storefront.
              </p>
            </div>

            <div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type business name (e.g. Montana Craft Woodworking, Lone Peak Plumbing)..."
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-stone-900 outline-hidden focus:border-amber-500"
              />
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {businesses
                .filter((b) => !searchQuery || b.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((b) => (
                  <div
                    key={b.id}
                    onClick={() => handleSelectBusiness(b.id)}
                    className="p-3 rounded-xl border border-stone-200 hover:border-amber-500 hover:bg-amber-50/30 transition-all flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <img src={b.logoUrl} alt={b.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <h4 className="font-bold text-stone-900 text-sm">{b.name}</h4>
                        <span className="text-xs text-stone-500">
                          {b.categoryName} • {b.location.neighborhood}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg">
                      {b.claimStatus === 'claimed' ? 'Update Claim' : 'Claim Profile →'}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* STEP 2: Verification of Ownership */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                Target: {targetBusiness?.name || 'Selected Business'}
              </span>
              <h3 className="font-heading font-bold text-xl text-stone-900 mt-1">
                Verify Business Ownership
              </h3>
              <p className="text-xs text-stone-500">
                To prevent fraudulent claiming, please verify your official business authority.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Owner / Manager Name *</label>
                <input
                  type="text"
                  required
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="e.g. David Ross"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Official Business Email *</label>
                <input
                  type="email"
                  required
                  value={businessEmail}
                  onChange={(e) => setBusinessEmail(e.target.value)}
                  placeholder="owner@business.com"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Business Phone *</label>
                <input
                  type="tel"
                  required
                  value={businessPhone}
                  onChange={(e) => setBusinessPhone(e.target.value)}
                  placeholder="(406) 555-0199"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Montana State Entity / Tax ID
                </label>
                <input
                  type="text"
                  value={einOrTaxId}
                  onChange={(e) => setEinOrTaxId(e.target.value)}
                  placeholder="MT-SOS / EIN #"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>
            </div>

            {/* Verification document upload */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                Upload Verification Document (Business License, Utility Bill, or Certificate)
              </label>
              <label className="border-2 border-dashed border-stone-300 hover:border-amber-500 rounded-xl p-4 flex flex-col items-center justify-center gap-1 cursor-pointer bg-stone-50/60 transition-colors">
                <Upload size={20} className="text-stone-400" />
                <span className="text-xs font-semibold text-stone-700">
                  {uploadedDocName ? uploadedDocName : 'Click to select file or drag & drop'}
                </span>
                <span className="text-[11px] text-stone-400">PDF, JPG, PNG up to 10MB</span>
                <input type="file" onChange={handleDocumentUpload} className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
              </label>
            </div>

            <div className="flex justify-between pt-2 border-t border-stone-100">
              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1 text-xs font-bold text-stone-600 hover:text-stone-900"
              >
                <ArrowLeft size={14} /> Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!ownerName || !businessEmail}
                className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs"
              >
                <span>Continue to Setup</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Digital Storefront Setup */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h3 className="font-heading font-bold text-xl text-stone-900">Configure Digital Channels</h3>
              <p className="text-xs text-stone-500">
                Add your direct WhatsApp line and configure services to start receiving leads and quote requests.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                WhatsApp Business Number (Direct Customer Chat)
              </label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="+14065550199"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
              />
              <span className="text-[11px] text-stone-400 block mt-0.5">
                Enables users to message you instantly with pre-filled quote inquiries.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                Services Offered (comma-separated)
              </label>
              <textarea
                rows={2}
                value={addedServices}
                onChange={(e) => setAddedServices(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs"
              />
            </div>

            <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-950 space-y-1">
              <span className="font-bold flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-600" /> What happens next:
              </span>
              <p className="text-stone-700 leading-relaxed">
                Your profile will be instantly claimed and unlocked. You will get immediate access to the Business Owner Portal, lead analytics, and real-time catalog editors.
              </p>
            </div>

            <div className="flex justify-between pt-2 border-t border-stone-100">
              <button
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-1 text-xs font-bold text-stone-600 hover:text-stone-900"
              >
                <ArrowLeft size={14} /> Back
              </button>
              <button
                onClick={handleFinalPublish}
                className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-5 py-2.5 rounded-xl text-xs shadow-md"
              >
                <span>Publish & Unlock Dashboard</span>
                <CheckCircle2 size={15} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Success */}
        {step === 4 && (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
              <ShieldCheck size={36} />
            </div>
            <h3 className="font-heading font-bold text-2xl text-stone-900">
              Congratulations! Profile Claimed
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
              You are now recognized as the verified owner of <strong>{targetBusiness?.name || 'your business'}</strong>. Your direct WhatsApp and inquiry channels are active.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={handleGoToDashboard}
                className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-5 py-2.5 rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
              >
                Open Business Owner Dashboard →
              </button>

              <button
                onClick={() => {
                  closeClaimModal();
                  if (selectedBusinessId) openBusinessProfile(selectedBusinessId);
                }}
                className="bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold px-4 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                View Public Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
