import Image from 'next/image';
import styles from './TeamGrid.module.css';

function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function MemberCard({ member, index }) {
  return (
    <div className={styles.card}>
      <div className={styles.photoWrap}>
        {member.photoUrl ? (
          <Image
            src={member.photoUrl}
            alt={member.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            placeholder="empty"
            loading="lazy"
            className={styles.photo}
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div className={styles.initials} aria-label={member.name}>
            <span>{getInitials(member.name)}</span>
          </div>
        )}
        <span className={styles.indexBadge}>0{index + 1}</span>
      </div>
      <div className={styles.info}>
        <p className={styles.name}>{member.name}</p>
        <p className={styles.role}>{member.role}</p>
      </div>
    </div>
  );
}

export default function TeamGrid({ team }) {
  if (!team?.length) return null;

  return (
    <div className={styles.grid}>
      {team.map((member, i) => (
        <MemberCard key={i} member={member} index={i} />
      ))}
    </div>
  );
}
