import mqtt from 'mqtt';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { SensorData } from '../interfaces/sensor-data';

export function useMQTT(onMessage: (data: SensorData) => void) {
  const [isConnected, setIsConnected] = useState(false);
  const clientRef = useRef<mqtt.MqttClient | null>(null);
  const STUDENT_ID = 'ae225aw';

  useEffect(() => {
    const brokerUrl = import.meta.env.VITE_MQTT_BROKER_URL;

    const client = mqtt.connect(brokerUrl, {
      username: import.meta.env.VITE_MQTT_USERNAME,
      password: import.meta.env.VITE_MQTT_PASSWORD,
      rejectUnauthorized: false,
    });
    clientRef.current = client;

    client.on('connect', () => {
      console.log('Connected to MQTT Broker');
      setIsConnected(true);
      client.subscribe(`lnu/iot/${STUDENT_ID}/sensor`);
    });

    client.on('close', () => {
      console.log('MQTT connection closed');
      setIsConnected(false);
    });
    client.on('error', (err) => {
      console.log('MQTT error:', err);
      setIsConnected(false);
    });

    client.on('offline', () => {
      console.log('MQTT offline');
    });

    client.on('reconnect', () => {
      console.log('MQTT reconnecting');
    });

    client.on('message', (topic, message) => {
      if (topic.endsWith('/sensor')) {
        try {
          const data = JSON.parse(message.toString());
          onMessage({ ...data, createdAt: new Date().toISOString() });
        } catch (e) {
          console.error(e);
        }
      }
    });

    return () => {
      client.end();
    };
  }, [onMessage]);

  const publishLED = useCallback((state: boolean) => {
    const client = clientRef.current;
    if (client?.connected) {
      const topic = `lnu/iot/${STUDENT_ID}/command/led`;
      const payload = JSON.stringify({ state: state });

      client.publish(topic, payload);
      console.log('Sent to Python:', payload);
    }
  }, []);

  return { publishLED, isConnected };
}
