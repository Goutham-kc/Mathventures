import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { VibrationChart } from "@/components/dashboard/VibrationChart";
import { useBridgeSensor } from "@/hooks/use-bridge-sensor";
import { Button } from "@/components/ui/button";
import { Activity, Target, PlayCircle, RotateCcw, ShieldCheck, Info, Menu } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Index = () => {
  const { isMonitoring, startMonitoring, buffer, error: sensorError } = useBridgeSensor();
  const [phase, setPhase] = useState<"idle" | "sampling">("idle");
  const [baselineHz, setBaselineHz] = useState<number | null>(null);
  const [records, setRecords] = useState<any[]>([]);

  const handleAnalysis = async (isBaseline: boolean) => {
    if (!isMonitoring || phase !== "idle") return;
    setPhase("sampling");

    setTimeout(async () => {
      try {
        const response = await fetch("https://mathventures-2.onrender.com/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ values: buffer.current, is_baseline: isBaseline })
        });
        const data = await response.json();

        if (isBaseline && typeof data.hz === "number") {
          setBaselineHz(Number(data.hz.toFixed(2)));
          setRecords([]);
        } else if (!isBaseline) {
          const newEntry = {
            score: data.integrity_score,
            hz: data.current_hz,
            errorMargin: data.error_margin_hz,
            confidence: data.confidence,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
          };
          setRecords((prev) => [newEntry, ...prev].slice(0, 3));
        }
      } catch (err) {
        console.error("Analysis failed", err);
      }
      setPhase("idle");
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:block w-64 fixed inset-y-0 z-50 border-r border-border bg-card">
        <Sidebar />
      </div>

      {/* MOBILE HEADER & MENU */}
      <div className="md:hidden flex items-center justify-between p-4 border-b bg-card sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <span className="font-bold tracking-tighter uppercase italic">SIL</span>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon"><Menu className="h-6 w-6" /></Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 bg-card">
            <Sidebar />
          </SheetContent>
        </Sheet>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 md:ml-64 w-full min-h-screen flex flex-col">
        <Header />

        {/* Scrollable container for mobile */}
        <div className="p-4 md:p-8 space-y-6 max-w-6xl mx-auto w-full pb-20">
          
          {/* Main Control Card */}
          <div className="bg-card p-5 md:p-8 rounded-3xl border border-border shadow-xl space-y-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tighter">Structural Integrity Lab</h1>
                <div className="flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-2xl border border-primary/10 w-fit">
                  <ShieldCheck className={`h-5 w-5 ${baselineHz ? "text-emerald-500" : "text-muted-foreground"}`} />
                  <span className="text-xs font-black uppercase tracking-tighter font-mono text-muted-foreground">
                    Ref: <span className="text-foreground">{baselineHz ? `${baselineHz} Hz` : "Awaiting Baseline"}</span>
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                {!isMonitoring ? (
                  <Button onClick={startMonitoring} size="lg" className="w-full rounded-2xl shadow-lg shadow-primary/20">
                    Initialize Sensors
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" size="lg" disabled={phase !== "idle"} onClick={() => handleAnalysis(true)} className="flex-1 rounded-2xl">
                      <Target className="mr-2 h-5 w-5" /> {phase === "sampling" && !baselineHz ? "Sampling..." : "Set Baseline"}
                    </Button>
                    <Button size="lg" disabled={phase !== "idle" || !baselineHz || records.length >= 3} onClick={() => handleAnalysis(false)} className="flex-1 rounded-2xl shadow-xl shadow-primary/20">
                      <PlayCircle className="mr-2 h-5 w-5" /> {phase === "sampling" && baselineHz ? "Analyzing..." : `Track Set ${records.length + 1}`}
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="bg-blue-500/5 border border-blue-500/10 p-4 rounded-2xl flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
              <p className="text-[10px] md:text-[11px] text-muted-foreground leading-relaxed">
                <b className="text-blue-500 uppercase tracking-widest mr-1">Precision (CRLB):</b> 
                Calculates frequency variance based on SNR for scientific validation.
              </p>
            </div>
          </div>

          {/* Records Grid - Vertical on Mobile, Horizontal on Desktop */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => {
              const record = records[i];
              return (
                <div key={i} className={`p-6 md:p-8 rounded-3xl border-2 transition-all duration-700 ${record ? "bg-card border-primary shadow-2xl" : "bg-muted/5 border-dashed border-border opacity-40"}`}>
                  <div className="flex justify-between items-center mb-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Set 0{i + 1}</div>
                  {record ? (
                    <div className="text-center space-y-4">
                      <div className={`text-5xl md:text-6xl font-black tracking-tighter ${record.score < 80 ? "text-destructive" : "text-primary"}`}>{Math.round(record.score)}%</div>
                      <div className="flex flex-col items-center">
                        <span className="text-lg font-bold">{record.hz} Hz</span>
                        <span className="text-[10px] text-muted-foreground font-mono">±{record.errorMargin} Hz</span>
                      </div>
                    </div>
                  ) : (
                    <div className="h-24 md:h-32 flex flex-col items-center justify-center text-[10px] uppercase font-black text-muted-foreground tracking-widest">Pending</div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 text-muted-foreground px-2">
              <Activity className="h-4 w-4 text-primary" /> Live Spectral Feed
            </h3>
            <div className="bg-card p-3 rounded-3xl border border-border shadow-inner">
              <VibrationChart isLive={isMonitoring} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;