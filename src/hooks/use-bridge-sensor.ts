import { useState, useCallback } from "react";

export const useBridgeSensor = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startMonitoring = useCallback(async () => {
    // 1. Check if the browser even supports Motion events
    if (!window.DeviceMotionEvent) {
      setError("This device or browser does not support motion sensors.");
      return;
    }

    // 2. iOS 13+ requires explicit permission request via user gesture
    if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceMotionEvent as any).requestPermission();
        if (permission === 'granted') {
          setIsMonitoring(true);
        } else {
          setError("Sensor permission denied by user.");
        }
      } catch (err) {
        setError("Please use HTTPS to access mobile sensors.");
      }
    } else {
      // 3. Android/Desktop usually don't need explicit permission, or handle it differently
      setIsMonitoring(true);
      // Brief check to see if we actually get data
      window.addEventListener('devicemotion', () => {}, { once: true });
    }
  }, []);

  return { isMonitoring, startMonitoring, error };
};