import React, { useEffect, useState } from 'react';
import { useDirectory } from '../../context/DirectoryContext';
import { Business, DayOfWeek } from '../../types';
import { Save } from 'lucide-react';

interface OwnerListingSectionProps {
  business: Business;
  showToast: (msg: string) => void;
}

const DAYS: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const NEIGHBORHOODS = [
  'Cannery District',
  'Downtown Bozeman',
  'Midtown',
  'South Bozeman',
  'North 7th',
  'Gallatin Gateway',
  'Four Corners',
  'Belgrade',
];

/**
 * "Control Listing & Branding" tab: business info, location/contact,
 * weekly hours, and visual branding, all saved via a single form submit.
 */
export const OwnerListingSection: React.FC<OwnerListingSectionProps> = ({ business, showToast }) => {
  const { categories, updateBusinessProfile } = useDirectory();

  const [editName, setEditName] = useState(business.name);
  const [editTagline, setEditTagline] = useState(business.tagline);
  const [editCategory, setEditCategory] = useState(business.categoryId);
  const [editDesc, setEditDesc] = useState(business.description);
  const [editStory, setEditStory] = useState(business.fullStory || '');
  const [editAddress, setEditAddress] = useState(business.location.address);
  const [editNeighborhood, setEditNeighborhood] = useState(business.location.neighborhood);
  const [editPhone, setEditPhone] = useState(business.contact.formattedPhone);
  const [editEmail, setEditEmail] = useState(business.contact.email);
  const [editWebsite, setEditWebsite] = useState(business.contact.website || '');
  const [editWhatsapp, setEditWhatsapp] = useState(business.contact.whatsapp || '');
  const [editLogo, setEditLogo] = useState(business.logoUrl);
  const [editCover, setEditCover] = useState(business.coverUrl);
  const [editYears, setEditYears] = useState(business.yearsInBusiness);
  const [editPriceRange, setEditPriceRange] = useState(business.priceRange);
  const [editHours, setEditHours] = useState(business.hours);

  // Re-seed the form when the owner switches to a different managed business.
  useEffect(() => {
    setEditName(business.name);
    setEditTagline(business.tagline);
    setEditCategory(business.categoryId);
    setEditDesc(business.description);
    setEditStory(business.fullStory || '');
    setEditAddress(business.location.address);
    setEditNeighborhood(business.location.neighborhood);
    setEditPhone(business.contact.formattedPhone);
    setEditEmail(business.contact.email);
    setEditWebsite(business.contact.website || '');
    setEditWhatsapp(business.contact.whatsapp || '');
    setEditLogo(business.logoUrl);
    setEditCover(business.coverUrl);
    setEditYears(business.yearsInBusiness);
    setEditPriceRange(business.priceRange);
    setEditHours(business.hours);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [business.id]);

  const handleSaveListing = (e: React.FormEvent) => {
    e.preventDefault();
    const cat = categories.find((c) => c.id === editCategory);
    updateBusinessProfile(business.id, {
      name: editName,
      tagline: editTagline,
      categoryId: editCategory,
      categoryName: cat?.name || business.categoryName,
      description: editDesc,
      fullStory: editStory,
      location: {
        ...business.location,
        address: editAddress,
        neighborhood: editNeighborhood,
      },
      contact: {
        ...business.contact,
        formattedPhone: editPhone,
        phone: editPhone.replace(/\D/g, ''),
        email: editEmail,
        website: editWebsite,
        whatsapp: editWhatsapp,
      },
      logoUrl: editLogo,
      coverUrl: editCover,
      yearsInBusiness: Number(editYears) || business.yearsInBusiness,
      priceRange: editPriceRange,
      hours: editHours,
    });
    showToast('Listing details updated and saved to directory!');
  };

  return (
    <form onSubmit={handleSaveListing} className="space-y-8">
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-6">
          <div>
            <h3 className="font-heading font-bold text-lg text-stone-900">
              Business Information & Identity
            </h3>
            <p className="text-xs text-stone-500">
              Manage how your business appears across Bozeman search, categories, and map views.
            </p>
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
          >
            <Save size={14} />
            <span>Save Listing Changes</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
              Business Name *
            </label>
            <input
              type="text"
              required
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
              Primary Category *
            </label>
            <select
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-amber-500"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
              Tagline / Catchphrase *
            </label>
            <input
              type="text"
              required
              value={editTagline}
              onChange={(e) => setEditTagline(e.target.value)}
              placeholder="e.g. Handcrafted timber tables & custom cabinetry in the Cannery District"
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-amber-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
              Short About Description *
            </label>
            <textarea
              rows={3}
              required
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-amber-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
              Mountain Heritage / Artisan Story (Extended Bio)
            </label>
            <textarea
              rows={4}
              value={editStory}
              onChange={(e) => setEditStory(e.target.value)}
              placeholder="Describe your founding story, woodworking roots, sourcing from Montana mills, etc."
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Location & Contact Section */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
        <h3 className="font-heading font-bold text-lg text-stone-900 mb-1">
          Location, Contact Channels & WhatsApp
        </h3>
        <p className="text-xs text-stone-500 mb-6">
          Empower Bozeman locals to call, visit, or chat directly with zero platform intermediaries.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
              Bozeman Neighborhood *
            </label>
            <select
              value={editNeighborhood}
              onChange={(e) => setEditNeighborhood(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-amber-500"
            >
              {NEIGHBORHOODS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
              Street Address *
            </label>
            <input
              type="text"
              required
              value={editAddress}
              onChange={(e) => setEditAddress(e.target.value)}
              placeholder="e.g. 424 E Main St"
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
              Official Phone *
            </label>
            <input
              type="text"
              required
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
              placeholder="(406) 555-0192"
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              placeholder="hello@business.com"
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
              Direct WhatsApp Line (Instant Leads)
            </label>
            <input
              type="text"
              value={editWhatsapp}
              onChange={(e) => setEditWhatsapp(e.target.value)}
              placeholder="+14065550192"
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
              Website URL
            </label>
            <input
              type="text"
              value={editWebsite}
              onChange={(e) => setEditWebsite(e.target.value)}
              placeholder="https://example.com"
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
              Years Operating in Bozeman
            </label>
            <input
              type="number"
              value={editYears}
              onChange={(e) => setEditYears(Number(e.target.value))}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
              Price Tier
            </label>
            <select
              value={editPriceRange}
              onChange={(e) => setEditPriceRange(e.target.value as Business['priceRange'])}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-amber-500"
            >
              <option value="$">$ (Budget / Accessible)</option>
              <option value="$$">$$ (Moderate / Standard)</option>
              <option value="$$$">$$$ (Premium / High-End)</option>
              <option value="$$$$">$$$$ (Luxury / Architectural)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Operating Hours Table */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
        <h3 className="font-heading font-bold text-lg text-stone-900 mb-1">
          Weekly Operating Hours
        </h3>
        <p className="text-xs text-stone-500 mb-4">
          Keep your opening hours current to ensure accurate "Open Now" badges in directory search.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {DAYS.map((day) => {
            const h = editHours[day] || { open: '08:00', close: '17:00', closed: false };
            return (
              <div key={day} className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="capitalize font-bold text-stone-800">{day}</span>
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={h.closed}
                      onChange={(e) => {
                        setEditHours({
                          ...editHours,
                          [day]: { ...h, closed: e.target.checked },
                        });
                      }}
                      className="rounded text-amber-500"
                    />
                    <span className="text-[10px] text-stone-500">Closed</span>
                  </label>
                </div>

                {!h.closed ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={h.open}
                      onChange={(e) => {
                        setEditHours({
                          ...editHours,
                          [day]: { ...h, open: e.target.value },
                        });
                      }}
                      className="w-full bg-white border border-stone-300 rounded p-1 text-center text-xs"
                    />
                    <span className="text-stone-400">-</span>
                    <input
                      type="text"
                      value={h.close}
                      onChange={(e) => {
                        setEditHours({
                          ...editHours,
                          [day]: { ...h, close: e.target.value },
                        });
                      }}
                      className="w-full bg-white border border-stone-300 rounded p-1 text-center text-xs"
                    />
                  </div>
                ) : (
                  <div className="py-1 text-center text-stone-400 font-medium italic text-[11px]">
                    Closed all day
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Visual Assets & Branding */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
        <h3 className="font-heading font-bold text-lg text-stone-900 mb-1">
          Visual Branding & Media
        </h3>
        <p className="text-xs text-stone-500 mb-4">
          High-resolution imagery increases inquiry rates by over 40% across Gallatin County.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Logo Image URL</label>
            <input
              type="text"
              value={editLogo}
              onChange={(e) => setEditLogo(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 mb-2"
            />
            <div className="flex items-center gap-3">
              <img src={editLogo} alt="Logo preview" className="w-12 h-12 rounded-xl object-cover border border-stone-200" />
              <span className="text-xs text-stone-400">Preview logo badge</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Cover Banner URL</label>
            <input
              type="text"
              value={editCover}
              onChange={(e) => setEditCover(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 mb-2"
            />
            <div className="h-12 w-full rounded-xl overflow-hidden border border-stone-200 bg-stone-100">
              <img src={editCover} alt="Cover preview" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-stone-100 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-6 py-2.5 rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
          >
            <Save size={14} />
            <span>Save All Listing Changes</span>
          </button>
        </div>
      </div>
    </form>
  );
};
