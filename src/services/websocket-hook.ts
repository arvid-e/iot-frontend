import mqtt from 'mqtt';
import { useEffect, useState } from 'react';

interface SensorData {
  temperature: number;
  humidity: number;
  timestamp: number;
}

export function useMQTT() {
  const [sensorData, setSensorData] = useState<SensorData | null>(null);

  useEffect(() => {
    const client = mqtt.connect('ws://broker.emqx.io:8083/mqtt');

    client.on('connect', () => {
      console.log('Connected to broker');
      client.subscribe('lnu/iot/ae225aw/sensor');
    });

    client.on('message', (topic, message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log(data);
        setSensorData(data);
      } catch (error) {
        console.error('Invalid message', error);
      }
    });

    return () => {
      client.end();
    };
  }, []);

  return { sensorData };
}
