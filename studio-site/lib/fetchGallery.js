const MOCK_GALLERY = {
  studioId: 'placeholder_studio_id',
  hero: {
    publicUrl:
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80',
    eventName: 'Ananya & Rohan Wedding',
    eventDate: '2024-11-15',
  },
  events: [
    {
      eventName: 'Ananya & Rohan Wedding',
      eventSlug: 'ananya-rohan-wedding',
      eventDate: '2024-11-15',
      summary:
        'Nestled along the banks of the Betwa river, Ananya and Rohan chose Orchha for its living history and golden silence. The ceremony unfolded at dusk beneath arched sandstone corridors — garlands exchanged in the glow of diyas, laughter echoing through centuries-old halls. Every frame here is a love letter to both a people and a place.',
      venue: {
        name: 'Orchha Palace Resort',
        city: 'Orchha',
        state: 'Madhya Pradesh',
      },
      photos: [
        {
          publicUrl:
            'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
          fileName: 'orchha-ceremony-01.jpg',
          isHero: true,
        },
        {
          publicUrl:
            'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=80',
          fileName: 'orchha-ceremony-02.jpg',
          isHero: false,
        },
        {
          publicUrl:
            'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80',
          fileName: 'orchha-ceremony-03.jpg',
          isHero: false,
        },
        {
          publicUrl:
            'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&q=80',
          fileName: 'orchha-reception-01.jpg',
          isHero: false,
        },
        {
          publicUrl:
            'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&q=80',
          fileName: 'orchha-reception-02.jpg',
          isHero: false,
        },
      ],
    },
    {
      eventName: 'Meera & Sameer Wedding',
      eventSlug: 'meera-sameer-wedding',
      eventDate: '2024-10-03',
      summary:
        "With the Taj Mahal as a quiet witness on the horizon, Meera and Sameer celebrated a wedding that felt both grand and deeply intimate. Soft morning light poured through the Convention's tall windows during the pheras, and by evening the lawns were lit gold. A day built on the patience of love — and the perfect light it always finds.",
      venue: {
        name: 'Taj View Convention',
        city: 'Agra',
        state: 'Uttar Pradesh',
      },
      photos: [
        {
          publicUrl:
            'https://images.unsplash.com/photo-1530023367847-a683933f4172?w=800&q=80',
          fileName: 'agra-ceremony-01.jpg',
          isHero: true,
        },
        {
          publicUrl:
            'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80',
          fileName: 'agra-ceremony-02.jpg',
          isHero: false,
        },
        {
          publicUrl:
            'https://images.unsplash.com/photo-1524863479829-916d8e77f114?w=800&q=80',
          fileName: 'agra-portrait-01.jpg',
          isHero: false,
        },
        {
          publicUrl:
            'https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?w=800&q=80',
          fileName: 'agra-portrait-02.jpg',
          isHero: false,
        },
      ],
    },
    {
      eventName: 'Divya & Akash Wedding',
      eventSlug: 'divya-akash-wedding',
      eventDate: '2024-02-18',
      summary:
        "Perched on a hillside that has watched over Rajasthan for six centuries, Neemrana Fort Palace became the stage for Divya and Akash's winter wedding. Saffron and ivory draped the ancient courtyards; horses, fire, and song filled the February night. This is a story told in textures — carved stone, marigold petals, and the quiet glance shared between two people at the start of everything.",
      venue: {
        name: 'Neemrana Fort Palace',
        city: 'Neemrana',
        state: 'Rajasthan',
      },
      photos: [
        {
          publicUrl:
            'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80',
          fileName: 'neemrana-ceremony-01.jpg',
          isHero: true,
        },
        {
          publicUrl:
            'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80',
          fileName: 'neemrana-ceremony-02.jpg',
          isHero: false,
        },
        {
          publicUrl:
            'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=800&q=80',
          fileName: 'neemrana-reception-01.jpg',
          isHero: false,
        },
        {
          publicUrl:
            'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?w=800&q=80',
          fileName: 'neemrana-reception-02.jpg',
          isHero: false,
        },
        {
          publicUrl:
            'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
          fileName: 'neemrana-portrait-01.jpg',
          isHero: false,
        },
        {
          publicUrl:
            'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80',
          fileName: 'neemrana-portrait-02.jpg',
          isHero: false,
        },
      ],
    },
  ],
  totalPhotos: 15,
  lastUpdated: '2024-11-16T08:00:00Z',
};

/**
 * Fetch gallery data for a studio from the Gallery API.
 * Cache key hint: studio:{studioId}:gallery  TTL: 300s
 * Falls back to mock data when API is unavailable or STUDIO_ID is the placeholder.
 */
export async function fetchGallery() {
  const studioId = process.env.NEXT_PUBLIC_STUDIO_ID;
  const apiBase = process.env.NEXT_PUBLIC_GALLERY_API;

  if (!studioId || studioId === 'placeholder_studio_id' || !apiBase) {
    return MOCK_GALLERY;
  }

  try {
    const res = await fetch(`${apiBase}/gallery/${studioId}`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      console.warn(`Gallery API returned ${res.status} — using mock data`);
      return MOCK_GALLERY;
    }

    return await res.json();
  } catch (err) {
    console.warn('Gallery API fetch failed — using mock data:', err.message);
    return MOCK_GALLERY;
  }
}
