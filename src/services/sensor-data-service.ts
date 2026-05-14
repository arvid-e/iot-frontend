import type { SensorData } from '../interfaces/sensor-data';

export const getHistoricalSensorData = async (): Promise<SensorData[]> => {
  const url = '/api/v1/sensor';

  const response = await fetch(url);
  const sensorData = await response.json();

  return sensorData.data;
};

export const getLatestSensorData = async (): Promise<SensorData> => {
  const url = '/api/v1/sensor/latest';

  const response = await fetch(url);
  const sensorData = await response.json();

  return sensorData.data;
};
