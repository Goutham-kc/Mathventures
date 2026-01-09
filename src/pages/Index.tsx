import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { VibrationChart } from "@/components/dashboard/VibrationChart";
import { FFTSpectrum } from "@/components/dashboard/FFTSpectrum";
import { BridgeHealthCard } from "@/components/dashboard/BridgeHealthCard";
import { AlertsPanel } from "@/components/dashboard/AlertsPanel";
import { SensorMap } from "@/components/dashboard/SensorMap";
import { AnomalyDetection } from "@/components/dashboard/AnomalyDetection";

const bridges = [
  {
    name: "Howrah Bridge",
    location: "Kolkata, West Bengal",
    healthScore: 92,
    status: "healthy" as const,
    trend: "up" as const,
    sensors: 48,
    lastUpdate: "2s ago",
  },
  {
    name: "Bandra-Worli Sea Link",
    location: "Mumbai, Maharashtra",
    healthScore: 78,
    status: "warning" as const,
    trend: "down" as const,
    sensors: 64,
    lastUpdate: "5s ago",
  },
  {
    name: "Pamban Bridge",
    location: "Rameswaram, Tamil Nadu",
    healthScore: 45,
    status: "critical" as const,
    trend: "down" as const,
    sensors: 32,
    lastUpdate: "1s ago",
  },
  {
    name: "Atal Setu",
    location: "Mumbai, Maharashtra",
    healthScore: 98,
    status: "healthy" as const,
    trend: "stable" as const,
    sensors: 96,
    lastUpdate: "3s ago",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Background effects */}
      <div className="fixed inset-0 grid-pattern pointer-events-none" />
      <div className="fixed inset-0 scan-line pointer-events-none" />
      
      <Sidebar />
      
      <main className="ml-64">
        <Header />
        
        <div className="p-6 space-y-6">
          {/* Page Title */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Structural Health Dashboard</h1>
              <p className="text-muted-foreground">Real-time monitoring of India's bridge infrastructure</p>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-card border border-border px-4 py-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              <span className="font-mono text-sm text-muted-foreground">
                Last sync: <span className="text-foreground">Just now</span>
              </span>
            </div>
          </div>

          {/* Stats Overview */}
          <StatsOverview />

          {/* Main Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            <VibrationChart />
            <FFTSpectrum />
          </div>

          {/* Bridge Health Cards */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-foreground">Bridge Health Status</h2>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {bridges.map((bridge) => (
                <BridgeHealthCard key={bridge.name} {...bridge} />
              ))}
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid gap-6 lg:grid-cols-3">
            <AlertsPanel />
            <SensorMap />
            <AnomalyDetection />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
