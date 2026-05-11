import Head from 'next/head';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import TeamGrid from '@/components/TeamGrid';
import { fetchStudioConfig } from '@/lib/fetchStudioConfig';
import styles from './about.module.css';

export default function AboutPage({ config }) {
  const { studioName, city, about, testimonials } = config;
  const firstSentence = about.description.split(/\.\s+/)[0] + '.';

  return (
    <>
      <Head>
        <title>{`About — ${studioName} Wedding Photographers in ${city}`}</title>
        <meta name="description" content={firstSentence} />
      </Head>

      <Nav studioName={studioName} />

      <main className={styles.main}>
        {/* Intro */}
        <section className={styles.intro}>
          <div className={styles.container}>
            <span className={styles.eyebrow}>
              <span className={styles.eyebrowMark} />
              About the studio · Est. {about.founded}
            </span>
            <h1 className={styles.h1}>
              <span>A studio devoted to</span>{' '}
              <em>quiet, honest moments.</em>
            </h1>
          </div>
        </section>

        {/* Story */}
        <section className={styles.story}>
          <div className={styles.container}>
            <div className={styles.storyGrid}>
              <aside className={styles.storyAside}>
                <span className={styles.asideLabel}>Based in</span>
                <p className={styles.asideValue}>{city}</p>
                <span className={styles.asideLabel}>Founded</span>
                <p className={styles.asideValue}>{about.founded}</p>
              </aside>
              <p className={styles.description}>{about.description}</p>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className={styles.teamSection}>
          <div className={styles.container}>
            <header className={styles.sectionHeader}>
              <span className={styles.eyebrow}>
                <span className={styles.eyebrowMark} />
                The team · 02
              </span>
              <h2 className={styles.sectionHeading}>
                <span>The hands &amp;</span> <em>eyes</em>{' '}
                <span>behind every frame.</span>
              </h2>
            </header>
            <TeamGrid team={about.team} />
          </div>
        </section>

        {/* Testimonials */}
        {testimonials?.length > 0 && (
          <section className={styles.testimonialsSection}>
            <div className={styles.container}>
              <header className={styles.sectionHeader}>
                <span className={styles.eyebrow}>
                  <span className={styles.eyebrowMark} />
                  Kind words · 03
                </span>
                <h2 className={styles.sectionHeading}>
                  <span>What our</span> <em>couples</em> <span>say.</span>
                </h2>
              </header>

              <div className={styles.testimonialList}>
                {testimonials.map((t, i) => (
                  <article key={i} className={styles.testimonialCard}>
                    <span className={styles.cardIndex}>0{i + 1}</span>
                    <blockquote className={styles.quote}>
                      <p>&ldquo;{t.text}&rdquo;</p>
                    </blockquote>
                    <footer className={styles.testimonialMeta}>
                      <span className={styles.divider} />
                      <div>
                        <strong className={styles.client}>{t.clientName}</strong>
                        <span className={styles.location}>{t.location}</span>
                      </div>
                    </footer>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className={styles.cta}>
          <div className={styles.container}>
            <h2 className={styles.ctaHeading}>
              <em>Ready</em> to begin?
            </h2>
            <p className={styles.ctaCopy}>
              We take on a limited number of weddings each year. Tell us about yours.
            </p>
            <Link href="/contact" className={styles.ctaBtn}>
              <span>Get in touch</span>
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
  const config = await fetchStudioConfig();
  return {
    props: { config },
    revalidate: 3600,
  };
}
