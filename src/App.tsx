import styles from './App.module.sass'

const cardData = [
  {
    id: 1,
    user: { name: 'Allison Hill', email: 'allison.hill57@example.com', avatar: 'https://i.pravatar.cc/40?u=1' },
    title: 'Event Photos',
    description: 'Innovate customized ecologies best-of-breed mashups turn-key exploit cultivate transition create enable exploit, convergence revolutionary.',
    timestamp: '15m ago',
    attachment: true,
    flagged: false,
    color: 'blue'
  },
  {
    id: 2,
    user: { name: 'Scott Lane', email: 'scott.lane40@example.com', avatar: 'https://i.pravatar.cc/40?u=2' },
    title: '→ Project Brief',
    description: 'Rich aggregate deploy deploy integrate AJAX-enabled value-added global: blogging wikis web-readiness, vortals cross-platform maximize.',
    timestamp: 'Yesterday',
    attachment: false,
    flagged: true,
    color: 'red'
  },
  {
    id: 3,
    user: { name: 'Jayden Sullivan', email: 'jayden.sullivan@example.com', avatar: 'https://i.pravatar.cc/40?u=3' },
    title: 'Design Approval',
    description: 'View Conversation',
    timestamp: '2h ago',
    attachment: false,
    flagged: false,
    color: 'green'
  },
  {
    id: 4,
    user: { name: 'Marian Hawkins', email: 'marian.hawkins58@example.com', avatar: 'https://i.pravatar.cc/40?u=4' },
    title: 'Invitation',
    description: 'Blogospheres redefine disintermediate relationships supply-chains models engineer world-class grow vortals seize utilize productize engage.',
    timestamp: '07.07.14',
    attachment: false,
    flagged: false,
    color: 'purple'
  },
  {
    id: 5,
    user: { name: 'Clinton Barnett', email: 'clinton.barnett59@example.com', avatar: 'https://i.pravatar.cc/40?u=5' },
    title: '← Sales Report',
    description: 'Capture user-centred ecologies enterprise expedite ecologies solutions back-end maximize mindshare impactful customized podcasts.',
    timestamp: '07.07.14',
    attachment: true,
    flagged: false,
    color: 'orange'
  },
  {
    id: 6,
    user: { name: 'Alma Harrison', email: 'alma.harrison36@example.com', avatar: 'https://i.pravatar.cc/40?u=6' },
    title: '← Weekend',
    description: 'Transform communities models implement blogging streamline harness repurpose viral cultivate. Grow compelling visualize cultivate applications.',
    timestamp: '06.07.14',
    attachment: false,
    flagged: true,
    color: 'yellow'
  },
];

function App() {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.inner}>
        {cardData.map(card => (
          <div key={card.id} className={`${styles.card} ${styles[`card--${card.color}`]}`}>
            <div className={styles.cardHeader}>
              <img src={card.user.avatar} alt={card.user.name} className={styles.cardAvatar} />
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
        ))}
      </div>
    </div>
  )
}

export default App