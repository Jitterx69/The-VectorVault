import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Search, 
  Filter, 
  Download,
  RefreshCw,
  Clock,
  Server,
  Network,
  Database,
  AlertCircle,
  CheckCircle,
  Info,
  XCircle,
  ChevronDown
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const SystemLogs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [logLevel, setLogLevel] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [displayCount, setDisplayCount] = useState(6);
  
  const { toast } = useToast();

  const logEntries = [
    {
      id: "log-001",
      timestamp: "2024-01-15 14:32:45.123",
      level: "ERROR",
      source: "web-server-01",
      component: "nginx",
      message: "Connection timeout to upstream server 192.168.1.100:8080",
      details: "upstream timed out (110: Connection timed out) while connecting to upstream",
      tags: ["connection", "timeout", "upstream"],
      count: 47
    },
    {
      id: "log-002", 
      timestamp: "2024-01-15 14:32:43.891",
      level: "WARN",
      source: "api-gateway",
      component: "auth-service",
      message: "Failed login attempt from IP 203.45.67.89",
      details: "Invalid credentials for user 'admin', attempt #3 in last 5 minutes",
      tags: ["auth", "failed-login", "security"],
      count: 12
    },
    {
      id: "log-003",
      timestamp: "2024-01-15 14:32:41.567", 
      level: "INFO",
      source: "database-primary",
      component: "postgresql",
      message: "Query executed successfully",
      details: "SELECT * FROM user_sessions WHERE last_activity > '2024-01-15 14:30:00' - Execution time: 0.034s",
      tags: ["database", "query", "performance"],
      count: 1
    },
    {
      id: "log-004",
      timestamp: "2024-01-15 14:32:38.234",
      level: "ERROR", 
      source: "firewall-01",
      component: "iptables",
      message: "Blocked suspicious traffic pattern",
      details: "Dropped 1,247 packets from 45.123.67.89 - Pattern matches known DDoS signature",
      tags: ["firewall", "blocked", "ddos", "security"],
      count: 1247
    },
    {
      id: "log-005",
      timestamp: "2024-01-15 14:32:35.678",
      level: "WARN",
      source: "load-balancer",
      component: "haproxy", 
      message: "Backend server health check failed",
      details: "Server web-03.internal (192.168.1.103:80) is DOWN - HTTP 503 Service Unavailable",
      tags: ["health-check", "backend", "unavailable"],
      count: 3
    },
    {
      id: "log-006",
      timestamp: "2024-01-15 14:32:32.445",
      level: "INFO",
      source: "monitoring-service",
      component: "prometheus",
      message: "Metrics collection completed", 
      details: "Scraped 2,847 metrics from 15 targets in 1.2s - All targets healthy",
      tags: ["monitoring", "metrics", "healthy"],
      count: 1
    }
  ];

  const logStats = {
    total: 15847,
    error: 234,
    warning: 1056,
    info: 14557,
    sources: 12,
    avgPerMinute: 42
  };

  const getLevelIcon = (level: string) => {
    switch(level) {
      case 'ERROR': return <XCircle className="h-4 w-4 text-danger" />;
      case 'WARN': return <AlertCircle className="h-4 w-4 text-warning" />;
      case 'INFO': return <CheckCircle className="h-4 w-4 text-success" />;
      default: return <Info className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch(level) {
      case 'ERROR': return 'status-critical';
      case 'WARN': return 'status-warning';
      case 'INFO': return 'status-success';
      default: return 'status-info';
    }
  };

  const getSourceIcon = (source: string) => {
    if (source.includes('server') || source.includes('nginx')) return <Server className="h-4 w-4" />;
    if (source.includes('database')) return <Database className="h-4 w-4" />;
    if (source.includes('firewall') || source.includes('gateway')) return <Network className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Logs Refreshed",
        description: "Latest log entries have been loaded from all sources",
      });
    }, 1500);
  };

  const handleExport = (format: string) => {
    toast({
      title: "Export Started",
      description: `System logs are being exported in ${format.toUpperCase()} format`,
    });
  };

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 6);
    toast({
      title: "Loading More Logs",
      description: "Additional log entries are being loaded",
    });
  };

  const filteredLogs = logEntries.filter(log => {
    const matchesSearch = 
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.component.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLevel = logLevel === "all" || log.level.toLowerCase() === logLevel.toLowerCase();
    const matchesSource = sourceFilter === "all" || log.source.toLowerCase().includes(sourceFilter.toLowerCase());
    
    return matchesSearch && matchesLevel && matchesSource;
  }).slice(0, displayCount);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            System Logs
          </h1>
          <p className="text-muted-foreground">Real-time log monitoring and analysis across all system components</p>
        </div>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                <Download className="h-4 w-4 mr-2" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('json')}>
                <Download className="h-4 w-4 mr-2" />
                Export as JSON
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('xml')}>
                <Download className="h-4 w-4 mr-2" />
                Export as XML
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('pdf')}>
                <Download className="h-4 w-4 mr-2" />
                Export as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Log Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card 
          className="card-gradient border-border/50 hover:border-primary/30 transition-colors cursor-pointer"
          onClick={() => {
            toast({
              title: "Total Log Overview",
              description: `${logStats.total.toLocaleString()} logs processed today. Distribution: 92% Info, 6.7% Warnings, 1.3% Errors.`,
            });
          }}
        >
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{logStats.total.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Logs</p>
          </CardContent>
        </Card>
        
        <Card 
          className="card-gradient border-border/50 hover:border-primary/30 transition-colors cursor-pointer"
          onClick={() => {
            setLogLevel("error");
            toast({
              title: "Error Filter Applied",
              description: "Showing error-level logs only",
            });
          }}
        >
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-danger">{logStats.error}</p>
            <p className="text-xs text-muted-foreground">Errors</p>
          </CardContent>
        </Card>
        
        <Card 
          className="card-gradient border-border/50 hover:border-primary/30 transition-colors cursor-pointer"
          onClick={() => {
            setLogLevel("warn");
            toast({
              title: "Warning Filter Applied",
              description: "Showing warning-level logs only",
            });
          }}
        >
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-warning">{logStats.warning.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Warnings</p>
          </CardContent>
        </Card>
        
        <Card 
          className="card-gradient border-border/50 hover:border-primary/30 transition-colors cursor-pointer"
          onClick={() => {
            setLogLevel("info");
            toast({
              title: "Info Filter Applied", 
              description: "Showing info-level logs only",
            });
          }}
        >
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-success">{logStats.info.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Info</p>
          </CardContent>
        </Card>
        
        <Card 
          className="card-gradient border-border/50 hover:border-primary/30 transition-colors cursor-pointer"
          onClick={() => {
            toast({
              title: "Source Analytics",
              description: "12 active sources: 4 web servers, 3 databases, 2 firewalls, 1 load balancer, 2 other services.",
            });
          }}
        >
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{logStats.sources}</p>
            <p className="text-xs text-muted-foreground">Sources</p>
          </CardContent>
        </Card>
        
        <Card 
          className="card-gradient border-border/50 hover:border-primary/30 transition-colors cursor-pointer"
          onClick={() => {
            toast({
              title: "Throughput Analytics",
              description: `${logStats.avgPerMinute} logs/minute average. Peak: 127/min at 14:30. Current rate is normal.`,
            });
          }}
        >
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{logStats.avgPerMinute}</p>
            <p className="text-xs text-muted-foreground">Logs/Min</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="card-gradient border-border/50">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search logs by message, source, or component..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-input/50 border-border/50"
              />
            </div>
            <div className="flex gap-2">
              <Select value={logLevel} onValueChange={setLogLevel}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="error">Errors Only</SelectItem>
                  <SelectItem value="warn">Warnings</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="web">Web Servers</SelectItem>
                  <SelectItem value="database">Database</SelectItem>
                  <SelectItem value="firewall">Firewall</SelectItem>
                  <SelectItem value="api">API Gateway</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Log Entries */}
      <div className="space-y-2">
        {filteredLogs.length === 0 ? (
          <Card className="card-gradient border-border/50 text-center p-12">
            <div className="flex flex-col items-center space-y-4">
              <Search className="h-12 w-12 text-muted-foreground" />
              <h3 className="text-xl font-semibold">No logs found</h3>
              <p className="text-muted-foreground">
                {searchTerm || logLevel !== "all" || sourceFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "No logs match the current criteria"
                }
              </p>
            </div>
          </Card>
        ) : (
          filteredLogs.map((log) => (
          <Card key={log.id} className="card-gradient border-border/50 hover:border-primary/30 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                
                {/* Timestamp & Level */}
                <div className="flex-shrink-0 text-right">
                  <div className="flex items-center space-x-2 mb-1">
                    {getLevelIcon(log.level)}
                    <Badge variant="outline" className={getLevelColor(log.level)}>
                      {log.level}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">
                    <Clock className="h-3 w-3 inline mr-1" />
                    {log.timestamp}
                  </div>
                  {log.count > 1 && (
                    <Badge variant="secondary" className="text-xs mt-1">
                      ×{log.count}
                    </Badge>
                  )}
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      {getSourceIcon(log.source)}
                      <span className="font-mono">{log.source}</span>
                      <span>•</span>
                      <span>{log.component}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm font-medium mb-2">{log.message}</p>
                  
                  <div className="bg-muted/20 p-2 rounded text-xs font-mono mb-2 matrix-text">
                    {log.details}
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {log.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex-shrink-0">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Search className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          ))
        )}
      </div>

      {/* Load More */}
      {filteredLogs.length > 0 && displayCount < logEntries.length && (
        <div className="text-center">
          <Button variant="outline" className="glow-primary" onClick={handleLoadMore}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Load More Logs ({Math.min(6, logEntries.length - displayCount)} more)
          </Button>
        </div>
      )}

      {/* Real-time Status */}
      <Card className="card-gradient border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">Log Collection Active</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">Real-time Processing</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-warning rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">3 Critical Patterns Detected</span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Buffer: 2,847 logs | Processing Rate: 42/min | Retention: 30 days
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemLogs;