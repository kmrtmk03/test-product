import styles from './Card.module.sass'

export interface CardData {
  id: number,
  user: {
    name: string,
    email: string,
    avatar: string,
  },
  title: string,
  description: string,
  timestamp: string,
  attachment: boolean,
  flagged: boolean,
  color: string,
}

interface CardProps {
  card: CardData,
}

const Card = ({ card }: CardProps) => {
  return (
    <div className={`${styles.card} ${styles[`card--${card.color}`]}`}>
      <div className={styles.cardHeader}>
        <span className={styles.cardIcon}></span>
        <div className={styles.cardUserInfo}>
          <div className={styles.cardUserName}>{card.user.name}</div>
          <div className={styles.cardUserEmail}>{card.user.email}</div>
        </div>
      </div>
      <div className={styles.cardBody}>
        <h2 className={styles.cardTitle}>{card.title}</h2>
        <p className={styles.cardDescription}>{card.description}</p>
      </div>
      <div className={styles.cardFooter}>
        {card.attachment && <span className={styles.cardAttachment}>📎</span>}
        <span className={styles.cardTimestamp}>{card.timestamp}</span>
        {card.flagged && <span className={styles.cardFlag}>🚩</span>}
      </div>
    </div>
  )
}

export default Card