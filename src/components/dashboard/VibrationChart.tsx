import { useEffect, useState, useRef } from "react";
import { Area, AreaChart, ResponsiveContainer, YAxis, CartesianGrid } from "recharts";
import { Activity, Cpu, ShieldCheck, ShieldAlert } from "lucide-react";

export function VibrationChart({ isLive }: { isLive: boolean }) {
  const [data, setData] = useState<{t: number, v: number}[]>([]);
  const [backendStatus, setBackendStatus] = useState<'online' | 'offline'>('offline');
  const buffer = useRef<number[]>([]);

  useEffect(() => {
    if (!isLive) return;

    const handleMotion = (event: DeviceMotionEvent) => {
      // Prioritize acceleration without gravity for clean signal analysis
      const acc = event.acceleration?.z || event.accelerationIncludingGravity?.z || 0;
      
      buffer.current.push(acc);
      if (buffer.current.length > 50) buffer.current.shift();

      setData(buffer.current.map((v, i) => ({ t: i, v: v * 10 })));
    };

    window.addEventListener("devicemotion", handleMotion);
    
    // Attempt to sync with your Python Math Model every second
    const sync = setInterval(async () => {
      if (buffer.current.length > 0) {
        try {
          const res = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ values: buffer.current })
          });
          if (res.ok) setBackendStatus('online');
        } catch (e) {
          setBackendStatus('offline');
        }
      }
    }, 1000);

    return () => {
      window.removeEventListener("devicemotion", handleMotion);
      clearInterval(sync);
    };
  }, [isLive]);

  return (
    <div className="glass-panel p-8 rounded-2xl border border-white/10 shadow-2xl">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Activity className={`h-6 w-6 ${isLive ? "text-primary animate-pulse" : "text-muted-foreground"}`} />
          <h3 className="text-xl font-bold uppercase tracking-tight">Accelerometer Z-Axis</h3>
        </div>
        <div className="flex items-center gap-2">
          {backendStatus === 'online' ? (
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
              <ShieldCheck className="h-3 w-3" /> MATH MODEL ACTIVE
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground bg-secondary px-2 py-1 rounded">
              <ShieldAlert className="h-3 w-3" /> MODEL DISCONNECTED
            </span>
          )}
          <div className="flex items-center gap-2 text-[10px] font-mono bg-secondary px-3 py-1 rounded text-muted-foreground uppercase">
            <Cpu className="h-3 w-3" />
            <span>Buff: {buffer.current.length}/50</span>
          </div>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <YAxis domain={[-25, 25]} hide />
            <Area 
              type="monotone" 
              dataKey="v" 
              stroke="hsl(187, 92%, 50%)" 
              strokeWidth={3}
              fill="hsl(187, 92%, 50%)" 
              fillOpacity={0.15} 
              isAnimationActive={false} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}