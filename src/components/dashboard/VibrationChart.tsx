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

    // This listener is purely for the visual UI (the smooth wavy line)
    const handleVisualMotion = (event: DeviceMotionEvent) => {
      const val = event.acceleration?.z || event.accelerationIncludingGravity?.z || 0;
      
      setDisplayData((prev) => {
        // Maintain a small, fast-moving window for the visual chart (50 points)
        const newData = [...prev, { t: Date.now(), v: val }];
        if (newData.length > 50) return newData.slice(1);
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
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-tighter">
              Sensors Offline
            </p>
          </div>
        )}
        
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={displayData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke="rgba(255,255,255,0.05)" 
            />
            <YAxis domain={[-10, 10]} hide />
            <Area
              type="monotone"
              dataKey="v"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#chartGradient)"
              isAnimationActive={false} // Setting to false prevents the "jumping" lag on mobile
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-between items-center px-1">
        <span className="text-[10px] font-mono text-muted-foreground">AXIS: VERTICAL (Z)</span>
        <span className="text-[10px] font-mono text-muted-foreground">SAMPLE RATE: ~60HZ</span>
      </div>
    </div>
  );
}