import mqtt from 'mqtt';
import { useEffect } from 'react';
import type { SensorData } from '../interfaces/sensor-data';

export function useMQTT(onMessage: (data: SensorData) => void) {
  useEffect(() => {
    const client = mqtt.connect('ws://broker.emqx.io:8083/mqtt');

    client.on('connect', () => {
      console.log('Connected to broker');
      client.subscribe('lnu/iot/ae225aw/sensor');
    });

    client.on('message', (topic, message) => {
      try {
        const data = JSON.parse(message.toString());
        onMessage({ ...data, createdAt: new Date().toISOString() });
      } catch (error) {
        console.error('Invalid message', error);
      }
    });

    return () => {
      client.end();
    };
  }, []);
}
