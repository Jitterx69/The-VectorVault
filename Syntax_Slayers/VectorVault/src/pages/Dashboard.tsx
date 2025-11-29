import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import GenerateReportModal from "@/components/modals/GenerateReportModal";
import NetworkHealthModal from "@/components/modals/NetworkHealthModal";
import ServerLoadModal from "@/components/modals/ServerLoadModal";
import ThreatLevelModal from "@/components/modals/ThreatLevelModal";
import ActiveConnectionsModal from "@/components/modals/ActiveConnectionsModal";
import { 
  Shield, 
  AlertTriangle, 
  Activity, 
  TrendingUp, 
  Eye, 
  Search,
  Zap,
  Database,
  Network,
  Server,
  BarChart3,
  Clock
} from "lucide-react";

const Dashboard = () => {
  const [showGenerateReport, setShowGenerateReport] = useState(false);
  const [showNetworkHealth, setShowNetworkHealth] = useState(false);
  const [showServerLoad, setShowServerLoad] = useState(false);
  const [showThreatLevel, setShowThreatLevel] = useState(false);
  const [showActiveConnections, setShowActiveConnections] = useState(false);
  const navigate = useNavigate();
  const criticalIncidents = [
    { id: "INC-2024-001", type: "DDoS Attack", severity: "Critical", time: "2 mins ago", status: "Active" },
    { id: "INC-2024-002", type: "Suspicious Login", severity: "High", time: "15 mins ago", status: "Investigating" },
    { id: "INC-2024-003", type: "Malware Detection", severity: "Medium", time: "1 hour ago", status: "Contained" },
  ];

  const systemMetrics = [
    { label: "Network Health", value: "98.7%", status: "success" },
    { label: "Server Load", value: "23%", status: "success" },
    { label: "Threat Level", value: "Medium", status: "warning" },
    { label: "Active Connections", value: "1,247", status: "info" },
  ];

  const recentAlerts = [
    "Unusual API traffic from IP 192.168.1.100",
    "Failed authentication attempts detected",
    "Database query anomaly in user_sessions",
    "SSL certificate expiring in 7 days"
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Security Operations Center
          </h1>
          <p className="text-muted-foreground">Secured by A.S.T.R.A</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="status-success">System Online</Badge>
          <Badge variant="outline" className="text-xs">Last Update: 30s ago</Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemMetrics.map((metric, index) => (
          <Card 
            key={index} 
            className="card-gradient border-border/50 hover:border-primary/30 transition-colors cursor-pointer"
            onClick={() => {
              if (index === 0) setShowNetworkHealth(true);
              else if (index === 1) setShowServerLoad(true);
              else if (index === 2) setShowThreatLevel(true);
              else if (index === 3) setShowActiveConnections(true);
            }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                </div>
                <div className={`p-2 rounded-lg ${
                  metric.status === 'success' ? 'bg-success/20 text-success' :
                  metric.status === 'warning' ? 'bg-warning/20 text-warning' :
                  'bg-primary/20 text-primary'
                }`}>
                  {index === 0 && <Network className="h-6 w-6" />}
                  {index === 1 && <Server className="h-6 w-6" />}
                  {index === 2 && <Shield className="h-6 w-6" />}
                  {index === 3 && <Activity className="h-6 w-6" />}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Critical Incidents */}
        <Card className="lg:col-span-2 card-gradient border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-danger" />
              <span>Active Security Incidents</span>
            </CardTitle>
            <CardDescription>Real-time incident tracking and response</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {criticalIncidents.map((incident) => (
                <div key={incident.id} className="p-4 bg-muted/30 rounded-lg border border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-foreground">{incident.type}</h4>
                    <Badge 
                      variant="outline" 
                      className={
                        incident.severity === 'Critical' ? 'status-critical pulse-danger' :
                        incident.severity === 'High' ? 'status-warning' : 'status-info'
                      }
                    >
                      {incident.severity}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">ID: {incident.id}</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {incident.time}
                      </span>
                      <Badge variant="secondary" className="text-xs">{incident.status}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex space-x-2 mt-4">
              <Button size="sm" className="glow-primary" onClick={() => navigate("/incidents")}>
                <Eye className="h-4 w-4 mr-2" />
                View All Incidents
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate("/ai-analysis")}>
                <Search className="h-4 w-4 mr-2" />
                AI Analysis
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Alerts */}
        <div className="space-y-6">
          
          {/* Quick Actions */}
          <Card className="card-gradient border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline" onClick={() => navigate("/vector-search")}>
                <Search className="h-4 w-4 mr-2" />
                Vector Search
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => navigate("/ai-analysis")}>
                <Zap className="h-4 w-4 mr-2" />
                AI Analysis
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => navigate("/system-logs")}>
                <Database className="h-4 w-4 mr-2" />
                Query Logs
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => setShowGenerateReport(true)}>
                <BarChart3 className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </CardContent>
          </Card>

          {/* Recent Alerts */}
          <Card className="card-gradient border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Activity className="h-4 w-4 mr-2 text-primary" />
                Live Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentAlerts.map((alert, index) => (
                  <div key={index} className="p-2 bg-muted/20 rounded text-sm border-l-2 border-primary/50">
                    {alert}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>

      {/* System Status Bar */}
      <Card className="card-gradient border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">TiDB Online</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">LLM Engines Active</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-warning rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">2 Incidents Pending</span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              System Uptime: 99.98% | Last Backup: 10m ago
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <GenerateReportModal 
        open={showGenerateReport} 
        onOpenChange={setShowGenerateReport} 
      />
      <NetworkHealthModal 
        open={showNetworkHealth} 
        onOpenChange={setShowNetworkHealth} 
      />
      <ServerLoadModal 
        open={showServerLoad} 
        onOpenChange={setShowServerLoad} 
      />
      <ThreatLevelModal 
        open={showThreatLevel} 
        onOpenChange={setShowThreatLevel} 
      />
      <ActiveConnectionsModal 
        open={showActiveConnections} 
        onOpenChange={setShowActiveConnections} 
      />
    </div>
  );
};

export default Dashboard;