import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Cell } from "recharts";
import { Waves } from "lucide-react";

const generateFFTData = () => {
  return Array.from({ length: 32 }, (_, i) => {
    const freq = (i + 1) * 2;
    // Simulate FFT with peaks at natural frequencies
    let magnitude = Math.random() * 10;
    
    // Add peaks at typical bridge natural frequencies
    if (freq === 6) magnitude += 60 + Math.random() * 10;  // First mode
    if (freq === 14) magnitude += 35 + Math.random() * 8; // Second mode
    if (freq === 28) magnitude += 20 + Math.random() * 5; // Third mode
    
    return {
      frequency: freq,
      magnitude: Math.max(5, magnitude),
      isPeak: freq === 6 || freq === 14 || freq === 28,
    };
  });
};

export function FFTSpectrum() {
  const [data, setData] = useState(generateFFTData());

  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateFFTData());
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const dominantFreq = data.reduce((max, d) => d.magnitude > max.magnitude ? d : max, data[0]);

  return (
    <div className="glass-panel p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-blue/10">
            <Waves className="h-5 w-5 text-chart-blue" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">FFT Frequency Spectrum</h3>
            <p className="text-sm text-muted-foreground">Natural frequency detection</p>
          </div>
        </div>
        <div className="rounded-lg bg-primary/10 px-3 py-1.5">
          <p className="text-xs text-muted-foreground">Dominant Frequency</p>
          <p className="font-mono text-lg font-bold text-primary">{dominantFreq.frequency} Hz</p>
        </div>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <XAxis 
              dataKey="frequency" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10 }}
              tickFormatter={(v) => `${v}`}
            />
            <YAxis hide domain={[0, 80]} />
            <Bar dataKey="magnitude" radius={[2, 2, 0, 0]}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`}
                  fill={entry.isPeak ? 'hsl(187, 92%, 50%)' : 'hsl(217, 91%, 60%)'}
                  fillOpacity={entry.isPeak ? 1 : 0.4}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <div className="flex gap-6">
          <div>
            <p className="text-xs text-muted-foreground">Mode 1</p>
            <p className="font-mono font-semibold text-chart-cyan">6.2 Hz</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Mode 2</p>
            <p className="font-mono font-semibold text-chart-blue">14.1 Hz</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Mode 3</p>
            <p className="font-mono font-semibold text-chart-emerald">28.3 Hz</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Spectral Energy</p>
          <p className="font-mono text-lg font-semibold text-foreground">847.2 <span className="text-xs text-muted-foreground">J/Hz</span></p>
        </div>
      </div>
    </div>
  );
}
