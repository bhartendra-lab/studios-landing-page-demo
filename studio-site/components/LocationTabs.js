import styles from './LocationTabs.module.css';

export default function LocationTabs({ locations, active, onChange }) {
  const all = ['All', ...locations];

  return (
    <div className={styles.tabs} role="tablist" aria-label="Filter by location">
      {all.map((loc) => (
        <button
          key={loc}
          role="tab"
          aria-selected={active === loc}
          className={`${styles.tab} ${active === loc ? styles.active : ''}`}
          onClick={() => onChange(loc)}
        >
          {loc}
        </button>
      ))}
    </div>
  );
}
