import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Network, Server, Activity, Wifi, Globe, Router } from "lucide-react";

interface NetworkHealthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NetworkHealthModal = ({ open, onOpenChange }: NetworkHealthModalProps) => {
  const networkComponents = [
    { name: "Core Router", status: "Healthy", uptime: "99.9%", latency: "1.2ms", icon: Router },
    { name: "Load Balancer", status: "Healthy", uptime: "99.8%", latency: "0.8ms", icon: Network },
    { name: "Edge Servers", status: "Warning", uptime: "98.5%", latency: "2.1ms", icon: Server },
    { name: "CDN Network", status: "Healthy", uptime: "99.7%", latency: "15ms", icon: Globe },
    { name: "Internal WiFi", status: "Healthy", uptime: "99.2%", latency: "5ms", icon: Wifi },
    { name: "VPN Gateway", status: "Degraded", uptime: "97.8%", latency: "8ms", icon: Activity }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Healthy': return 'status-success';
      case 'Warning': return 'status-warning';
      case 'Degraded': return 'status-critical';
      default: return 'status-info';
    }
  };

  const getUptimeValue = (uptime: string) => {
    return parseFloat(uptime.replace('%', ''));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Network className="h-5 w-5 text-primary" />
            <span>Network Health Dashboard</span>
          </DialogTitle>
          <DialogDescription>
            Comprehensive network infrastructure monitoring and status overview
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overall Health Score */}
          <Card className="card-gradient border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Overall Network Health</CardTitle>
              <CardDescription>Aggregate health score across all network components</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-success">98.7%</span>
                  <Badge variant="outline" className="status-success">Excellent</Badge>
                </div>
                <Progress value={98.7} className="h-2" />
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <p className="font-semibold">Uptime</p>
                    <p className="text-success">99.1%</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">Avg Latency</p>
                    <p className="text-primary">5.4ms</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">Throughput</p>
                    <p className="text-warning">850 Mbps</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Network Components */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {networkComponents.map((component, index) => {
              const IconComponent = component.icon;
              return (
                <Card key={index} className="card-gradient border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/20 rounded-lg">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{component.name}</h3>
                          <Badge variant="outline" className={getStatusColor(component.status)}>
                            {component.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Uptime</span>
                        <span className="font-mono">{component.uptime}</span>
                      </div>
                      <Progress value={getUptimeValue(component.uptime)} className="h-1" />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Latency</span>
                        <span className="font-mono text-primary">{component.latency}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Traffic Overview */}
          <Card className="card-gradient border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Network Traffic Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">2.3 GB/s</p>
                  <p className="text-sm text-muted-foreground">Inbound Traffic</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-success">1.8 GB/s</p>
                  <p className="text-sm text-muted-foreground">Outbound Traffic</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-warning">1,247</p>
                  <p className="text-sm text-muted-foreground">Active Connections</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-danger">23</p>
                  <p className="text-sm text-muted-foreground">Blocked IPs</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NetworkHealthModal;