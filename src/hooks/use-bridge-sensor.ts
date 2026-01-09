import { useState, useCallback } from "react";

export const useBridgeSensor = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startMonitoring = useCallback(async () => {
    // 1. Feature Detection
    if (!window.DeviceMotionEvent) {
      setError("This device browser doesn't support motion sensors.");
      return;
    }

    try {
      // 2. iOS 13+ Permissions Handshake
      if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
        const permission = await (DeviceMotionEvent as any).requestPermission();
        if (permission === 'granted') {
          setIsMonitoring(true);
          setError(null);
        } else {
          setError("Permission denied. Enable motion in settings.");
        }
      } else {
        // 3. Android or Desktop Chrome
        setIsMonitoring(true);
        setError(null);
      }
    } catch (err) {
      setError("HTTPS required! Use your ngrok link.");
    }
  }, []);

  return { isMonitoring, startMonitoring, error };
};