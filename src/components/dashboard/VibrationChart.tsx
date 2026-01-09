import { useEffect, useState, useRef } from "react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Activity } from "lucide-react";

export function VibrationChart({ isLive }: { isLive: boolean }) {
  const [data, setData] = useState<{time: number, amplitude: number}[]>([]);
  const buffer = useRef<number[]>([]);

  useEffect(() => {
    if (!isLive) {
      setData([]); // Clear data when not monitoring
      return;
    }

    const handleMotion = (event: DeviceMotionEvent) => {
      // Use linear acceleration (ignores gravity) if available, otherwise fallback
      const acc = event.acceleration || event.accelerationIncludingGravity;
      const val = acc?.z || 0;
      
      buffer.current.push(val);
      if (buffer.current.length > 40) buffer.current.shift();

      setData(buffer.current.map((v, i) => ({ time: i, amplitude: v * 10 })));
    };

    window.addEventListener("devicemotion", handleMotion);
    
    const interval = setInterval(async () => {
      if (buffer.current.length > 0) {
        try {
          await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ values: buffer.current })
          });
        } catch (e) {
          console.warn("Backend connection failed - Math Modelling unavailable");
        }
      }
    }, 1000);

    return () => {
      window.removeEventListener("devicemotion", handleMotion);
      clearInterval(interval);
    };
  }, [isLive]);

  return (
    <div className="glass-panel p-6">
      <div className="mb-4 flex items-center gap-3">
        <Activity className={`h-5 w-5 ${isLive ? "text-primary" : "text-muted-foreground"}`} />
        <h3 className="font-semibold text-foreground">Tri-axial Stream</h3>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <YAxis domain={[-15, 15]} hide />
            <Area 
              type="step" 
              dataKey="amplitude" 
              stroke="hsl(187, 92%, 50%)" 
              fill="hsl(187, 92%, 50%)" 
              fillOpacity={0.1} 
              isAnimationActive={false} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}