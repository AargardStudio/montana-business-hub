import React, { useEffect, useState } from 'react';
import { useDirectory } from '../../context/DirectoryContext';
import { Business, DayOfWeek, VerificationTier } from '../../types';
import { X } from 'lucide-react';

interface AdminBusinessModalProps {
  isOpen: boolean;
  /** The business being edited, or null when creating a new listing. */
  business: Business | null;
  onClose: () => void;
  showToast: (msg: string) => void;
}

const DEFAULT_NEW_BIZ = {
  tagline: 'Quality local craftsmanship serving Bozeman',
  neighborhood: 'Downtown Bozeman',
  address: '100 E Main St',
  phone: '(406) 555-0188',
  email: 'contact@newbusiness.com',
  whatsapp: '+14065550188',
  website: 'https://bozemanbusiness.com',
  tier: 'verified' as VerificationTier,
  claim: 'claimed' as 'claimed' | 'unclaimed',
  description: 'Proud local Montana business dedicated to exceptional service.',
  logo: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=200&q=80',
  cover: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
};

/**
 * Admin-only modal for creating or editing a business listing with full
 * master privileges (verification tier, claim status, featured flag).
 */
export const AdminBusinessModal: React.FC<AdminBusinessModalProps> = ({
  isOpen,
  business,
  onClose,
  showToast,
}) => {
  const { categories, addBusiness, updateBusinessProfile } = useDirectory();

  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState(categories[0]?.id || 'cat-trades');
  const [neighborhood, setNeighborhood] = useState('Cannery District');
  const [address, setAddress] = useState('123 Main St');
  const [phone, setPhone] = useState('(406) 555-0100');
  const [email, setEmail] = useState('info@bozemanbiz.com');
  const [whatsapp, setWhatsapp] = useState('+14065550100');
  const [website, setWebsite] = useState('https://example.com');
  const [tier, setTier] = useState<VerificationTier>('claimed');
  const [claim, setClaim] = useState<'claimed' | 'unclaimed'>('claimed');
  const [featured, setFeatured] = useState(false);
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState('');
  const [cover, setCover] = useState('');

  // Re-seed the form whenever the modal opens or the target business changes.
  useEffect(() => {
    if (!isOpen) return;

    if (business) {
      setName(business.name);
      setTagline(business.tagline);
      setCategory(business.categoryId);
      setNeighborhood(business.location.neighborhood);
      setAddress(business.location.address);
      setPhone(business.contact.formattedPhone);
      setEmail(business.contact.email);
      setWhatsapp(business.contact.whatsapp || '');
      setWebsite(business.contact.website || '');
      setTier(business.verificationTier);
      setClaim(business.claimStatus === 'unclaimed' ? 'unclaimed' : 'claimed');
      setFeatured(Boolean(business.featured));
      setDescription(business.description);
      setLogo(business.logoUrl);
      setCover(business.coverUrl);
    } else {
      setName('');
      setTagline(DEFAULT_NEW_BIZ.tagline);
      setCategory(categories[0]?.id || 'cat-trades');
      setNeighborhood(DEFAULT_NEW_BIZ.neighborhood);
      setAddress(DEFAULT_NEW_BIZ.address);
      setPhone(DEFAULT_NEW_BIZ.phone);
      setEmail(DEFAULT_NEW_BIZ.email);
      setWhatsapp(DEFAULT_NEW_BIZ.whatsapp);
      setWebsite(DEFAULT_NEW_BIZ.website);
      setTier(DEFAULT_NEW_BIZ.tier);
      setClaim(DEFAULT_NEW_BIZ.claim);
      setFeatured(false);
      setDescription(DEFAULT_NEW_BIZ.description);
      setLogo(DEFAULT_NEW_BIZ.logo);
      setCover(DEFAULT_NEW_BIZ.cover);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, business]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const cat = categories.find((c) => c.id === category);

    if (business) {
      updateBusinessProfile(business.id, {
        name,
        tagline,
        categoryId: category,
        categoryName: cat?.name || 'Local Services',
        location: {
          address,
          city: 'Bozeman',
          state: 'MT',
          postalCode: '59715',
          country: 'USA',
          neighborhood,
          lat: 45.6793,
          lng: -111.0373,
        },
        contact: {
          phone: phone.replace(/\D/g, ''),
          formattedPhone: phone,
          email,
          whatsapp,
          website,
        },
        verificationTier: tier,
        claimStatus: claim,
        featured,
        description,
        logoUrl: logo,
        coverUrl: cover,
      });
      showToast(`Business "${name}" updated.`);
    } else {
      const defaultHours: Record<DayOfWeek, { open: string; close: string; closed: boolean }> = {
        monday: { open: '08:00', close: '17:00', closed: false },
        tuesday: { open: '08:00', close: '17:00', closed: false },
        wednesday: { open: '08:00', close: '17:00', closed: false },
        thursday: { open: '08:00', close: '17:00', closed: false },
        friday: { open: '08:00', close: '17:00', closed: false },
        saturday: { open: '09:00', close: '15:00', closed: false },
        sunday: { open: '00:00', close: '00:00', closed: true },
      };

      const newBiz: Business = {
        id: 'b-' + Date.now(),
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        name,
        tagline,
        description,
        fullStory: 'Locally founded and operated in the Gallatin Valley.',
        categoryId: category,
        categoryName: cat?.name || 'Local Trades',
        tags: ['Bozeman', 'Local', cat?.name || 'Trades'],
        rating: 5.0,
        reviewsCount: 1,
        yearsInBusiness: 3,
        foundedYear: 2021,
        priceRange: '$$',
        location: {
          address,
          city: 'Bozeman',
          state: 'MT',
          postalCode: '59715',
          country: 'USA',
          neighborhood,
          lat: 45.6793,
          lng: -111.0373,
        },
        contact: {
          phone: phone.replace(/\D/g, ''),
          formattedPhone: phone,
          email,
          whatsapp,
          website,
        },
        socials: {},
        hours: defaultHours,
        verificationTier: tier,
        verifiedItems: ['Montana Secretary of State Good Standing', 'Active Local Phone Line'],
        claimStatus: claim,
        credentials: [],
        services: [
          {
            id: 'srv-' + Date.now(),
            name: 'Consultation & Estimate',
            description: 'Complimentary consultation for Bozeman residents.',
            priceType: 'starting_at',
            price: 75,
            priceUnit: 'session',
          },
        ],
        products: [],
        portfolio: [],
        team: [],
        faqs: [],
        reviews: [],
        badges: ['Locally Owned', 'Verified'],
        featured,
        logoUrl: logo || DEFAULT_NEW_BIZ.logo,
        coverUrl: cover || DEFAULT_NEW_BIZ.cover,
        analytics: {
          views: 40,
          searchImpressions: 120,
          calls: 3,
          whatsappClicks: 5,
          websiteClicks: 8,
          leads: 1,
          quoteRequests: 1,
          bookings: 0,
        },
      };
      addBusiness(newBiz);
      showToast(`Added new business "${name}" to directory.`);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 my-8 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-6">
          <h3 className="font-heading font-bold text-xl text-stone-900">
            {business ? 'Master Edit: Business Listing' : 'Master Add: New Business'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-stone-700 uppercase mb-1">Business Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 uppercase mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-stone-700 uppercase mb-1">Tagline *</label>
              <input
                type="text"
                required
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 uppercase mb-1">Neighborhood *</label>
              <input
                type="text"
                required
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 uppercase mb-1">Street Address *</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 uppercase mb-1">Phone Number *</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 uppercase mb-1">Direct WhatsApp</label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 uppercase mb-1">Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 uppercase mb-1">Website URL</label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            {/* Master Privileges */}
            <div>
              <label className="block font-bold text-stone-700 uppercase mb-1">Verification Tier</label>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value as VerificationTier)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
              >
                <option value="unclaimed">Unclaimed</option>
                <option value="claimed">Claimed</option>
                <option value="verified">Verified</option>
                <option value="credential_verified">Credential Verified</option>
                <option value="featured">Featured</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 uppercase mb-1">Claim Status</label>
              <select
                value={claim}
                onChange={(e) => setClaim(e.target.value as 'claimed' | 'unclaimed')}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
              >
                <option value="claimed">Claimed</option>
                <option value="unclaimed">Unclaimed</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-stone-700 uppercase mb-1">Description *</label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div className="sm:col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="featCheck"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="rounded text-amber-500"
              />
              <label htmlFor="featCheck" className="font-bold text-stone-800">
                Feature prominently on directory homepage
              </label>
            </div>
          </div>

          <div className="pt-6 border-t border-stone-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-stone-100 text-stone-700 font-bold rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl cursor-pointer"
            >
              {business ? 'Save Overrides' : 'Create Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
