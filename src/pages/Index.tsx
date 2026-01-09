import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { VibrationChart } from "@/components/dashboard/VibrationChart";
import { useBridgeSensor } from "@/hooks/use-bridge-sensor";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Target,
  PlayCircle,
  RotateCcw,
  ShieldCheck,
  Zap,
  Info
} from "lucide-react";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface IntegrityRecord {
  score: number;
  hz: number;
  errorMargin: number; // Added for CRLB
  confidence: string;  // Added for CRLB
  time: string;
}

const Index = () => {
  const { isMonitoring, startMonitoring, buffer, error: sensorError } =
    useBridgeSensor();

  // SHM workflow state
  const [phase, setPhase] = useState<"idle" | "sampling">("idle");
  const [baselineHz, setBaselineHz] = useState<number | null>(null);
  const [records, setRecords] = useState<IntegrityRecord[]>([]);

  const handleAnalysis = async (isBaseline: boolean) => {
    if (!isMonitoring || phase !== "idle") return;

    setPhase("sampling");

    // Fixed 5-second sampling window
    setTimeout(async () => {
      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            values: buffer.current,
            is_baseline: isBaseline
          })
        });

        const data = await response.json();
        console.log("Backend response:", data);

        /* ===============================
           BASELINE LOGIC
        =============================== */
        if (isBaseline) {
          if (typeof data.hz === "number") {
            setBaselineHz(Number(data.hz.toFixed(2)));
            setRecords([]); 
          }
        }

        /* ===============================
           TRACKING LOGIC (WITH CRLB)
        =============================== */
        else {
          const newEntry: IntegrityRecord = {
            score: data.integrity_score,
            hz: data.current_hz,
            errorMargin: data.error_margin_hz, // From Python calculate_crlb
            confidence: data.confidence,       // From Python
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit"
            })
          };

          setRecords((prev) => [newEntry, ...prev].slice(0, 3));
        }
      } catch (err) {
        console.error("Backend communication failed:", err);
      }

      setPhase("idle");
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      {/* Sidebar */}
      <div className="hidden md:block w-64 fixed inset-y-0 z-50 border-r border-border bg-card">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <Header />

        <div className="p-6 max-w-6xl mx-auto space-y-6 w-full">
          {/* Header Action Card */}
          <div className="bg-card p-6 rounded-2xl border border-border shadow-md flex flex-col lg:flex-row justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">
                Structural Integrity Lab
              </h1>
              <div className="flex items-center gap-2 mt-2 bg-secondary/30 px-3 py-1.5 rounded-lg border border-border/50 w-fit">
                <ShieldCheck
                  className={`h-4 w-4 ${
                    baselineHz ? "text-emerald-500" : "text-muted-foreground"
                  }`}
                />
                <span className="text-sm font-mono font-bold uppercase">
                  Ref Frequency: {baselineHz ? `${baselineHz} Hz` : "Awaiting Baseline"}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-3 w-full lg:w-auto">
              {!isMonitoring ? (
                <Button onClick={startMonitoring} className="w-full lg:w-auto shadow-lg shadow-primary/20">
                  <Zap className="mr-2 h-4 w-4" />
                  Initialize Sensors
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    disabled={phase !== "idle"}
                    onClick={() => handleAnalysis(true)}
                  >
                    <Target className={`mr-2 h-4 w-4 ${phase === "sampling" && !baselineHz ? "animate-spin" : ""}`} />
                    {phase === "sampling" && !baselineHz ? "Sampling..." : "Set Baseline"}
                  </Button>

                  <Button
                    disabled={phase !== "idle" || !baselineHz || records.length >= 3}
                    onClick={() => handleAnalysis(false)}
                  >
                    <PlayCircle className={`mr-2 h-4 w-4 ${phase === "sampling" && baselineHz ? "animate-pulse" : ""}`} />
                    {phase === "sampling" && baselineHz ? "Analyzing..." : `Track Set ${records.length + 1}`}
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* CRB Explanation Banner */}
          <div className="bg-blue-500/5 border border-blue-500/20 p-4 rounded-xl flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-500 mt-0.5" />
            <div className="text-xs text-muted-foreground leading-relaxed">
              <b className="text-blue-500 uppercase">Cramér-Rao Lower Bound (CRLB):</b> Our system calculates the theoretical minimum variance of frequency estimation based on the Signal-to-Noise Ratio (SNR). This ensures scientific validation of structural shifts.
            </div>
          </div>

          {/* 3-Set Display with CRB Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => {
              const record = records[i];
              return (
                <div
                  key={i}
                  className={`relative p-6 rounded-2xl border-2 transition-all duration-500 ${
                    record
                      ? "bg-card border-primary shadow-lg ring-1 ring-primary/10"
                      : "bg-muted/5 border-dashed border-muted opacity-50"
                  }`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                      Set 0{i + 1}
                    </span>
                    {record && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${
                        record.confidence === 'High' 
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                        : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                      }`}>
                        {record.confidence} Quality
                      </span>
                    )}
                  </div>

                  {record ? (
                    <div className="text-center space-y-2">
                      <div className={`text-5xl font-black tracking-tighter ${record.score < 80 ? "text-destructive" : "text-primary"}`}>
                        {Math.round(record.score)}%
                      </div>
                      <div className="text-sm font-bold flex flex-col gap-0.5">
                        <span>{record.hz} Hz</span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          CRLB Error: ±{record.errorMargin}
                        </span>
                      </div>
                      <div className="text-[10px] text-muted-foreground pt-2 border-t border-border/50">
                        {record.time}
                      </div>
                    </div>
                  ) : (
                    <div className="h-28 flex flex-col items-center justify-center text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">
                      <div className="w-6 h-6 rounded-full border border-dashed border-muted mb-2" />
                      Pending Data
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Visualization */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 text-muted-foreground">
                <Activity className="h-4 w-4 text-primary" />
                Live Spectral Waveform
              </h3>
              {records.length > 0 && (
                <Button variant="ghost" size="sm" className="text-[10px] h-7 text-muted-foreground" onClick={() => setRecords([])}>
                  <RotateCcw className="mr-1 h-3 w-3" />
                  Reset Observations
                </Button>
              )}
            </div>
            <div className="bg-card p-2 rounded-2xl border shadow-inner">
              <VibrationChart isLive={isMonitoring} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;