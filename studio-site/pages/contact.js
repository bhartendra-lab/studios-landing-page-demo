import Head from 'next/head';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import { fetchStudioConfig } from '@/lib/fetchStudioConfig';
import styles from './contact.module.css';

function WhatsAppIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

export default function ContactPage({ config }) {
  const { studioName, city, contact } = config;
  const waHref = `https://wa.me/${contact.whatsapp}?text=Hi%2C%20I%27m%20interested%20in%20booking%20a%20wedding%20photography%20session`;

  return (
    <>
      <Head>
        <title>{`Contact — ${studioName}`}</title>
        <meta
          name="description"
          content={`Get in touch with ${studioName} to book wedding photography in ${city} and surrounding locations.`}
        />
      </Head>

      <Nav studioName={studioName} />

      <main className={styles.main}>
        <div className={styles.container}>
          <header className={styles.pageHeader}>
            <span className={styles.eyebrow}>
              <span className={styles.eyebrowMark} />
              Begin a conversation
            </span>
            <h1 className={styles.h1}>
              <span>Let&rsquo;s tell your</span>{' '}
              <em>story</em>
              <span> together.</span>
            </h1>
            <p className={styles.subtitle}>
              Share a few details about your day and we&rsquo;ll get back to you within 24 hours.
            </p>
          </header>

          <div className={styles.grid}>
            {/* Left: contact info */}
            <aside className={styles.info}>
              <ul className={styles.contactList}>
                <li>
                  <span className={styles.contactLabel}>Phone</span>
                  <a href={`tel:${contact.phone.replace(/\s+/g, '')}`} className={styles.contactValue}>
                    {contact.phone}
                  </a>
                </li>
                <li>
                  <span className={styles.contactLabel}>Email</span>
                  <a href={`mailto:${contact.email}`} className={styles.contactValue}>
                    {contact.email}
                  </a>
                </li>
                <li>
                  <span className={styles.contactLabel}>Studio</span>
                  <address className={styles.contactValue}>{contact.address}</address>
                </li>
              </ul>

              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.whatsappBtn}
              >
                <WhatsAppIcon />
                <span>Chat on WhatsApp</span>
              </a>

              <div className={styles.socialBlock}>
                <span className={styles.contactLabel}>Follow</span>
                <div className={styles.social}>
                  {config.socialLinks.instagram && (
                    <a href={config.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                      Instagram
                    </a>
                  )}
                  {config.socialLinks.facebook && (
                    <a href={config.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                      Facebook
                    </a>
                  )}
                  {config.socialLinks.youtube && (
                    <a href={config.socialLinks.youtube} target="_blank" rel="noopener noreferrer">
                      YouTube
                    </a>
                  )}
                </div>
              </div>
            </aside>

            {/* Right: enquiry form */}
            <div className={styles.formWrap}>
              <div className={styles.formCard}>
                <h2 className={styles.formHeading}>
                  Send an <em>enquiry</em>
                </h2>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
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
