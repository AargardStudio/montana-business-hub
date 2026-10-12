import React, { useState } from 'react';
import { useDirectory } from '../context/DirectoryContext';
import { getContextualWhatsAppUrl } from '../utils/helpers';
import { X, CheckCircle2, MessageCircle, Send, Calendar, Clock, DollarSign } from 'lucide-react';

export const LeadModal: React.FC = () => {
  const { isLeadModalOpen, closeLeadModal, leadModalBusiness, leadModalType, leadModalItem, submitLead, trackInteraction } =
    useDirectory();

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [serviceOrProduct, setServiceOrProduct] = useState(leadModalItem?.name || '');
  const [budget, setBudget] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isLeadModalOpen || !leadModalBusiness) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerEmail.trim()) return;

    await submitLead({
      businessId: leadModalBusiness.id,
      businessName: leadModalBusiness.name,
      customerName,
      customerEmail,
      customerPhone,
      type: leadModalType,
      message: notes || `Inquiry regarding ${serviceOrProduct || leadModalItem?.name || 'services'}`,
      serviceOrProduct: serviceOrProduct || leadModalItem?.name,
      budget,
      preferredDate,
      preferredTime,
      notes,
    });

    setIsSubmitted(true);
  };

  const handleOpenWhatsApp = () => {
    trackInteraction(leadModalBusiness.id, 'whatsappClicks');
    const url = getContextualWhatsAppUrl(leadModalBusiness.contact.whatsapp, leadModalBusiness.name, {
      type: leadModalType === 'quote' ? 'quote' : 'general',
      itemName: serviceOrProduct || leadModalItem?.name,
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const getTitle = () => {
    switch (leadModalType) {
      case 'quote':
        return `Request a Quote from ${leadModalBusiness.name}`;
      case 'booking':
        return `Book an Appointment with ${leadModalBusiness.name}`;
      case 'inquiry':
      default:
        return `Send Inquiry to ${leadModalBusiness.name}`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative my-8 border border-stone-200">
        <button
          onClick={closeLeadModal}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="font-heading font-bold text-xl text-stone-900">Request Sent Successfully!</h3>
            <p className="text-xs sm:text-sm text-stone-600 max-w-sm mx-auto leading-relaxed">
              Your inquiry has been directly routed to <strong>{leadModalBusiness.name}</strong>. You will receive an email confirmation at <strong>{customerEmail}</strong>.
            </p>

            <div className="pt-4 border-t border-stone-100 flex flex-col gap-2">
              <button
                onClick={handleOpenWhatsApp}
                className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors"
              >
                <MessageCircle size={16} />
                <span>Also Follow Up on WhatsApp</span>
              </button>

              <button
                onClick={closeLeadModal}
                className="py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-5 pr-6">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                Direct Contact
              </span>
              <h3 className="font-heading font-bold text-lg sm:text-xl text-stone-900 mt-1">
                {getTitle()}
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                No third-party brokers. Your message goes straight to this verified Bozeman team.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 outline-hidden focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="(406) 555-0123"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 outline-hidden focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Target Service / Product
                  </label>
                  <input
                    type="text"
                    value={serviceOrProduct}
                    onChange={(e) => setServiceOrProduct(e.target.value)}
                    placeholder="e.g. Custom Timber Frame, Ski Tune"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>

              {leadModalType === 'quote' && (
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1 flex items-center gap-1">
                    <DollarSign size={13} className="text-amber-600" />
                    Estimated Budget Range (Optional)
                  </label>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 outline-hidden"
                  >
                    <option value="">Select an approximate budget</option>
                    <option value="Under $500">Under $500</option>
                    <option value="$500 - $2,000">$500 - $2,000</option>
                    <option value="$2,000 - $10,000">$2,000 - $10,000</option>
                    <option value="$10,000 - $50,000">$10,000 - $50,000</option>
                    <option value="$50,000+">$50,000+</option>
                  </select>
                </div>
              )}

              {leadModalType === 'booking' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1 flex items-center gap-1">
                      <Calendar size={13} className="text-stone-500" /> Preferred Date
                    </label>
                    <input
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1 flex items-center gap-1">
                      <Clock size={13} className="text-stone-500" /> Preferred Time
                    </label>
                    <input
                      type="time"
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Project Details / Questions
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Provide any helpful specifications, dimensions, timelines or details..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-xs text-stone-900 outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleOpenWhatsApp}
                  className="inline-flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-800 font-semibold"
                >
                  <MessageCircle size={14} />
                  <span>Chat on WhatsApp instead</span>
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={closeLeadModal}
                    className="px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors shadow-2xs cursor-pointer"
                  >
                    <Send size={13} />
                    <span>Submit</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
