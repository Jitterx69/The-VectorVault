import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
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
  const [isSendingCode, setIsSendingCode] = useState(false);
  const navigate = useNavigate();
  
  const { toast } = useToast();
  
  const handleSendSecurityCode = async () => {
    setIsSendingCode(true);
    
    try {
      const response = await fetch('http://localhost:3001/api/send-security-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();

      if (!data.success) {
        console.error('Failed to send security code:', data.error);
      } else {
        console.log('Security code sent successfully:', data.code);
        // Refresh incidents immediately to show the new event
        fetchIncidents();
      }
    } catch (error) {
      console.error('Error sending security code:', error);
    } finally {
      setIsSendingCode(false);
    }
  };
  
  // Real-time incidents state
  const [criticalIncidents, setCriticalIncidents] = useState<any[]>([]);
  const [isLoadingIncidents, setIsLoadingIncidents] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  // Fetch incidents from API
  const fetchIncidents = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/recent-incidents?limit=5');
      const data = await response.json();

      if (data.success) {
        setCriticalIncidents(data.incidents);
        setLastUpdate(new Date().toLocaleTimeString());
      }
    } catch (error) {
      console.error('Failed to fetch incidents:', error);
      // Keep existing data on error
    } finally {
      setIsLoadingIncidents(false);
    }
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    // Initial fetch
    fetchIncidents();

    // Set up auto-refresh
    const interval = setInterval(() => {
      fetchIncidents();
    }, 30000); // 30 seconds

    // Cleanup
    return () => clearInterval(interval);
  }, []);

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
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-danger" />
                <span>Active Security Incidents</span>
              </CardTitle>
              {lastUpdate && (
                <Badge variant="outline" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  Last update: {lastUpdate}
                </Badge>
              )}
            </div>
            <CardDescription>Real-time incident tracking and response • Auto-refresh: 30s</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingIncidents ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 bg-muted/20 rounded-lg border border-border/30 animate-pulse">
                    <div className="h-4 bg-muted/50 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted/30 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : criticalIncidents.length === 0 ? (
              <div className="text-center py-12">
                <Shield className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">No active incidents detected</p>
                <p className="text-sm text-muted-foreground/70 mt-1">System operating normally</p>
              </div>
            ) : (
              <div className="space-y-4">
                {criticalIncidents.map((incident) => (
                  <div 
                    key={incident.id} 
                    className="group relative p-4 bg-card/50 hover:bg-card/80 rounded-xl border border-border/50 hover:border-primary/50 transition-all duration-300 cursor-pointer overflow-hidden"
                    onClick={() => navigate("/incidents")}
                  >
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${
                            incident.severity === 'Critical' ? 'bg-red-500/10 text-red-500' :
                            incident.severity === 'High' ? 'bg-orange-500/10 text-orange-500' :
                            'bg-blue-500/10 text-blue-500'
                          }`}>
                            <Shield className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {incident.type}
                            </h4>
                            <p className="text-xs text-muted-foreground font-mono mt-0.5">
                              {incident.id}
                            </p>
                          </div>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`px-3 py-1 ${
                            incident.severity === 'Critical' ? 'border-red-500/50 text-red-500 bg-red-500/5' :
                            incident.severity === 'High' ? 'border-orange-500/50 text-orange-500 bg-orange-500/5' :
                            'border-blue-500/50 text-blue-500 bg-blue-500/5'
                          }`}
                        >
                          {incident.severity}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm pl-[3.25rem]">
                        <div className="flex items-center space-x-4">
                          <Badge variant="secondary" className={`text-xs ${
                            incident.status === 'Active' ? 'bg-red-500/10 text-red-500 animate-pulse' :
                            incident.status === 'Investigating' ? 'bg-yellow-500/10 text-yellow-500' :
                            'bg-green-500/10 text-green-500'
                          }`}>
                            {incident.status === 'Active' && <div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5" />}
                            {incident.status}
                          </Badge>
                          <span className="text-muted-foreground/60 text-xs flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {incident.time}
                          </span>
                        </div>
                        
                        {/* Arrow icon that appears on hover */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
                          <TrendingUp className="h-4 w-4 text-primary" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            )}
            <div className="flex space-x-2 mt-4">
              <Button size="sm" className="glow-primary" onClick={() => navigate("/incidents")}>
                <Eye className="h-4 w-4 mr-2" />
                View All Incidents
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate("/ai-analysis")}>
                <Search className="h-4 w-4 mr-2" />
                AI Analysis
              </Button>
              <Button variant="outline" size="sm" onClick={handleSendSecurityCode} disabled={isSendingCode}>
                <BarChart3 className="h-4 w-4 mr-2" />
                {isSendingCode ? 'Sending...' : 'Code Weight'}
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