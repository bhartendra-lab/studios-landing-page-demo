import { useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './GalleryGrid.module.css';

export default function GalleryGrid({ photos, eventName, venueName, venueCity }) {
  const gridRef = useRef(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const cells = grid.querySelectorAll('[data-cell]');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.dataset.visible = '1';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.06, rootMargin: '0px 0px -32px 0px' },
    );

    cells.forEach((cell) => observer.observe(cell));
    return () => observer.disconnect();
  }, [photos]);

  if (!photos?.length) return null;

  const locationLabel = [venueName, venueCity].filter(Boolean).join(', ');

  return (
    <div className={styles.grid} ref={gridRef}>
      {photos.map((photo, i) => (
        <div
          key={i}
          className={styles.cell}
          data-cell
          style={{ '--i': Math.min(i, 12) }}
        >
          <div className={styles.cellInner}>
            <Image
              src={photo.publicUrl}
              alt={`${eventName} wedding photography at ${locationLabel} — ${photo.fileName}`}
              fill
              placeholder="empty"
              loading={i < 6 ? 'eager' : 'lazy'}
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
          <div className={styles.cellOverlay} aria-hidden="true" />
        </div>
      ))}
    </div>
  );
}
