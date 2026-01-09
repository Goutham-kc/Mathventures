import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search bridges, sensors..."
            className="w-80 bg-secondary/50 pl-10 border-border focus:border-primary"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="mr-4 flex items-center gap-2 rounded-full bg-secondary/50 px-4 py-1.5">
          <div className="h-2 w-2 animate-pulse rounded-full bg-success" />
          <span className="font-mono text-xs text-muted-foreground">LIVE</span>
        </div>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-critical text-[10px] font-bold text-critical-foreground">
            3
          </span>
        </Button>

        <Button variant="ghost" size="icon">
          <User className="h-5 w-5 text-muted-foreground" />
        </Button>
      </div>
    </header>
  );
}
