import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle, MapPin, TrendingDown, TrendingUp, XCircle } from "lucide-react";

interface BridgeHealthCardProps {
  name: string;
  location: string;
  healthScore: number;
  status: "healthy" | "warning" | "critical";
  trend: "up" | "down" | "stable";
  sensors: number;
  lastUpdate: string;
}

export function BridgeHealthCard({
  name,
  location,
  healthScore,
  status,
  trend,
  sensors,
  lastUpdate,
}: BridgeHealthCardProps) {
  const statusConfig = {
    healthy: {
      icon: CheckCircle,
      color: "text-success",
      bg: "bg-success/10",
      label: "Healthy",
      glow: "success-glow",
    },
    warning: {
      icon: AlertTriangle,
      color: "text-warning",
      bg: "bg-warning/10",
      label: "Warning",
      glow: "warning-glow",
    },
    critical: {
      icon: XCircle,
      color: "text-critical",
      bg: "bg-critical/10",
      label: "Critical",
      glow: "critical-glow",
    },
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <div className={cn("glass-panel p-5 transition-all duration-300 hover:border-primary/30", status === "critical" && "border-critical/30")}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">{name}</h3>
            <div className={cn("flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium", config.bg, config.color)}>
              <StatusIcon className="h-3 w-3" />
              {config.label}
            </div>
          </div>
          <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {location}
          </div>
        </div>

        {/* Health Score Circle */}
        <div className={cn("relative flex h-16 w-16 items-center justify-center rounded-full", config.bg)}>
          <svg className="absolute h-full w-full -rotate-90">
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className="text-border"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeDasharray={`${(healthScore / 100) * 176} 176`}
              strokeLinecap="round"
              className={config.color}
            />
          </svg>
          <span className={cn("font-mono text-lg font-bold", config.color)}>{healthScore}</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4 border-t border-border pt-4">
        <div>
          <p className="text-xs text-muted-foreground">Sensors</p>
          <p className="font-mono font-semibold text-foreground">{sensors}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Trend</p>
          <div className="flex items-center gap-1">
            {trend === "up" ? (
              <TrendingUp className="h-4 w-4 text-success" />
            ) : trend === "down" ? (
              <TrendingDown className="h-4 w-4 text-critical" />
            ) : (
              <span className="text-muted-foreground">—</span>
            )}
            <span className={cn(
              "text-sm font-medium",
              trend === "up" ? "text-success" : trend === "down" ? "text-critical" : "text-muted-foreground"
            )}>
              {trend === "stable" ? "Stable" : trend === "up" ? "+2.1%" : "-1.8%"}
            </span>
          </div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Updated</p>
          <p className="font-mono text-sm text-foreground">{lastUpdate}</p>
        </div>
      </div>
    </div>
  );
}
