import { useDirectory } from '../../context/DirectoryContext';
import { Business } from '../../types';
import { getContextualWhatsAppUrl } from '../../utils/helpers';

/**
 * Shared set of outbound contact/interaction handlers for a business profile.
 * Centralizes the call/WhatsApp/website/directions/share logic so every
 * profile section can trigger them without re-implementing tracking calls.
 */
export function useProfileActions(business: Business) {
  const { trackInteraction } = useDirectory();

  const handlePhoneClick = () => {
    trackInteraction(business.id, 'calls');
    window.location.href = `tel:${business.contact.phone}`;
  };

  const handleWhatsAppGeneral = () => {
    trackInteraction(business.id, 'whatsappClicks');
    const url = getContextualWhatsAppUrl(business.contact.whatsapp, business.name, { type: 'general' });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleWhatsAppItem = (type: 'service' | 'product', itemName: string) => {
    trackInteraction(business.id, 'whatsappClicks');
    const url = getContextualWhatsAppUrl(business.contact.whatsapp, business.name, { type, itemName });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleWebsiteClick = () => {
    trackInteraction(business.id, 'websiteClicks');
    window.open(business.contact.website, '_blank', 'noopener,noreferrer');
  };

  const handleDirectionsClick = () => {
    const query = encodeURIComponent(`${business.name}, ${business.location.address}, Bozeman, MT`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank', 'noopener,noreferrer');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${business.name} | Bozeman Business Hub`,
          text: business.tagline,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Profile link copied to clipboard!');
    }
  };

  return {
    handlePhoneClick,
    handleWhatsAppGeneral,
    handleWhatsAppItem,
    handleWebsiteClick,
    handleDirectionsClick,
    handleShare,
  };
}
