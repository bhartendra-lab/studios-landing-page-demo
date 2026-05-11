import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import TestimonialStrip from '@/components/TestimonialStrip';
import { fetchGallery } from '@/lib/fetchGallery';
import { fetchStudioConfig } from '@/lib/fetchStudioConfig';
import { fetchHeroCollage } from '@/lib/fetchHeroCollage';
import styles from './index.module.css';

function formatEventDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

export default function Home({ config, gallery, heroPhotos }) {
  const { studioName, tagline, city, contact, testimonials, locationsServed, googleRating } = config;
  const latestEvent = gallery.events[0];
  const previewPhotos = latestEvent?.photos?.slice(0, 4) ?? [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: studioName,
    telephone: contact.phone,
    email: contact.email,
    address: contact.address,
    url: '',
  };

  const stats = [
    { value: '13', label: 'Years' },
    { value: '300+', label: 'Weddings' },
    { value: gallery.events?.length ?? 0, label: 'Featured stories' },
    { value: locationsServed?.length ?? 0, label: 'Cities covered' },
  ];

  return (
    <>
      <Head>
        <title>{`${studioName} — Wedding Photographer in ${city}`}</title>
        <meta name="description" content={tagline} />
        <meta property="og:title" content={`${studioName} — Wedding Photographer in ${city}`} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={gallery.hero.publicUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <Nav studioName={studioName} transparent />

      <main>
        {/* Hero + stats share the first 100vh so the strip is always above the fold */}
        <div className={styles.heroWrapper}>
          <HeroSection
            photos={heroPhotos}
            fallbackHero={gallery.hero}
            studioName={studioName}
            tagline={tagline}
            city={city}
            googleRating={googleRating}
          />

          <section className={styles.stats} aria-label="Studio at a glance">
            <div className={styles.statsInner}>
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  className={styles.stat}
                  style={{ '--stat-i': i }}
                >
                  <span className={styles.statValue}>{s.value}</span>
                  <span className={styles.statLabel}>{s.label}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Latest Work */}
        <section id="latest-work" className={styles.latestWork}>
          <div className={styles.container}>
            <header className={styles.sectionHeader}>
              <span className={styles.eyebrow}>
                <span className={styles.eyebrowMark} />
                Featured story · 01
              </span>
              <h2 className={styles.sectionHeading}>
                <span>Recent</span> <em>weddings</em>
              </h2>
              {latestEvent && (
                <p className={styles.eventMeta}>
                  {latestEvent.eventName} · {latestEvent.venue?.name}
                  {latestEvent.eventDate ? ` · ${formatEventDate(latestEvent.eventDate)}` : ''}
                </p>
              )}
            </header>

            <div className={styles.photoGrid}>
              {previewPhotos[0] && (
                <div className={`${styles.photoCell} ${styles.photoCellLarge}`}>
                  <Image
                    src={previewPhotos[0].publicUrl}
                    alt={`${latestEvent?.eventName ?? ''} — ${latestEvent?.venue?.name ?? ''}`}
                    fill
                    placeholder="empty"
                    loading="eager"
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 900px) 100vw, 60vw"
                  />
                </div>
              )}
              <div className={styles.photoColumn}>
                {previewPhotos.slice(1, 3).map((photo, i) => (
                  <div key={i} className={styles.photoCell}>
                    <Image
                      src={photo.publicUrl}
                      alt={`${latestEvent?.eventName ?? ''} — ${latestEvent?.venue?.name ?? ''}`}
                      fill
                      placeholder="empty"
                      loading="lazy"
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 900px) 100vw, 40vw"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.galleryLink}>
              <Link href="/gallery" className={styles.galleryLinkAnchor}>
                <span>Explore the full archive</span>
                <svg width="20" height="10" viewBox="0 0 20 10" fill="none" aria-hidden="true">
                  <path d="M1 5h17m0 0L14 1m4 4l-4 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        <TestimonialStrip testimonials={testimonials} />

        {/* Closing CTA */}
        <section className={styles.closingCta}>
          <div className={styles.container}>
            <span className={styles.eyebrow}>
              <span className={styles.eyebrowMark} />
              Begin
            </span>
            <h2 className={styles.ctaHeading}>
              <em>Tell us</em> about your day.
            </h2>
            <p className={styles.ctaCopy}>
              We take on a limited number of weddings each season. Reach out early so we can plan, listen, and craft a story made entirely for you.
            </p>
            <Link href="/contact" className={styles.ctaButton}>
              <span>Start a conversation</span>
              <svg width="18" height="10" viewBox="0 0 18 10" fill="none" aria-hidden="true">
                <path d="M1 5h15m0 0L12 1m4 4l-4 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </section>
      </main>

      <Footer config={config} />
    </>
  );
}

export async function getStaticProps() {
  const [gallery, config, heroPhotos] = await Promise.all([
    fetchGallery(),
    fetchStudioConfig(),
    fetchHeroCollage({ size: 18 }),
  ]);

  return {
    props: { config, gallery, heroPhotos },
    revalidate: 60,
  };
}
