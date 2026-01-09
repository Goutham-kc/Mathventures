import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { VibrationChart } from "@/components/dashboard/VibrationChart";
import { useBridgeSensor } from "@/hooks/use-bridge-sensor";
import { Button } from "@/components/ui/button";
import { Activity, AlertTriangle } from "lucide-react";

const Index = () => {
  const { isMonitoring, startMonitoring, error } = useBridgeSensor();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Static grid background for context, removed heavy scanline effects */}
      <div className="fixed inset-0 grid-pattern pointer-events-none opacity-20" />
      
      <Sidebar />
      
      <main className="flex-1 ml-64 min-h-screen bg-background/50 backdrop-blur-sm">
        <Header />
        
        <div className="p-6 space-y-6 max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between bg-card p-6 rounded-xl border border-border shadow-sm gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">Structural Test Mode</h1>
              <p className="text-muted-foreground text-sm">Direct Mobile Hardware Interface</p>
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              {error && (
                <div className="flex items-center gap-2 text-destructive bg-destructive/10 px-3 py-2 rounded-md border border-destructive/20 text-xs font-mono">
                  <AlertTriangle className="h-4 w-4" />
                  {error}
                </div>
              )}
              <Button 
                onClick={startMonitoring} 
                variant={isMonitoring ? "outline" : "default"}
                size="lg"
                className="w-full md:w-auto font-bold uppercase tracking-widest transition-all"
              >
                <Activity className={`mr-2 h-5 w-5 ${isMonitoring ? "animate-pulse" : ""}`} />
                {isMonitoring ? "Monitoring Live" : "Initialize Sensors"}
              </Button>
            </div>
          </div>

          <div className="grid gap-6">
            {/* The core chart is now the main focus */}
            <VibrationChart isLive={isMonitoring} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;