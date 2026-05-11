const MOCK_CONFIG = {
  studioName: 'Tasveer Photography',
  tagline: 'Capturing the soul of your most cherished celebrations',
  city: 'Gwalior',
  locationsServed: [
    { venueName: 'Neemrana Fort Palace', city: 'Neemrana', state: 'Rajasthan' },
    { venueName: 'Orchha Palace Resort', city: 'Orchha', state: 'Madhya Pradesh' },
    { venueName: 'Taj View Convention', city: 'Agra', state: 'Uttar Pradesh' },
  ],
  contact: {
    phone: '+91 94256 78901',
    email: 'hello@tasveerphotography.in',
    address: '42, Lashkar, Gwalior, Madhya Pradesh — 474001',
    whatsapp: '919425678901',
  },
  about: {
    description:
      'Tasveer Photography has been telling love stories through light and frame since 2011. Based in the historic city of Gwalior, we travel across Madhya Pradesh and beyond — from the ghats of Orchha to the grand courtyards of Agra — to document weddings that feel as alive in photographs as they do in memory. Our team blends candid photojournalism with timeless portraiture, ensuring every frame reflects the genuine emotion of your day. We believe that great wedding photography is not about perfection — it is about truth, warmth, and the fleeting moments that make a celebration uniquely yours.',
    founded: '2011',
    team: [
      { name: 'Arjun Sharma', role: 'Lead Photographer', photoUrl: '' },
      { name: 'Priya Mishra', role: 'Candid & Portrait Photographer', photoUrl: '' },
      { name: 'Karan Verma', role: 'Videographer & Editor', photoUrl: '' },
      { name: 'Nidhi Tiwari', role: 'Albums & Client Experience', photoUrl: '' },
    ],
  },
  testimonials: [
    {
      clientName: 'Ananya & Rohan Gupta',
      location: 'Orchha',
      text: 'Arjun and his team captured every small detail of our Orchha wedding that we would have otherwise missed. The candid shots of our family are priceless. We cannot recommend Tasveer Photography enough.',
      rating: 5,
    },
    {
      clientName: 'Meera & Sameer Joshi',
      location: 'Gwalior',
      text: 'From our mehendi to the final vidai, every moment was captured beautifully. The team was unobtrusive and warm, which made our guests comfortable in front of the camera. Absolutely five-star service.',
      rating: 5,
    },
    {
      clientName: 'Divya & Akash Yadav',
      location: 'Jhansi',
      text: 'We had a large two-day wedding in Jhansi and the Tasveer Photography team handled everything with such professionalism. The album is something we will treasure for generations.',
      rating: 5,
    }
  ],
  googleRating: {
    score: 4.9,
    count: 134,
    url: 'https://g.co/kgs/tasveerphotography',
  },
  theme: {
    primaryColor: '#111111',
    accentColor: '#8a6d4b',
    fontHeading: "Segoe UI",
    fontBody: 'sans-serif',
  },
  socialLinks: {
    instagram: 'https://www.instagram.com/tasveerphotography',
    facebook: 'https://www.facebook.com/tasveerphotography',
    youtube: 'https://www.youtube.com/@tasveerphotography',
  },
};

/**
 * Fetch studio config from the Studio Config API.
 * Cache key hint: studio:{studioId}:config  TTL: 86400s
 * Falls back to mock data when API is unavailable or STUDIO_ID is the placeholder.
 */
export async function fetchStudioConfig() {
  const studioId = process.env.NEXT_PUBLIC_STUDIO_ID;
  const apiBase = process.env.NEXT_PUBLIC_GALLERY_API;

  if (!studioId || studioId === 'placeholder_studio_id' || !apiBase) {
    return MOCK_CONFIG;
  }

  try {
    const res = await fetch(`${apiBase}/studio/${studioId}`, {
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      console.warn(`Studio Config API returned ${res.status} — using mock data`);
      return MOCK_CONFIG;
    }

    return await res.json();
  } catch (err) {
    console.warn('Studio Config API fetch failed — using mock data:', err.message);
    return MOCK_CONFIG;
  }
}
