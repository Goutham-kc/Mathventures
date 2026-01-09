import { AlertTriangle, Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Alert {
  id: string;
  type: "warning" | "critical";
  title: string;
  description: string;
  bridge: string;
  time: string;
}

const alerts: Alert[] = [
  {
    id: "1",
    type: "critical",
    title: "Frequency Shift Detected",
    description: "Primary resonance frequency shifted by 8.3% from baseline",
    bridge: "Howrah Bridge",
    time: "2 min ago",
  },
  {
    id: "2",
    type: "warning",
    title: "Elevated Vibration Amplitude",
    description: "Peak amplitude 40% above normal during traffic hours",
    bridge: "Bandra-Worli Sea Link",
    time: "15 min ago",
  },
  {
    id: "3",
    type: "warning",
    title: "Sensor Connectivity Issue",
    description: "Sensor SN-042 intermittent connection detected",
    bridge: "Pamban Bridge",
    time: "1 hour ago",
  },
];

export function AlertsPanel() {
  return (
    <div className="glass-panel p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
            <AlertTriangle className="h-5 w-5 text-warning" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Active Alerts</h3>
            <p className="text-sm text-muted-foreground">{alerts.length} alerts require attention</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
          View All
        </Button>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={cn(
              "relative overflow-hidden rounded-lg border p-4 transition-all duration-200 hover:border-opacity-60",
              alert.type === "critical" 
                ? "border-critical/30 bg-critical/5" 
                : "border-warning/30 bg-warning/5"
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "h-2 w-2 rounded-full",
                    alert.type === "critical" ? "bg-critical animate-pulse" : "bg-warning"
                  )} />
                  <h4 className={cn(
                    "font-medium",
                    alert.type === "critical" ? "text-critical" : "text-warning"
                  )}>
                    {alert.title}
                  </h4>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{alert.description}</p>
                <div className="mt-2 flex items-center gap-4">
                  <span className="text-xs font-medium text-foreground">{alert.bridge}</span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {alert.time}
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6 opacity-50 hover:opacity-100">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
