import Image from 'next/image';
import { useMemo } from 'react';
import styles from './HeroSection.module.css';

const COLUMN_COUNT = 4;
const MIN_PER_COLUMN = 4;

/**
 * Distribute the photo pool across N columns, round-robin.
 * Each column then needs at least MIN_PER_COLUMN distinct images so the loop
 * has visual variety. If the pool is too small we recycle.
 */
function buildColumns(photos, columnCount) {
  if (!photos || photos.length === 0) return [];
  const columns = Array.from({ length: columnCount }, () => []);
  photos.forEach((photo, i) => {
    columns[i % columnCount].push(photo);
  });
  // Ensure each column has at least MIN_PER_COLUMN entries
  return columns.map((col) => {
    if (col.length === 0) return col;
    const padded = [...col];
    let i = 0;
    while (padded.length < MIN_PER_COLUMN) {
      padded.push(col[i % col.length]);
      i += 1;
    }
    return padded;
  });
}

function CollageColumn({ photos, columnIndex, totalColumns, eager }) {
  if (!photos || photos.length === 0) return null;

  const directionUp = columnIndex % 2 === 0;
  // Stagger duration so columns don't move in lock-step.
  const duration = 42 + columnIndex * 7;
  const delay = -columnIndex * 4;

  // Duplicate the list so the translate(-50%) loop is seamless.
  const loopList = [...photos, ...photos];

  return (
    <div
      className={`${styles.column} ${directionUp ? styles.columnUp : styles.columnDown}`}
      style={{
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
      }}
      aria-hidden="true"
    >
      {loopList.map((photo, i) => {
        // Only the very first frame of the very first column gets `priority`,
        // to keep LCP credit on a single image.
        const isFirst = eager && i === 0;
        return (
          <div
            key={`${columnIndex}-${i}-${photo.publicUrl}`}
            className={styles.tile}
          >
            <Image
              src={photo.publicUrl}
              alt=""
              fill
              sizes={`(max-width: 768px) 50vw, (max-width: 1024px) 34vw, ${Math.round(100 / totalColumns)}vw`}
              placeholder="empty"
              priority={isFirst}
              loading={isFirst ? 'eager' : 'lazy'}
              style={{ objectFit: 'cover' }}
            />
          </div>
        );
      })}
    </div>
  );
}

function StarIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export default function HeroSection({
  photos,
  fallbackHero,
  studioName,
  tagline,
  city,
  googleRating,
}) {
  const sourcePhotos = useMemo(() => {
    if (Array.isArray(photos) && photos.length > 0) return photos;
    if (fallbackHero?.publicUrl) {
      return [
        {
          publicUrl: fallbackHero.publicUrl,
          eventName: fallbackHero.eventName,
        },
      ];
    }
    return [];
  }, [photos, fallbackHero]);

  const columns = useMemo(
    () => buildColumns(sourcePhotos, COLUMN_COUNT),
    [sourcePhotos],
  );

  return (
    <section className={styles.hero} aria-label="Hero">
      <div className={styles.collage} aria-hidden="true">
        {columns.map((col, i) => (
          <CollageColumn
            key={i}
            photos={col}
            columnIndex={i}
            totalColumns={columns.length}
            eager={i === 0}
          />
        ))}
      </div>

      <div className={styles.gradient} aria-hidden="true" />
      <div className={styles.grain} aria-hidden="true" />

      <div className={styles.topRow}>
        <span className={styles.topMeta}>
          <span className={styles.topDot} />
          Wedding Photography{city ? ` · ${city}` : ''}
        </span>
        <span className={styles.topMeta}>Est. 2011</span>
      </div>

      <div className={styles.content}>
        <h1 className={styles.heading}>
          <span className={styles.headingSans}>Stories of</span>
          <span className={styles.headingItalic}>love, light</span>
          <span className={styles.headingSans}>&amp; lasting</span>
          <span className={styles.headingItalic}>moments.</span>
        </h1>
        <p className={styles.tagline}>{tagline}</p>
        <a href="#latest-work" className={styles.cta}>
          <span>View our work</span>
          <svg width="18" height="10" viewBox="0 0 18 10" fill="none" aria-hidden="true">
            <path d="M1 5h15m0 0L12 1m4 4l-4 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>

        {googleRating && (
          <a
            href={googleRating.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.googleRating}
            aria-label={`Rated ${googleRating.score} out of 5 on Google — ${googleRating.count} reviews`}
          >
            <svg className={styles.googleIcon} viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className={styles.googleRatingStars}>
              {[1, 2, 3, 4, 5].map((n) => (
                <span
                  key={n}
                  className={styles.googleRatingStar}
                  style={{ opacity: n <= Math.round(googleRating.score) ? 1 : 0.3 }}
                >
                  <StarIcon />
                </span>
              ))}
            </span>
            <span className={styles.googleRatingScore}>{googleRating.score}</span>
            <span className={styles.googleRatingDivider} aria-hidden="true" />
            <span className={styles.googleRatingCount}>{googleRating.count} reviews</span>
          </a>
        )}
      </div>

      <div className={styles.scrollCue} aria-hidden="true">
        <span className={styles.scrollLabel}>Scroll</span>
        <span className={styles.scrollLine} />
      </div>
    </section>
  );
}
