import { MapPin, Radio } from "lucide-react";
import { cn } from "@/lib/utils";

const sensorNodes = [
  { id: 1, x: 15, y: 30, status: "active", bridge: "Howrah" },
  { id: 2, x: 25, y: 45, status: "active", bridge: "Vidyasagar" },
  { id: 3, x: 45, y: 25, status: "warning", bridge: "Pamban" },
  { id: 4, x: 65, y: 55, status: "active", bridge: "Bandra-Worli" },
  { id: 5, x: 80, y: 35, status: "active", bridge: "Atal Setu" },
  { id: 6, x: 35, y: 70, status: "critical", bridge: "Chenab" },
  { id: 7, x: 55, y: 80, status: "active", bridge: "Bogibeel" },
  { id: 8, x: 75, y: 70, status: "active", bridge: "Dhola-Sadiya" },
];

export function SensorMap() {
  return (
    <div className="glass-panel p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-emerald/10">
            <Radio className="h-5 w-5 text-chart-emerald" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Sensor Network</h3>
            <p className="text-sm text-muted-foreground">India Infrastructure Coverage</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-success" />
            <span className="text-muted-foreground">Active</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-warning" />
            <span className="text-muted-foreground">Warning</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-critical" />
            <span className="text-muted-foreground">Critical</span>
          </div>
        </div>
      </div>

      {/* Simplified India Map with sensor overlay */}
      <div className="relative h-64 overflow-hidden rounded-lg bg-secondary/30 grid-pattern">
        {/* Map outline (simplified) */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full opacity-20">
          <path
            d="M50 5 L75 15 L85 35 L80 55 L70 75 L55 85 L40 90 L25 80 L15 60 L20 35 L35 15 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-primary"
          />
        </svg>

        {/* Sensor nodes */}
        {sensorNodes.map((node) => (
          <div
            key={node.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          >
            <div className="relative">
              <div className={cn(
                "h-4 w-4 rounded-full transition-transform group-hover:scale-125",
                node.status === "active" && "bg-success",
                node.status === "warning" && "bg-warning",
                node.status === "critical" && "bg-critical"
              )}>
                {node.status === "active" && (
                  <div className="absolute inset-0 animate-ping rounded-full bg-success opacity-50" />
                )}
                {node.status === "critical" && (
                  <div className="absolute inset-0 animate-pulse rounded-full bg-critical opacity-75" />
                )}
              </div>
              
              {/* Tooltip */}
              <div className="absolute left-1/2 top-full mt-2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="whitespace-nowrap rounded bg-card px-2 py-1 text-xs shadow-lg border border-border">
                  <p className="font-medium text-foreground">{node.bridge}</p>
                  <p className="text-muted-foreground capitalize">{node.status}</p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Connection lines */}
        <svg className="absolute inset-0 h-full w-full pointer-events-none">
          {sensorNodes.slice(0, -1).map((node, i) => {
            const next = sensorNodes[i + 1];
            return (
              <line
                key={`line-${i}`}
                x1={`${node.x}%`}
                y1={`${node.y}%`}
                x2={`${next.x}%`}
                y2={`${next.y}%`}
                stroke="hsl(187, 92%, 50%)"
                strokeWidth="0.5"
                strokeOpacity="0.2"
                strokeDasharray="4 4"
              />
            );
          })}
        </svg>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">8 regions covered</span>
        </div>
        <div className="text-right">
          <p className="font-mono text-sm font-semibold text-foreground">99.2%</p>
          <p className="text-xs text-muted-foreground">Network uptime</p>
        </div>
      </div>
    </div>
  );
}
