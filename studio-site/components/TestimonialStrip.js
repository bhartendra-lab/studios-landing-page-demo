import styles from './TestimonialStrip.module.css';

export default function TestimonialStrip({ testimonials }) {
  if (!testimonials?.length) return null;

  return (
    <section className={styles.section} aria-label="Client testimonials">
      <div className={styles.header}>
        <span className={styles.eyebrow}>
          <span className={styles.eyebrowMark} />
          Kind words · 02
        </span>
        <h2 className={styles.heading}>
          What our <em>couples</em> say
        </h2>
      </div>

      <div className={styles.track} role="list">
        {testimonials.map((t, i) => (
          <article key={i} className={styles.card} role="listitem">
            <span className={styles.quoteMark} aria-hidden="true">&ldquo;</span>
            <blockquote className={styles.quote}>
              <p>{t.text}</p>
            </blockquote>
            <footer className={styles.meta}>
              <span className={styles.divider} aria-hidden="true" />
              <div className={styles.metaInfo}>
                <strong className={styles.client}>{t.clientName}</strong>
                <span className={styles.location}>{t.location}</span>
              </div>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}
