import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, AlertTriangle, Eye, Target, Zap, Globe } from "lucide-react";

interface ThreatLevelModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ThreatLevelModal = ({ open, onOpenChange }: ThreatLevelModalProps) => {
  const threatCategories = [
    { name: "DDoS Attacks", level: "High", count: 12, blocked: 11, icon: Target },
    { name: "Malware Detection", level: "Medium", count: 8, blocked: 8, icon: Shield },
    { name: "Brute Force", level: "Medium", count: 23, blocked: 22, icon: Eye },
    { name: "SQL Injection", level: "Low", count: 3, blocked: 3, icon: Zap },
    { name: "XSS Attempts", level: "Low", count: 6, blocked: 6, icon: Globe },
    { name: "Port Scanning", level: "Medium", count: 15, blocked: 14, icon: Target }
  ];

  const recentThreats = [
    { 
      time: "14:32:45", 
      type: "DDoS Attack", 
      source: "45.123.67.89", 
      severity: "High", 
      status: "Blocked",
      description: "Large-scale HTTP flood attack detected"
    },
    { 
      time: "14:31:22", 
      type: "Brute Force", 
      source: "203.45.67.89", 
      severity: "Medium", 
      status: "Blocked",
      description: "SSH login attempts using common passwords"
    },
    { 
      time: "14:28:15", 
      type: "Malware", 
      source: "internal", 
      severity: "High", 
      status: "Quarantined",
      description: "Suspicious executable detected in email attachment"
    }
  ];

  const getLevelColor = (level: string) => {
    switch(level) {
      case 'High': return 'status-critical';
      case 'Medium': return 'status-warning';
      case 'Low': return 'status-success';
      default: return 'status-info';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Blocked': return 'bg-success/20 text-success border-success/30';
      case 'Quarantined': return 'bg-warning/20 text-warning border-warning/30';
      case 'Active': return 'bg-danger/20 text-danger border-danger/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-primary" />
            <span>Threat Level Analysis</span>
          </DialogTitle>
          <DialogDescription>
            Comprehensive threat detection and security posture overview
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overall Threat Level */}
          <Card className="card-gradient border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Current Threat Level</CardTitle>
              <CardDescription>Real-time security threat assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="p-4 bg-warning/20 rounded-lg">
                    <Shield className="h-8 w-8 text-warning" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-warning">MEDIUM</h3>
                    <p className="text-muted-foreground">Elevated threat activity detected</p>
                  </div>
                </div>
                <Badge variant="outline" className="status-warning text-lg p-2">
                  Threat Score: 6.2/10
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-danger">67</p>
                  <p className="text-sm text-muted-foreground">Threats Detected (24h)</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-success">65</p>
                  <p className="text-sm text-muted-foreground">Threats Blocked</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-warning">97%</p>
                  <p className="text-sm text-muted-foreground">Block Success Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Threat Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {threatCategories.map((category, index) => {
              const IconComponent = category.icon;
              const blockRate = Math.round((category.blocked / category.count) * 100);
              return (
                <Card key={index} className="card-gradient border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/20 rounded-lg">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{category.name}</h3>
                          <Badge variant="outline" className={getLevelColor(category.level)}>
                            {category.level} Risk
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Attempts</span>
                        <span className="font-bold text-danger">{category.count}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Blocked</span>
                        <span className="font-bold text-success">{category.blocked}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Success Rate</span>
                        <span className="font-mono text-primary">{blockRate}%</span>
                      </div>
                      <Progress value={blockRate} className="h-1" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Recent Threats */}
          <Card className="card-gradient border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Recent Threat Activity</CardTitle>
              <CardDescription>Latest security events and responses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentThreats.map((threat, index) => (
                  <div key={index} className="p-4 bg-muted/20 rounded-lg border border-border/50">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold">{threat.type}</h4>
                          <p className="text-sm text-muted-foreground">{threat.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className={getLevelColor(threat.severity)}>
                          {threat.severity}
                        </Badge>
                        <Badge variant="outline" className={getStatusColor(threat.status)}>
                          {threat.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Source: {threat.source}</span>
                      <span>{threat.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Security Recommendations */}
          <Card className="card-gradient border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Security Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="status-warning">Action Required</Badge>
                    <span className="text-sm">Increase DDoS protection threshold due to elevated attack volume</span>
                  </div>
                </div>
                <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="status-info">Suggested</Badge>
                    <span className="text-sm">Review and update intrusion detection rules for new attack patterns</span>
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

export default ThreatLevelModal;