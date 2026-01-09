import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { VibrationChart } from "@/components/dashboard/VibrationChart";
import { useBridgeSensor } from "@/hooks/use-bridge-sensor";
import { Button } from "@/components/ui/button";
import { Activity, Target, PlayCircle, RotateCcw, ClipboardList } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface IntegrityRecord {
  id: number;
  score: number;
  hz: number;
  timestamp: string;
}

const Index = () => {
  const { isMonitoring, startMonitoring, buffer } = useBridgeSensor();
  const [phase, setPhase] = useState<'idle' | 'baselining' | 'tracking'>('idle');
  const [baselineHz, setBaselineHz] = useState<number>(0);
  const [records, setRecords] = useState<IntegrityRecord[]>([]);

  // Function to handle both Baseline and Live Tracking
  const runCapture = async (isBaseline: boolean) => {
    setPhase(isBaseline ? 'baselining' : 'tracking');
    
    // Capture for 5 seconds
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
          setBaselineHz(data.baseline_hz);
          setRecords([]); // Clear old records when a new baseline is set
        } else {
          const newRecord: IntegrityRecord = {
            id: records.length + 1,
            score: data.integrity_score,
            hz: data.current_hz,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
          };
          // Keep only the last 3 records
          setRecords(prev => [newRecord, ...prev].slice(0, 3));
        }
      } catch (e) {
        console.error("Sync failed");
      }
      setPhase('idle');
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <div className="hidden md:block w-64 fixed inset-y-0 border-r border-border bg-sidebar">
        <Sidebar />
      </div>

      <main className="flex-1 md:ml-64 min-h-screen w-full">
        <Header />
        
        <div className="p-4 md:p-6 space-y-6 max-w-6xl mx-auto">
          {/* Main Controls Card */}
          <div className="bg-card p-6 rounded-2xl border border-border shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold">Structural Health Analysis</h1>
                <p className="text-muted-foreground text-sm">
                  {baselineHz > 0 ? `Baseline Locked: ${baselineHz} Hz` : "Awaiting Golden Baseline..."}
                </p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                {!isMonitoring ? (
                  <Button onClick={startMonitoring} className="w-full">Initialize Sensors</Button>
                ) : (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={() => runCapture(true)} 
                      disabled={phase !== 'idle'}
                      className="flex-1"
                    >
                      <Target className={`mr-2 h-4 w-4 ${phase === 'baselining' ? 'animate-spin' : ''}`} />
                      Set Baseline
                    </Button>
                    <Button 
                      variant="default" 
                      onClick={() => runCapture(false)} 
                      disabled={phase !== 'idle' || baselineHz === 0 || records.length >= 3}
                      className="flex-1"
                    >
                      <PlayCircle className={`mr-2 h-4 w-4 ${phase === 'tracking' ? 'animate-pulse' : ''}`} />
                      Track Live
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Progress/Phase Overlay */}
            {phase !== 'idle' && (
              <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full animate-progress-grow" />
              </div>
            )}
          </div>

          {/* Records Grid: Shows 3 Sets of Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => {
              const record = records[i];
              return (
                <div key={i} className={`glass-panel p-6 rounded-xl border-2 transition-all ${record ? 'border-primary/50' : 'border-dashed border-muted opacity-50'}`}>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold uppercase text-muted-foreground italic">Set {3 - i}</span>
                    {record && <span className="text-[10px] font-mono">{record.timestamp}</span>}
                  </div>
                  {record ? (
                    <div className="space-y-2 text-center">
                      <div className="text-4xl font-black text-primary">{Math.round(record.score)}%</div>
                      <div className="text-sm font-medium">{record.hz} Hz</div>
                      <div className={`text-[10px] font-bold uppercase px-2 py-1 rounded inline-block ${record.score < 90 ? 'bg-destructive/10 text-destructive' : 'bg-emerald-500/10 text-emerald-500'}`}>
                        {record.score < 90 ? 'Stiffness Loss' : 'Healthy'}
                      </div>
                    </div>
                  ) : (
                    <div className="h-24 flex items-center justify-center text-muted-foreground text-xs text-center px-4">
                      {baselineHz === 0 ? "Set baseline first" : `Ready for Track ${3-i}`}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Reset Button */}
          {records.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => setRecords([])} className="text-muted-foreground hover:text-destructive">
              <RotateCcw className="mr-2 h-3 w-3" /> Clear Sets
            </Button>
          )}

          <VibrationChart isLive={isMonitoring} />
        </div>
      </main>
    </div>
  );
};

export default Index;