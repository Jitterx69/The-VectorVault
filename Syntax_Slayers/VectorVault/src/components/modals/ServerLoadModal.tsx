import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Server, Cpu, HardDrive, MemoryStick, Activity } from "lucide-react";

interface ServerLoadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ServerLoadModal = ({ open, onOpenChange }: ServerLoadModalProps) => {
  const servers = [
    { name: "web-server-01", cpu: 15, memory: 45, disk: 62, status: "Healthy" },
    { name: "web-server-02", cpu: 28, memory: 38, disk: 58, status: "Healthy" },
    { name: "web-server-03", cpu: 85, memory: 92, disk: 78, status: "Critical" },
    { name: "api-server-01", cpu: 22, memory: 41, disk: 33, status: "Healthy" },
    { name: "db-server-01", cpu: 35, memory: 68, disk: 89, status: "Warning" },
    { name: "cache-server-01", cpu: 12, memory: 25, disk: 41, status: "Healthy" }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Healthy': return 'status-success';
      case 'Warning': return 'status-warning';
      case 'Critical': return 'status-critical';
      default: return 'status-info';
    }
  };

  const getProgressColor = (value: number) => {
    if (value >= 80) return 'text-danger';
    if (value >= 60) return 'text-warning';
    return 'text-success';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Server className="h-5 w-5 text-primary" />
            <span>Server Load Dashboard</span>
          </DialogTitle>
          <DialogDescription>
            Real-time server performance metrics and resource utilization
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overall Load Summary */}
          <Card className="card-gradient border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Cluster Overview</CardTitle>
              <CardDescription>Aggregate resource utilization across all servers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="p-3 bg-primary/20 rounded-lg mb-2 inline-block">
                    <Cpu className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-2xl font-bold">23%</p>
                  <p className="text-sm text-muted-foreground">Average CPU</p>
                  <Progress value={23} className="h-2 mt-2" />
                </div>
                <div className="text-center">
                  <div className="p-3 bg-warning/20 rounded-lg mb-2 inline-block">
                    <MemoryStick className="h-6 w-6 text-warning" />
                  </div>
                  <p className="text-2xl font-bold text-warning">52%</p>
                  <p className="text-sm text-muted-foreground">Average Memory</p>
                  <Progress value={52} className="h-2 mt-2" />
                </div>
                <div className="text-center">
                  <div className="p-3 bg-danger/20 rounded-lg mb-2 inline-block">
                    <HardDrive className="h-6 w-6 text-danger" />
                  </div>
                  <p className="text-2xl font-bold text-danger">60%</p>
                  <p className="text-sm text-muted-foreground">Average Disk</p>
                  <Progress value={60} className="h-2 mt-2" />
                </div>
                <div className="text-center">
                  <div className="p-3 bg-success/20 rounded-lg mb-2 inline-block">
                    <Activity className="h-6 w-6 text-success" />
                  </div>
                  <p className="text-2xl font-bold text-success">6/6</p>
                  <p className="text-sm text-muted-foreground">Servers Online</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Individual Server Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {servers.map((server, index) => (
              <Card key={index} className="card-gradient border-border/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center space-x-2">
                      <Server className="h-4 w-4" />
                      <span>{server.name}</span>
                    </CardTitle>
                    <Badge variant="outline" className={getStatusColor(server.status)}>
                      {server.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="flex items-center space-x-1">
                          <Cpu className="h-3 w-3" />
                          <span>CPU Usage</span>
                        </span>
                        <span className={`font-mono ${getProgressColor(server.cpu)}`}>
                          {server.cpu}%
                        </span>
                      </div>
                      <Progress value={server.cpu} className="h-1.5" />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="flex items-center space-x-1">
                          <MemoryStick className="h-3 w-3" />
                          <span>Memory Usage</span>
                        </span>
                        <span className={`font-mono ${getProgressColor(server.memory)}`}>
                          {server.memory}%
                        </span>
                      </div>
                      <Progress value={server.memory} className="h-1.5" />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="flex items-center space-x-1">
                          <HardDrive className="h-3 w-3" />
                          <span>Disk Usage</span>
                        </span>
                        <span className={`font-mono ${getProgressColor(server.disk)}`}>
                          {server.disk}%
                        </span>
                      </div>
                      <Progress value={server.disk} className="h-1.5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load Alerts */}
          <Card className="card-gradient border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Load Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="p-3 bg-danger/10 border border-danger/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="status-critical">Critical</Badge>
                    <span className="text-sm">web-server-03: CPU and Memory usage exceeded 80%</span>
                  </div>
                </div>
                <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="status-warning">Warning</Badge>
                    <span className="text-sm">db-server-01: Disk usage approaching 90%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServerLoadModal;