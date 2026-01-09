// Proposed hardware sensor hook
import { useState, useEffect } from 'react';

export const useBridgeSensor = () => {
  const [acceleration, setAcceleration] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    const handleMotion = (event: DeviceMotionEvent) => {
      const acc = event.accelerationIncludingGravity;
      if (acc) {
        setAcceleration({
          x: acc.x || 0,
          y: acc.y || 0,
          z: acc.z || 0
        });
      }
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, []);

  return acceleration;
};