import SensorDataChart from '../SensorData/SensorDataChart';
import styles from './SensorDashboard.module.css';

interface SensorDashboardProps {
  stationName?: string;
}

function SensorDashboard({
  stationName = 'Sensor Station',
}: SensorDashboardProps) {
  const now = new Date();
  const dateLabel = now.toLocaleDateString([], {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.logo}>◈</span>
          <div>
            <h1 className={styles.title}>{stationName}</h1>
            <p className={styles.subtitle}>Environmental Monitor</p>
          </div>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.date}>{dateLabel}</span>
        </div>
      </header>

      <main className={styles.main}>
        <SensorDataChart />
      </main>

      <footer className={styles.footer}>
        <span>Data refreshed via MQTT · Last 20 readings shown</span>
      </footer>
    </div>
  );
}

export default SensorDashboard;
