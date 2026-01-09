import { useEffect, useState, useRef } from "react";
import { Area, AreaChart, ResponsiveContainer, YAxis, CartesianGrid } from "recharts";
import { Activity, ShieldCheck, ShieldAlert, Zap, Cpu } from "lucide-react";

// The 'export' here matches the 'import { VibrationChart }' in your Index.tsx
export function VibrationChart({ isLive, isBaselineMode, onScoreUpdate }: any) {
  const [data, setData] = useState<{t: number, v: number}[]>([]);
  const [metrics, setMetrics] = useState({ score: 100, currentHz: 0, baselineHz: 0 });
  const [backendStatus, setBackendStatus] = useState<'online' | 'offline'>('offline');
  const buffer = useRef<number[]>([]);

  useEffect(() => {
    if (!isLive) return;

    // 1. Capture Hardware Motion
    const handleMotion = (event: DeviceMotionEvent) => {
      // Prioritize Z-axis (vertical) for bridge bounce
      const acc = event.acceleration?.z || event.accelerationIncludingGravity?.z || 0;
      
      buffer.current.push(acc);
      
      // Maintain a 60-sample window (approx 1 second of data)
      if (buffer.current.length > 60) buffer.current.shift();

      // Update the visual chart (scaled for visibility)
      setData(buffer.current.map((v, i) => ({ t: i, v: v * 10 })));
    };

    window.addEventListener("devicemotion", handleMotion);

    // 2. Sync with Python Math Model
    const sync = setInterval(async () => {
      if (buffer.current.length > 10) {
        try {
          const res = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              values: buffer.current,
              is_baseline: isBaselineMode 
            })
          });
          
          if (!res.ok) throw new Error("Backend Error");
          
          const result = await res.json();
          setBackendStatus('online');
          
          // Update the SHM Metrics
          setMetrics({
            score: result.integrity_score ?? 100,
            currentHz: result.current_hz ?? 0,
            baselineHz: result.baseline_hz ?? metrics.baselineHz
          });

          if (onScoreUpdate) onScoreUpdate(result.integrity_score);
        } catch (e) {
          setBackendStatus('offline');
          console.error("SHM Sync Failed. Is Python running on port 8000?");
        }
      }
    }, 1000); // Send data to Python every 1 second

    return () => {
      window.removeEventListener("devicemotion", handleMotion);
      clearInterval(sync);
    };
  }, [isLive, isBaselineMode, metrics.baselineHz, onScoreUpdate]);

  return (
    <div className="space-y-6">
      {/* SHM Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-4 flex flex-col items-center justify-center border-b-4 border-primary">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Integrity Score</span>
          <span className={`text-4xl font-black ${metrics.score < 85 ? 'text-destructive' : 'text-primary'}`}>
            {Math.round(metrics.score)}%
          </span>
        </div>
        
        <div className="glass-panel p-4 flex flex-col items-center justify-center">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Resonance (Hz)</span>
          <span className="text-2xl font-bold">{metrics.currentHz.toFixed(1)}</span>
        </div>

        <div className="glass-panel p-4 flex flex-col items-center justify-center relative overflow-hidden">
          <div className={`absolute top-0 right-0 p-1 ${metrics.baselineHz > 0 ? 'text-emerald-500' : 'text-muted-foreground'}`}>
            <ShieldCheck className="h-4 w-4" />
          </div>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Golden Baseline</span>
          <span className="text-2xl font-bold text-emerald-500">
            {metrics.baselineHz > 0 ? `${metrics.baselineHz.toFixed(1)} Hz` : "---"}
          </span>
        </div>
      </div>

      {/* Main Waveform Chart */}
      <div className="glass-panel p-6 h-80 relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <h3 className="font-bold uppercase text-xs tracking-tighter">Live Structural Waveform</h3>
          </div>
          
          <div className="flex items-center gap-4">
            {isBaselineMode && (
              <div className="flex items-center gap-2 px-2 py-1 bg-primary/20 rounded border border-primary/30">
                <div className="h-2 w-2 bg-primary rounded-full animate-ping" />
                <span className="text-[10px] font-bold text-primary uppercase">Calibrating</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
              <Cpu className="h-3 w-3" />
              {backendStatus === 'online' ? 'MODEL SYNCED' : 'OFFLINE'}
            </div>
          </div>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <YAxis domain={[-15, 15]} hide />
              <Area 
                type="monotone" 
                dataKey="v" 
                stroke="hsl(187, 92%, 50%)" 
                strokeWidth={3}
                fill="url(#colorVibe)" 
                isAnimationActive={false} 
              />
              <defs>
                <linearGradient id="colorVibe" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(187, 92%, 50%)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(187, 92%, 50%)" stopOpacity={0}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}