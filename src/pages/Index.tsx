import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { VibrationChart } from "@/components/dashboard/VibrationChart";
import { useBridgeSensor } from "@/hooks/use-bridge-sensor";
import { Button } from "@/components/ui/button";
import { Activity, Target, PlayCircle, RotateCcw } from "lucide-react";
import { useState } from "react";

interface IntegrityRecord {
  score: number;
  hz: number;
  label: string;
}

const Index = () => {
  // Use the buffer from the hook
  const { isMonitoring, startMonitoring, buffer } = useBridgeSensor();
  
  const [phase, setPhase] = useState<'idle' | 'recording'>('idle');
  const [baselineHz, setBaselineHz] = useState<number | null>(null);
  const [records, setRecords] = useState<IntegrityRecord[]>([]);

  const runTest = async (isBaseline: boolean) => {
    if (!isMonitoring) return alert("Please start sensors first!");
    
    setPhase('recording');
    
    // Step 1: Wait 5 seconds to collect a stable sample window
    setTimeout(async () => {
      try {
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            values: buffer.current, 
            is_baseline: isBaseline 
          })
        });
        
        const data = await res.json();

        if (isBaseline) {
          // Permanently lock the baseline
          setBaselineHz(data.baseline_hz);
          setRecords([]); // Reset sets when new baseline is made
          console.log("Baseline Locked at:", data.baseline_hz);
        } else {
          // Add to the 3-set collection
          const newRecord = {
            score: data.integrity_score,
            hz: data.current_hz,
            label: `Test Set ${records.length + 1}`
          };
          
          setRecords(prev => {
            if (prev.length >= 3) return prev; // Limit to 3
            return [...prev, newRecord];
          });
        }
      } catch (e) {
        console.error("Connection to Python failed.");
      }
      setPhase('idle');
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-6 space-y-6">
        <Header />

        <div className="bg-card p-6 rounded-2xl border border-border shadow-md">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Structural System ID</h1>
              <p className="text-muted-foreground text-sm">
                {baselineHz ? `Anchor Frequency: ${baselineHz} Hz` : "Status: Awaiting Calibration"}
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => runTest(true)} 
                disabled={phase !== 'idle' || !isMonitoring}
              >
                <Target className={`mr-2 h-4 w-4 ${phase === 'recording' ? 'animate-spin' : ''}`} />
                {phase === 'recording' ? "Sampling..." : "Set Baseline"}
              </Button>

              <Button 
                variant="default" 
                onClick={() => runTest(false)} 
                disabled={phase !== 'idle' || !baselineHz || records.length >= 3}
              >
                <PlayCircle className="mr-2 h-4 w-4" />
                Track Live Set ({records.length}/3)
              </Button>
            </div>
          </div>
        </div>

        {/* 3 SET DISPLAY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`p-6 rounded-xl border-2 transition-all ${records[i] ? 'bg-card border-primary' : 'bg-muted/20 border-dashed border-muted'}`}>
              <p className="text-[10px] font-bold uppercase text-muted-foreground mb-4">Observation {i + 1}</p>
              {records[i] ? (
                <div className="text-center space-y-1">
                  <div className="text-5xl font-black text-primary">{Math.round(records[i].score)}%</div>
                  <div className="text-sm font-medium">{records[i].hz} Hz</div>
                </div>
              ) : (
                <div className="h-16 flex items-center justify-center text-muted-foreground text-xs italic">
                  {baselineHz ? "Ready to record" : "Waiting for baseline"}
                </div>
              )}
            </div>
          ))}
        </div>

        {records.length > 0 && (
          <Button variant="ghost" size="sm" onClick={() => setRecords([])} className="text-muted-foreground">
            <RotateCcw className="mr-2 h-3 w-3" /> Reset All Sets
          </Button>
        )}

        <VibrationChart isLive={isMonitoring} />
      </main>
    </div>
  );
};

export default Index;