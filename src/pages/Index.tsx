import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { VibrationChart } from "@/components/dashboard/VibrationChart";
import { useBridgeSensor } from "@/hooks/use-bridge-sensor";
import { Button } from "@/components/ui/button";
import { Activity, AlertTriangle } from "lucide-react";

const Index = () => {
  const { isMonitoring, startMonitoring, error } = useBridgeSensor();

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 grid-pattern pointer-events-none opacity-20" />
      
      <Sidebar />
      
      <main className="ml-64">
        <Header />
        
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between bg-card p-6 rounded-xl border border-border shadow-sm">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Hardware Test Mode</h1>
              <p className="text-muted-foreground">Direct sensor interface for bridge modeling</p>
            </div>
            
            <div className="flex items-center gap-4">
              {error && (
                <div className="flex items-center gap-2 text-destructive bg-destructive/10 px-3 py-2 rounded-md border border-destructive/20">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-xs font-mono">{error}</span>
                </div>
              )}
              <Button 
                onClick={startMonitoring} 
                variant={isMonitoring ? "outline" : "default"}
                size="lg"
                className="font-bold uppercase tracking-wider transition-all"
              >
                <Activity className={`mr-2 h-5 w-5 ${isMonitoring ? "animate-pulse" : ""}`} />
                {isMonitoring ? "System Live" : "Initialize Sensors"}
              </Button>
            </div>
          </div>

          <div className="grid gap-6">
            {/* The core chart is expanded to fill the view for better mobile visibility */}
            <VibrationChart isLive={isMonitoring} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;