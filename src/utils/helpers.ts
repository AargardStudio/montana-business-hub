import { Business, DayOfWeek } from '../types';

/**
 * Generate contextual WhatsApp link
 */
export function getContextualWhatsAppUrl(
  phone: string,
  businessName: string,
  context?: { type?: 'service' | 'product' | 'general' | 'quote'; itemName?: string }
): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  let message = `Hello, I found ${businessName} on Bozeman Business Hub.`;

  if (context?.type === 'product' && context.itemName) {
    message = `Hello, I found ${businessName} on Bozeman Business Hub. I'd like more information about "${context.itemName}".`;
  } else if (context?.type === 'service' && context.itemName) {
    message = `Hello, I found ${businessName} on Bozeman Business Hub. I am interested in your "${context.itemName}" service and would like to inquire about availability and details.`;
  } else if (context?.type === 'quote') {
    message = `Hello, I found ${businessName} on Bozeman Business Hub. I would like to request a quote.`;
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Check if business is currently open
 */
export function isBusinessOpen(business: Business): { isOpen: boolean; text: string; nextTime?: string } {
  const days: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const now = new Date();
  const currentDay = days[now.getDay()];
  const currentHours = business.hours[currentDay];

  if (!currentHours || currentHours.closed) {
    return { isOpen: false, text: 'Closed Today' };
  }

  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [openH, openM] = currentHours.open.split(':').map(Number);
  const [closeH, closeM] = currentHours.close.split(':').map(Number);

  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
    return {
      isOpen: true,
      text: `Open until ${formatTimeString(currentHours.close)}`,
    };
  } else if (currentMinutes < openMinutes) {
    return {
      isOpen: false,
      text: `Opens at ${formatTimeString(currentHours.open)}`,
    };
  } else {
    return {
      isOpen: false,
      text: 'Closed for the day',
    };
  }
}

export function formatTimeString(time24: string): string {
  if (!time24) return '';
  const [h, m] = time24.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${m.toString().padStart(2, '0')} ${period}`;
}

/**
 * Generate LocalBusiness Schema for SEO
 */
export function generateLocalBusinessSchema(business: Business) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: business.name,
    description: business.description,
    image: business.coverUrl,
    logo: business.logoUrl,
    telephone: business.contact.phone,
    email: business.contact.email,
    url: business.contact.website,
    priceRange: business.priceRange,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.location.address,
      addressLocality: business.location.city,
      addressRegion: business.location.state,
      postalCode: business.location.postalCode,
      addressCountry: business.location.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: business.location.lat,
      longitude: business.location.lng,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: business.rating,
      reviewCount: business.reviewsCount,
    },
  };
}
