import { Activity, Columns3, Gauge, Smartphone, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  {
    label: "Monitored Bridges",
    value: "147",
    change: "+12",
    trend: "up",
    icon: Columns3,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    label: "Active Sensors",
    value: "2,834",
    change: "+156",
    trend: "up",
    icon: Smartphone,
    color: "text-chart-blue",
    bgColor: "bg-chart-blue/10",
  },
  {
    label: "Avg Health Score",
    value: "87.4",
    change: "-0.8",
    trend: "down",
    icon: Gauge,
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    label: "Data Points/sec",
    value: "48.2K",
    change: "+2.1K",
    trend: "up",
    icon: Activity,
    color: "text-chart-amber",
    bgColor: "bg-chart-amber/10",
  },
];

export function StatsOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="glass-panel p-5">
          <div className="flex items-start justify-between">
            <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", stat.bgColor)}>
              <stat.icon className={cn("h-5 w-5", stat.color)} />
            </div>
            <div className={cn(
              "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
              stat.trend === "up" ? "bg-success/10 text-success" : "bg-critical/10 text-critical"
            )}>
              <TrendingUp className={cn(
                "h-3 w-3",
                stat.trend === "down" && "rotate-180"
              )} />
              {stat.change}
            </div>
          </div>
          <div className="mt-4">
            <p className="font-mono text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
