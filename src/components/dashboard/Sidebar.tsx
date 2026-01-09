import { Activity, BarChart3, Bell, Columns3, Database, Home, Map, Settings, Shield, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", icon: Home, active: true },
  { name: "Bridge Network", icon: Columns3, active: false },
  { name: "Live Sensors", icon: Smartphone, active: false },
  { name: "Analytics", icon: BarChart3, active: false },
  { name: "Alerts", icon: Bell, active: false, badge: 3 },
  { name: "Map View", icon: Map, active: false },
  { name: "Data Store", icon: Database, active: false },
  { name: "Settings", icon: Settings, active: false },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-sidebar">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 data-glow">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">VibeGuard</h1>
            <p className="text-xs text-muted-foreground">Structural Monitoring</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => (
            <a
              key={item.name}
              href="#"
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                item.active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 transition-colors",
                item.active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
              )} />
              <span className="flex-1">{item.name}</span>
              {item.badge && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-critical text-[10px] font-bold text-critical-foreground">
                  {item.badge}
                </span>
              )}
            </a>
          ))}
        </nav>

        {/* Status Card */}
        <div className="border-t border-border p-4">
          <div className="glass-panel p-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-2.5 w-2.5 rounded-full bg-success" />
                <div className="absolute inset-0 h-2.5 w-2.5 animate-ping rounded-full bg-success opacity-75" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">System Online</p>
                <p className="text-xs text-muted-foreground">24 sensors active</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary animate-pulse" />
              <span className="font-mono text-xs text-muted-foreground">
                Uptime: 99.97%
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
