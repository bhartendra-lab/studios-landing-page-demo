import Head from 'next/head';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import GalleryGrid from '@/components/GalleryGrid';
import { fetchGallery } from '@/lib/fetchGallery';
import { fetchStudioConfig } from '@/lib/fetchStudioConfig';
import styles from './[eventSlug].module.css';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function EventGalleryPage({ config, event }) {
  const { studioName, city } = config;
  const venueName = event.venue?.name ?? '';
  const venueCity = event.venue?.city ?? '';

  const imageGallerySchema = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: `${event.eventName} — ${venueName}`,
    image: event.photos.map((p) => p.publicUrl),
  };

  return (
    <>
      <Head>
        <title>{`${event.eventName} — ${venueName} · ${studioName}`}</title>
        <meta
          name="description"
          content={`Photographs from ${event.eventName} wedding at ${venueName} in ${venueCity}. ${studioName} is a wedding photographer covering ${city} and surrounding regions.`}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(imageGallerySchema) }}
        />
      </Head>

      <Nav studioName={studioName} />

      <main className={styles.main}>
        <div className={styles.container}>
          <Link href="/gallery" className={styles.backLink}>
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
              <path d="M13 5H1m0 0l4-4M1 5l4 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>All weddings</span>
          </Link>

          <header className={styles.header}>
            <div className={styles.headerInfo}>
              <span className={`${styles.eyebrow} ${styles.animateUp}`} style={{ '--delay': '0ms' }}>
                <span className={styles.eyebrowMark} />
                {venueCity} · {formatDate(event.eventDate)}
              </span>
              <h1 className={`${styles.h1} ${styles.animateUp}`} style={{ '--delay': '80ms' }}>
                <em>{event.eventName}</em>
              </h1>
              <p className={`${styles.sub} ${styles.animateUp}`} style={{ '--delay': '160ms' }}>{venueName}</p>
            </div>
            <div className={`${styles.headerMeta} ${styles.animateUp}`} style={{ '--delay': '200ms' }}>
              <span className={styles.metaItem}>
                <span className={styles.metaLabel}>Photos</span>
                <span className={styles.metaValue}>{event.photos.length}</span>
              </span>
              <span className={styles.metaItem}>
                <span className={styles.metaLabel}>Venue</span>
                <span className={styles.metaValue}>{venueName}</span>
              </span>
              <span className={styles.metaItem}>
                <span className={styles.metaLabel}>Date</span>
                <span className={styles.metaValue}>{formatDate(event.eventDate)}</span>
              </span>
            </div>
          </header>

          {event.summary && (
            <div className={`${styles.summaryBlock} ${styles.animateUp}`} style={{ '--delay': '280ms' }}>
              <span className={styles.summaryMark} aria-hidden="true">&ldquo;</span>
              <p className={styles.summaryText}>{event.summary}</p>
            </div>
          )}

          <GalleryGrid
            photos={event.photos}
            eventName={event.eventName}
            venueName={venueName}
            venueCity={venueCity}
          />
        </div>
      </main>

      <Footer config={config} />
    </>
  );
}

export async function getStaticPaths() {
  const gallery = await fetchGallery();
  const paths = gallery.events.map((e) => ({
    params: { eventSlug: e.eventSlug },
  }));

  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const [gallery, config] = await Promise.all([
    fetchGallery(),
    fetchStudioConfig(),
  ]);

  const event = gallery.events.find((e) => e.eventSlug === params.eventSlug);

  if (!event) {
    return { notFound: true };
  }

  return {
    props: { config, event },
    revalidate: 60,
  };
}
