import Image from 'next/image';
import Link from 'next/link';
import styles from './EventCard.module.css';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

export default function EventCard({ event, index = 0 }) {
  const heroPhoto = event.photos.find((p) => p.isHero) ?? event.photos[0];
  const venueName = event.venue?.name ?? '';
  const venueCity = event.venue?.city ?? '';

  return (
    <Link href={`/gallery/${event.eventSlug}`} className={styles.card}>
      <div className={styles.imageWrap}>
        {heroPhoto && (
          <Image
            src={heroPhoto.publicUrl}
            alt={`${event.eventName} — ${venueName}`}
            fill
            placeholder="empty"
            loading="lazy"
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        )}
        <span className={styles.indexBadge}>0{index + 1}</span>
        <div className={styles.viewHint}>
          <span>View story</span>
          <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden="true">
            <path d="M1 5h13m0 0L10 1m4 4l-4 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <div className={styles.info}>
        <div className={styles.topInfo}>
          <h2 className={styles.name}>{event.eventName}</h2>
          <span className={styles.location}>{venueCity}</span>
        </div>
        <div className={styles.metaRow}>
          <span className={styles.venue}>{venueName}</span>
          <span className={styles.dot} aria-hidden="true">·</span>
          <span className={styles.date}>{formatDate(event.eventDate)}</span>
          <span className={styles.dot} aria-hidden="true">·</span>
          <span className={styles.count}>{event.photos.length} frames</span>
        </div>
      </div>
    </Link>
  );
}
