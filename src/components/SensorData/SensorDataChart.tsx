import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';

import { getHistoricalSensorData } from '../../services/sensor-data-service';
import styles from './SensorDataChart.module.css';

import type { SensorData } from '../../interfaces/sensor-data';
import { useMQTT } from '../../services/websocket-hook';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

function makeOptions(title: string, yLabel: string) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: title, font: { size: 16 } },
    },
    scales: {
      x: {
        title: { display: true, text: 'Time' },
        grid: {
          display: true,
          color: 'rgba(199, 192, 192, 0.24)',
          drawOnChartArea: true,
        },
      },
      y: {
        beginAtZero: false,
        title: { display: true, text: yLabel },
        grid: {
          display: true,
          color: 'rgba(134, 129, 129, 0.29)',
          drawOnChartArea: true,
        },
      },
    },
  };
}

function SensorDataChart() {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [isLive, setIsLive] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [ledOn, setLedOn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleData = useCallback((newData: SensorData) => {
    setSensorData((prev) => [...prev.slice(-20), newData]);
    setIsLive(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => setIsLive(false), 8000);
  }, []);

  const { publishLED, isConnected } = useMQTT(handleData);

  const handleToggleLED = () => {
    const nextState = !ledOn;
    setLedOn(nextState);
    publishLED(nextState);
  };

  // Load historical data on mount
  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getHistoricalSensorData();
        setSensorData((data ?? []).slice(-20));
      } catch (err) {
        console.error('API error: ', err);
        setError('Failed to load historical sensor data.');
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  if (loading) return <div>Loading details...</div>;

  const labels = sensorData.map((d) =>
    new Date(d.createdAt).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
  );

  const temperatureData = {
    labels,
    datasets: [
      {
        label: 'Temperature (°C)',
        data: sensorData.map((d) => d.temperature),
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const humidityData = {
    labels,
    datasets: [
      {
        label: 'Humidity (%)',
        data: sensorData.map((d) => d.humidity),
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  return (
    <div className={styles.container}>
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.controls}>
        <button
          onClick={handleToggleLED}
          disabled={!isConnected}
          className={`${styles.ledButton} ${ledOn ? styles.ledButtonOn : ''} ${!isConnected ? styles.disabled : ''}`}
        >
          {isConnected
            ? ledOn
              ? 'Turn LED Off'
              : 'Turn LED On'
            : 'No connection...'}
        </button>

        <div
          className={`${styles.statusCircle} ${ledOn ? styles.circleOn : styles.circleOff}`}
        ></div>
      </div>

      <div className={styles.chartWrapper}>
        <div className={`${styles.status} ${isLive ? styles.live : ''}`}>
          ● Live
        </div>
        <Line
          data={temperatureData}
          options={makeOptions('Temperature Over Time', 'Temperature (°C)')}
        />
      </div>

      <div className={styles.chartWrapper}>
        <div className={`${styles.status} ${isLive ? styles.live : ''}`}>
          ● Live
        </div>
        <Line
          data={humidityData}
          options={makeOptions('Humidity Over Time', 'Humidity (%)')}
        />
      </div>
    </div>
  );
}

export default SensorDataChart;
