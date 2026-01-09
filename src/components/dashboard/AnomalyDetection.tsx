import { Brain, Cpu, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

const models = [
  {
    name: "Isolation Forest",
    accuracy: 94.2,
    status: "active",
    detected: 12,
    color: "bg-chart-cyan",
  },
  {
    name: "One-Class SVM",
    accuracy: 91.8,
    status: "active",
    detected: 8,
    color: "bg-chart-blue",
  },
  {
    name: "Autoencoder",
    accuracy: 96.1,
    status: "training",
    detected: 0,
    color: "bg-chart-emerald",
  },
];

const features = [
  { name: "Dominant Frequency", value: "6.24 Hz", importance: 92 },
  { name: "Spectral Energy", value: "847 J/Hz", importance: 78 },
  { name: "Damping Ratio", value: "0.042", importance: 85 },
  { name: "Peak Shift", value: "-2.1%", importance: 64 },
];

export function AnomalyDetection() {
  return (
    <div className="glass-panel p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">ML Analytics Engine</h3>
            <p className="text-sm text-muted-foreground">Anomaly detection models</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-success/10 px-3 py-1">
          <Zap className="h-3 w-3 text-success" />
          <span className="text-xs font-medium text-success">Real-time</span>
        </div>
      </div>

      {/* Models */}
      <div className="space-y-3">
        {models.map((model) => (
          <div key={model.name} className="rounded-lg bg-secondary/30 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">{model.name}</span>
              </div>
              <div className={cn(
                "rounded-full px-2 py-0.5 text-xs font-medium",
                model.status === "active" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
              )}>
                {model.status}
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>Accuracy</span>
                  <span className="font-mono">{model.accuracy}%</span>
                </div>
                <Progress value={model.accuracy} className="h-1.5" />
              </div>
              <div className="ml-4 text-right">
                <p className="font-mono text-lg font-bold text-foreground">{model.detected}</p>
                <p className="text-xs text-muted-foreground">detected</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Feature Importance */}
      <div className="mt-4 border-t border-border pt-4">
        <h4 className="mb-3 text-sm font-medium text-foreground">Feature Importance</h4>
        <div className="grid grid-cols-2 gap-2">
          {features.map((feature) => (
            <div key={feature.name} className="rounded-lg bg-secondary/20 p-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{feature.name}</span>
                <span className="font-mono text-xs text-primary">{feature.importance}%</span>
              </div>
              <p className="mt-1 font-mono text-sm font-semibold text-foreground">{feature.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
