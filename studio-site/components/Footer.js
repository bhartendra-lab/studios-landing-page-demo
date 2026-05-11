import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer({ config }) {
  const { studioName, tagline, socialLinks, contact } = config;
  const year = new Date().getFullYear();

  const socials = [
    socialLinks.instagram && { label: 'Instagram', href: socialLinks.instagram },
    socialLinks.facebook && { label: 'Facebook', href: socialLinks.facebook },
    socialLinks.youtube && { label: 'YouTube', href: socialLinks.youtube },
  ].filter(Boolean);

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brandBlock}>
          <p className={styles.eyebrow}>
            <span className={styles.eyebrowMark} />
            Wedding Photography
          </p>
          <h3 className={styles.name}>
            <em>{studioName}</em>
          </h3>
          <p className={styles.tagline}>{tagline}</p>
        </div>

        <div className={styles.col}>
          <h4 className={styles.colHeading}>Studio</h4>
          <nav className={styles.colLinks} aria-label="Footer navigation">
            <Link href="/gallery">Gallery</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </div>

        <div className={styles.col}>
          <h4 className={styles.colHeading}>Connect</h4>
          <div className={styles.colLinks}>
            {socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">
                {s.label}
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                  <path d="M2 8L8 2m0 0H3m5 0v5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            ))}
          </div>
        </div>

        <div className={styles.col}>
          <h4 className={styles.colHeading}>Contact</h4>
          <div className={styles.contactBlock}>
            <a href={`mailto:${contact.email}`} className={styles.contactLink}>
              {contact.email}
            </a>
            <a href={`tel:${contact.phone.replace(/\s+/g, '')}`} className={styles.contactLink}>
              {contact.phone}
            </a>
            <p className={styles.address}>{contact.address}</p>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <span>&copy; {year} {studioName}. All rights reserved.</span>
        <span>Designed with care.</span>
      </div>
    </footer>
  );
}
