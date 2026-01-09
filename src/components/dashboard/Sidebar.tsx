import { Activity, Home, Settings, Shield, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Live Monitor", icon: Home, active: true },
  { name: "Hardware Info", icon: Smartphone, active: false },
  { name: "Settings", icon: Settings, active: false },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-sidebar">
      <div className="flex h-full flex-col">
        {/* Logo - Renamed for the specific monitoring purpose */}
        <div className="flex h-16 items-center gap-3 border-b border-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 data-glow">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">VibeGuard</h1>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Sensor Lab</p>
          </div>
        </div>

        {/* Simplified Navigation */}
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
            </a>
          ))}
        </nav>

        {/* Minimal Status Card */}
        <div className="border-t border-border p-4">
          <div className="glass-panel p-4 bg-secondary/20">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <div className="absolute inset-0 h-2 w-2 animate-ping rounded-full bg-emerald-500 opacity-75" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground uppercase tracking-tighter">Hardware Ready</p>
                <p className="text-[10px] text-muted-foreground">Internal Accelerometer</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Activity className="h-3 w-3 text-primary animate-pulse" />
              <span className="font-mono text-[10px] text-muted-foreground">
                Samping Rate: 60Hz
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}