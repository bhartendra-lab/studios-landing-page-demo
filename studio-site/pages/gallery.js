import Head from 'next/head';
import { useState } from 'react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import LocationTabs from '@/components/LocationTabs';
import EventCard from '@/components/EventCard';
import { fetchGallery } from '@/lib/fetchGallery';
import { fetchStudioConfig } from '@/lib/fetchStudioConfig';
import styles from './gallery.module.css';

export default function GalleryPage({ config, events }) {
  const { studioName, city, locationsServed } = config;
  const [activeLocation, setActiveLocation] = useState('All');

  const uniqueCities = [...new Set(events.map((e) => e.venue?.city).filter(Boolean))];
  const filtered =
    activeLocation === 'All'
      ? events
      : events.filter((e) => e.venue?.city === activeLocation);

  const locationNames = locationsServed.map((l) => l.venueName).join(', ');

  return (
    <>
      <Head>
        <title>{`Gallery — ${studioName} Wedding Photography`}</title>
        <meta
          name="description"
          content={`Browse weddings photographed across ${locationNames}. ${studioName} based in ${city}.`}
        />
      </Head>

      <Nav studioName={studioName} />

      <main className={styles.main}>
        <div className={styles.container}>
          <header className={styles.pageHeader}>
            <span className={styles.eyebrow}>
              <span className={styles.eyebrowMark} />
              Portfolio · 0{events.length}
            </span>
            <h1 className={styles.h1}>
              <span>Weddings across</span>{' '}
              <em>{city}</em>
              <span> &amp; beyond.</span>
            </h1>
            <p className={styles.subtitle}>
              An evolving collection of celebrations &mdash; from intimate ceremonies to grand affairs.
            </p>
          </header>

          <LocationTabs
            locations={uniqueCities}
            active={activeLocation}
            onChange={setActiveLocation}
          />

          {filtered.length === 0 ? (
            <p className={styles.empty}>No weddings found for this location.</p>
          ) : (
            <div className={styles.grid}>
              {filtered.map((event, i) => (
                <EventCard key={event.eventSlug} event={event} index={i} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer config={config} />
    </>
  );
}

export async function getStaticProps() {
  const [gallery, config] = await Promise.all([
    fetchGallery(),
    fetchStudioConfig(),
  ]);

  return {
    props: { config, events: gallery.events },
    revalidate: 60,
  };
}
