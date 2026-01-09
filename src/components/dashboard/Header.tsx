import { Badge } from "@/components/ui/badge";

export const Header = () => {
  return (
    <header className="h-16 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-end px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        {/* Status Badge remains for visual feedback */}
        <Badge variant="outline" className="bg-emerald-500/5 text-emerald-500 border-emerald-500/20 px-3 py-1 gap-2 flex items-center rounded-full border-none">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-wider">System Live</span>
        </Badge>
      </div>
    </header>
  );
};