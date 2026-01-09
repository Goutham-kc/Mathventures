import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { VibrationChart } from "@/components/dashboard/VibrationChart";
import { useBridgeSensor } from "@/hooks/use-bridge-sensor";
import { Button } from "@/components/ui/button";
import { Activity, Target } from "lucide-react";
import { useState } from "react";

const Index = () => {
  const { isMonitoring, startMonitoring, error } = useBridgeSensor();
  const [isRecordingBaseline, setIsRecordingBaseline] = useState(false);

  const captureBaseline = () => {
    setIsRecordingBaseline(true);
    // The VibrationChart will see this state and send is_baseline: true to Python
    setTimeout(() => setIsRecordingBaseline(false), 5000); // Record for 5 seconds
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-64">
        <Header />
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between bg-card p-6 rounded-xl border border-border">
            <div>
              <h1 className="text-2xl font-bold">SHM Integrity Monitor</h1>
              <p className="text-muted-foreground text-sm">Step 2: Compare Current vs Golden Baseline</p>
            </div>
            
            <div className="flex gap-4">
              <Button 
                onClick={captureBaseline} 
                variant="outline" 
                disabled={!isMonitoring || isRecordingBaseline}
                className="gap-2 border-primary text-primary"
              >
                <Target className={isRecordingBaseline ? "animate-spin" : ""} />
                {isRecordingBaseline ? "Recording Baseline..." : "Set Golden Baseline"}
              </Button>

              <Button onClick={startMonitoring} variant={isMonitoring ? "secondary" : "default"}>
                <Activity className="mr-2 h-4 w-4" />
                {isMonitoring ? "Monitoring Active" : "Initialize Sensors"}
              </Button>
            </div>
          </div>

          <VibrationChart isLive={isMonitoring} isBaselineMode={isRecordingBaseline} />
        </div>
      </main>
    </div>
  );
};

export default Index;