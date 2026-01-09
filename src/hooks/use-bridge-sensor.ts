import { useState, useCallback, useRef } from "react";

export const useBridgeSensor = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // This buffer is critical: it collects the raw Z-axis data
  // which is then sent to Python for the FFT math.
  const buffer = useRef<number[]>([]);

  const startMonitoring = useCallback(async () => {
    // Check for sensor availability
    if (typeof window === "undefined" || !window.DeviceMotionEvent) {
      setError("DeviceMotion is not supported on this browser/device.");
      return;
    }

    try {
      // iOS 13+ Permission Handshake
      if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
        const response = await (DeviceMotionEvent as any).requestPermission();
        if (response !== 'granted') {
          setError("Permission to access sensors was denied.");
          return;
        }
      }

      // Start the event listener
      window.addEventListener("devicemotion", (event) => {
        // We use 'acceleration' (excluding gravity) if available, otherwise fallback
        const accel = event.acceleration?.z || event.accelerationIncludingGravity?.z || 0;
        
        buffer.current.push(accel);
        
        // Keep a rolling window of 300 samples (approx 5 seconds at 60Hz)
        // This ensures the buffer is always ready for a "Track Set" call
        if (buffer.current.length > 300) {
          buffer.current.shift();
        }
      });

      setIsMonitoring(true);
      setError(null);
    } catch (err) {
      console.error("Sensor Error:", err);
      setError("Could not initialize sensors. Ensure you are on HTTPS.");
    }
  }, []);

  return { isMonitoring, startMonitoring, buffer, error };
};