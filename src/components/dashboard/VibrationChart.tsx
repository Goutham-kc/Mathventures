import { useEffect, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Activity } from "lucide-react";

const generateVibrationData = (offset: number = 0) => {
  return Array.from({ length: 100 }, (_, i) => {
    const t = (i + offset) / 10;
    // Simulate realistic bridge vibration with multiple frequency components
    const value = 
      Math.sin(t * 2) * 0.3 +  // Low frequency (structural mode)
      Math.sin(t * 5) * 0.15 + // Medium frequency
      Math.sin(t * 12) * 0.08 + // High frequency
      (Math.random() - 0.5) * 0.1; // Noise
    return {
      time: i,
      amplitude: value * 100,
    };
  });
};

export function VibrationChart() {
  const [data, setData] = useState(generateVibrationData());
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prev) => prev + 5);
      setData(generateVibrationData(offset));
    }, 100);
    return () => clearInterval(interval);
  }, [offset]);

  return (
    <div className="glass-panel p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Real-Time Vibration</h3>
            <p className="text-sm text-muted-foreground">Tri-axial accelerometer stream</p>
          </div>
        </div>
        <div className="flex items-center gap-4 font-mono text-sm">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-chart-cyan" />
            <span className="text-muted-foreground">X-axis</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-chart-blue" />
            <span className="text-muted-foreground">Y-axis</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-chart-emerald" />
            <span className="text-muted-foreground">Z-axis</span>
          </div>
        </div>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="vibrationGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(187, 92%, 50%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(187, 92%, 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" hide />
            <YAxis domain={[-50, 50]} hide />
            <Area
              type="monotone"
              dataKey="amplitude"
              stroke="hsl(187, 92%, 50%)"
              strokeWidth={2}
              fill="url(#vibrationGradient)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-4 border-t border-border pt-4">
        <div>
          <p className="text-xs text-muted-foreground">Peak Amplitude</p>
          <p className="font-mono text-lg font-semibold text-foreground">32.4 <span className="text-xs text-muted-foreground">mg</span></p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Sample Rate</p>
          <p className="font-mono text-lg font-semibold text-foreground">100 <span className="text-xs text-muted-foreground">Hz</span></p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Active Sensors</p>
          <p className="font-mono text-lg font-semibold text-foreground">24 <span className="text-xs text-muted-foreground">units</span></p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Latency</p>
          <p className="font-mono text-lg font-semibold text-success">12 <span className="text-xs text-muted-foreground">ms</span></p>
        </div>
      </div>
    </div>
  );
}
