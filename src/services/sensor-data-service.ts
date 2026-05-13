export const getHistoricalSensorData = async () => {
  const url = '/sensor';

  const response = await fetch(url);
  const sensorData = await response.json();

  return sensorData.data;
};

export const getLatestSensorData = async () => {
  const url = '/sensor/latest';

  const response = await fetch(url);
  const sensorData = await response.json();

  return sensorData.data;
};
