import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Activity, Globe, MapPin, Clock, Shield, AlertTriangle, Search, Filter } from "lucide-react";

interface ActiveConnectionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ActiveConnectionsModal = ({ open, onOpenChange }: ActiveConnectionsModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const connections = [
    {
      id: "conn-001",
      ip: "192.168.1.100",
      location: "New York, US",
      type: "Web Browser",
      protocol: "HTTPS",
      port: 443,
      duration: "2h 15m",
      status: "Active",
      risk: "Low",
      bandwidth: "2.3 MB/s"
    },
    {
      id: "conn-002", 
      ip: "203.45.67.89",
      location: "London, UK",
      type: "API Client",
      protocol: "HTTPS",
      port: 443,
      duration: "45m",
      status: "Active",
      risk: "Low",
      bandwidth: "156 KB/s"
    },
    {
      id: "conn-003",
      ip: "45.123.67.89",
      location: "Unknown",
      type: "Unknown",
      protocol: "TCP",
      port: 80,
      duration: "3m",
      status: "Suspicious",
      risk: "High",
      bandwidth: "5.2 MB/s"
    },
    {
      id: "conn-004",
      ip: "10.0.0.50",
      location: "Internal Network",
      type: "Database",
      protocol: "PostgreSQL",
      port: 5432,
      duration: "6h 22m",
      status: "Active",
      risk: "Low",
      bandwidth: "890 KB/s"
    },
    {
      id: "conn-005",
      ip: "172.16.0.25",
      location: "Office Network",
      type: "SSH Client",
      protocol: "SSH",
      port: 22,
      duration: "1h 8m",
      status: "Active",
      risk: "Medium",
      bandwidth: "12 KB/s"
    },
    {
      id: "conn-006",
      ip: "8.8.8.8",
      location: "Mountain View, US",
      type: "DNS Query",
      protocol: "DNS",
      port: 53,
      duration: "ongoing",
      status: "Active",
      risk: "Low",
      bandwidth: "2 KB/s"
    }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Active': return 'status-success';
      case 'Suspicious': return 'status-critical';
      case 'Blocked': return 'status-warning';
      default: return 'status-info';
    }
  };

  const getRiskColor = (risk: string) => {
    switch(risk) {
      case 'High': return 'text-danger';
      case 'Medium': return 'text-warning';
      case 'Low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const filteredConnections = connections.filter(conn => {
    const matchesSearch = 
      conn.ip.includes(searchTerm) ||
      conn.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conn.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "all" || 
      conn.type.toLowerCase().includes(filterType.toLowerCase()) ||
      (filterType === "suspicious" && conn.status === "Suspicious");
    
    return matchesSearch && matchesType;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-primary" />
            <span>Active Connections Monitor</span>
          </DialogTitle>
          <DialogDescription>
            Real-time network connection monitoring and analysis
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Connection Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="card-gradient border-border/50">
              <CardContent className="p-4 text-center">
                <div className="p-2 bg-primary/20 rounded-lg mb-2 inline-block">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <p className="text-2xl font-bold">1,247</p>
                <p className="text-sm text-muted-foreground">Total Connections</p>
              </CardContent>
            </Card>
            
            <Card className="card-gradient border-border/50">
              <CardContent className="p-4 text-center">
                <div className="p-2 bg-success/20 rounded-lg mb-2 inline-block">
                  <Shield className="h-6 w-6 text-success" />
                </div>
                <p className="text-2xl font-bold text-success">1,203</p>
                <p className="text-sm text-muted-foreground">Secure Connections</p>
              </CardContent>
            </Card>

            <Card className="card-gradient border-border/50">
              <CardContent className="p-4 text-center">
                <div className="p-2 bg-warning/20 rounded-lg mb-2 inline-block">
                  <AlertTriangle className="h-6 w-6 text-warning" />
                </div>
                <p className="text-2xl font-bold text-warning">21</p>
                <p className="text-sm text-muted-foreground">Suspicious</p>
              </CardContent>
            </Card>

            <Card className="card-gradient border-border/50">
              <CardContent className="p-4 text-center">
                <div className="p-2 bg-danger/20 rounded-lg mb-2 inline-block">
                  <Globe className="h-6 w-6 text-danger" />
                </div>
                <p className="text-2xl font-bold text-danger">23</p>
                <p className="text-sm text-muted-foreground">Blocked IPs</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="card-gradient border-border/50">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search by IP, location, or connection type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-input/50 border-border/50"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="web">Web Browser</SelectItem>
                      <SelectItem value="api">API Client</SelectItem>
                      <SelectItem value="database">Database</SelectItem>
                      <SelectItem value="ssh">SSH</SelectItem>
                      <SelectItem value="suspicious">Suspicious</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Connections List */}
          <div className="space-y-3">
            {filteredConnections.map((connection) => (
              <Card key={connection.id} className="card-gradient border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          connection.status === 'Active' ? 'bg-success animate-pulse' :
                          connection.status === 'Suspicious' ? 'bg-danger animate-pulse' :
                          'bg-muted'
                        }`}></div>
                        <div>
                          <h3 className="font-semibold font-mono">{connection.ip}</h3>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3" />
                              <span>{connection.location}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{connection.duration}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <p className="text-sm font-medium">{connection.type}</p>
                        <p className="text-xs text-muted-foreground">
                          {connection.protocol}:{connection.port}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm font-mono">{connection.bandwidth}</p>
                        <p className="text-xs text-muted-foreground">Bandwidth</p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className={getStatusColor(connection.status)}>
                          {connection.status}
                        </Badge>
                        <Badge variant="outline" className={`border-current ${getRiskColor(connection.risk)}`}>
                          {connection.risk} Risk
                        </Badge>
                      </div>

                      <div className="flex space-x-1">
                        {connection.status === 'Suspicious' && (
                          <Button variant="outline" size="sm" className="text-danger border-danger/30">
                            Block
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Connection Geographic Distribution */}
          <Card className="card-gradient border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Geographic Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">647</p>
                  <p className="text-sm text-muted-foreground">North America</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-success">412</p>
                  <p className="text-sm text-muted-foreground">Europe</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-warning">188</p>
                  <p className="text-sm text-muted-foreground">Asia Pacific</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ActiveConnectionsModal;