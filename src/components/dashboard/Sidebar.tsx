import { Activity, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

export const Sidebar = () => {
  return (
    <div className="flex flex-col h-full bg-card text-card-foreground">
      <div className="p-6 flex items-center gap-3 border-b border-border/50">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Activity className="h-6 w-6 text-primary" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold tracking-tight text-xl">VibeGuard</span>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-black">Sensor Lab</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 mt-4">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary border border-primary/20 cursor-default">
          <LayoutDashboard className="h-5 w-5" />
          <span className="font-semibold text-sm">Live Monitor</span>
        </div>
      </nav>

      <div className="p-6 border-t border-border/50">
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase text-emerald-500">Hardware Ready</span>
            <span className="text-[9px] text-muted-foreground">Internal Accelerometer</span>
          </div>
        </div>
      </div>
    </div>
  );
};