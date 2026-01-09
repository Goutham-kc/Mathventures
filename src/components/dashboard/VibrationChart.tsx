import { useEffect, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, YAxis, CartesianGrid } from "recharts";

interface VibrationChartProps {
  isLive: boolean;
}

export function VibrationChart({ isLive }: VibrationChartProps) {
  const [displayData, setDisplayData] = useState<{ t: number; v: number }[]>([]);

  useEffect(() => {
    if (!isLive) {
      setDisplayData([]);
      return;
    }

    // SMOOTHING FACTOR: 0.1 is very smooth, 0.9 is very jumpy
    const smoothing = 0.2; 
    let lastValue = 0;

    const handleVisualMotion = (event: DeviceMotionEvent) => {
      // 1. Get raw Z-axis data
      // We prioritize 'acceleration' because it has gravity (9.8m/s^2) removed
      let rawVal = event.acceleration?.z || 0;

      // 2. Fallback to gravity-included data if pure acceleration is null
      if (event.acceleration?.z === null && event.accelerationIncludingGravity?.z !== null) {
        rawVal = event.accelerationIncludingGravity.z - 9.81;
      }

      // 3. APPLY LOW-PASS FILTER (The Fix for the "exponential" jumps)
      // Instead of jumping to the new value, we glide toward it
      const smoothedVal = (lastValue * (1 - smoothing)) + (rawVal * smoothing);
      lastValue = smoothedVal;

      setDisplayData((prev) => {
        // Keep only the last 60 points for a smooth, fast moving window
        const newData = [...prev, { t: Date.now(), v: Number(smoothedVal.toFixed(4)) }];
        if (newData.length > 60) return newData.slice(1);
        return newData;
      });
    };

    window.addEventListener("devicemotion", handleVisualMotion);

    return () => {
      window.removeEventListener("devicemotion", handleVisualMotion);
    };
  }, [isLive]);

  return (
    <div className="w-full space-y-2">
      <div className="h-[250px] w-full bg-card/30 rounded-xl border border-border/50 overflow-hidden relative">
        {!isLive && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10 backdrop-blur-[2px]">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              Sensors Standby
            </p>
          </div>
        )}
        
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={displayData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke="rgba(255,255,255,0.05)" 
            />
            {/* FIXED Y-AXIS: This stops the chart from expanding exponentially */}
            <YAxis 
              domain={[-12, 12]} 
              allowDataOverflow={true} 
              hide 
            />
            <Area
              type="monotone"
              dataKey="v"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#chartGradient)"
              isAnimationActive={false} // CRITICAL: Setting this to false prevents lag on mobile
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-between items-center px-2">
        <span className="text-[9px] font-mono text-muted-foreground uppercase">Axis: Vertical (Z)</span>
        <div className="flex gap-2">
           <span className="text-[9px] font-mono text-muted-foreground uppercase">Fixed Scale: ±12m/s²</span>
           <span className="text-[9px] font-mono text-emerald-500 uppercase font-bold">Smoothed Feed</span>
        </div>
      </div>
    </div>
  );
}