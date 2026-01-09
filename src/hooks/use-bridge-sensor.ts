import { useState, useCallback } from "react";

export const useBridgeSensor = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startMonitoring = useCallback(async () => {
    // Check for iOS 13+ permission requirements
    if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceMotionEvent as any).requestPermission();
        if (permission === 'granted') {
          setIsMonitoring(true);
        } else {
          setError("Permission to access motion sensors was denied.");
        }
      } catch (err) {
        setError("Mobile sensor access failed. Ensure you are using HTTPS.");
      }
    } else {
      // Non-iOS or older devices usually don't need explicit permission
      setIsMonitoring(true);
    }
  }, []);

  const stopMonitoring = () => setIsMonitoring(false);

  return { isMonitoring, startMonitoring, stopMonitoring, error };
};