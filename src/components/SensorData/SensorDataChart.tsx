import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

import { getHistoricalSensorData } from '../../services/sensor-data-service';
import styles from './SensorDataChart.module.css';

import type { SensorData } from '../../interfaces/sensor-data';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

function makeOptions(title: string, yLabel: string) {
  return {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: title, font: { size: 16 } },
    },
    scales: {
      x: { title: { display: true, text: 'Time' } },
      y: { beginAtZero: false, title: { display: true, text: yLabel } },
    },
  };
}

function SensorDataChart() {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getHistoricalSensorData();
        if (!data) throw new Error('No data returned');
        setSensorData(data);
      } catch (err) {
        console.error('API error: ', err);
        setError('Failed to load sensor data.');
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  if (loading) return <div>Loading details...</div>;
  if (error) return <div>{error}</div>;
  if (sensorData.length === 0) return <div>No sensor data available.</div>;

  const labels = sensorData.map((d) =>
    new Date(d.createdAt).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
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
      <div className={styles.chartWrapper}>
        <Bar
          data={temperatureData}
          options={makeOptions('Temperature Over Time', 'Temperature (°C)')}
        />
      </div>
      <div className={styles.chartWrapper}>
        <Bar
          data={humidityData}
          options={makeOptions('Humidity Over Time', 'Humidity (%)')}
        />
      </div>
    </div>
  );
}

export default SensorDataChart;
