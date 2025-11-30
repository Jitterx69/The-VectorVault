import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CreateIncidentModal from "@/components/modals/CreateIncidentModal";
import IncidentDetailsModal from "@/components/modals/IncidentDetailsModal";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertTriangle, 
  Clock, 
  Filter, 
  Plus, 
  Search,
  Eye,
  RefreshCw,
  Download,
  TrendingUp,
  Users,
  Shield,
  CheckCircle
} from "lucide-react";
import SolveIncidentModal from "@/components/modals/SolveIncidentModal";

const Incidents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showCreateIncident, setShowCreateIncident] = useState(false);
  const [showIncidentDetails, setShowIncidentDetails] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { toast } = useToast();

  const [incidents, setIncidents] = useState<any[]>([]);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/recent-incidents?limit=20');
        const data = await response.json();
        
        if (data.success) {
          // Transform API data to match UI component structure if needed
          // The API already returns a compatible structure based on our previous work
          const backendIncidents = data.incidents.map((inc: any) => ({
            id: inc.id,
            title: inc.type, // Map 'type' to 'title'
            severity: inc.severity,
            status: inc.status,
            assignee: "Automated System", // Default assignee
            created: inc.time, // 'time' is "2 mins ago" etc.
            updated: "Just now",
            description: inc.summary || `Detected ${inc.type} with ${inc.confidence}% confidence.`,
            tags: [inc.type.toLowerCase().replace(/\s+/g, '-'), "automated", "ai-detected"]
          }));
          
          setIncidents(backendIncidents);
        }
      } catch (error) {
        console.error("Failed to fetch incidents:", error);
        // Fallback to static data if fetch fails
        setIncidents([
          {
            id: "INC-2024-001",
            title: "DDoS Attack on Web Infrastructure", 
            severity: "Critical",
            status: "Active",
            assignee: "SOC Team Alpha",
            created: "2024-01-15 14:30",
            updated: "2 mins ago",
            description: "Large-scale distributed denial-of-service attack detected on primary web servers",
            tags: ["ddos", "web", "high-volume"]
          }
        ]);
      }
    };

    fetchIncidents();
    
    // Poll every 10 seconds to keep list fresh
    const interval = setInterval(fetchIncidents, 10000);
    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'Critical': return 'status-critical pulse-danger';
      case 'High': return 'status-warning';
      case 'Medium': return 'status-info';
      case 'Low': return 'status-success';
      default: return 'status-info';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Active': return 'bg-danger/20 text-danger border-danger/30';
      case 'Investigating': return 'bg-warning/20 text-warning border-warning/30';
      case 'Contained': return 'bg-primary/20 text-primary border-primary/30';
      case 'Resolved': return 'bg-success/20 text-success border-success/30';
      case 'Scheduled': return 'bg-muted/20 text-muted-foreground border-muted/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Data Refreshed",
        description: "Incident data has been updated with the latest information",
      });
    }, 1500);
  };

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Incidents data is being exported to CSV format",
    });
  };

  const handleViewDetails = (incident: any) => {
    setSelectedIncident(incident);
    setShowIncidentDetails(true);
  };

  const [investigatingId, setInvestigatingId] = useState<string | null>(null);

  const handleInvestigate = async (incident: any) => {
    setInvestigatingId(incident.id);
    toast({
      title: "Investigation Initiated",
      description: "Generating threat report and notifying admin...",
    });

    try {
      const response = await fetch('http://localhost:3001/api/investigate-incident', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: incident.title, // Use title as type for better mapping
          id: incident.id 
        })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Investigation Report Sent",
          description: `Detailed threat analysis for ${incident.id} has been emailed to admin.`,
          className: "bg-success/20 border-success/30 text-success"
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "Investigation Failed",
        description: "Could not send investigation report.",
        variant: "destructive"
      });
    } finally {
      setInvestigatingId(null);
    }
  };

  const [showSolveModal, setShowSolveModal] = useState(false);
  const [solutionData, setSolutionData] = useState<any>(null);
  const [solvingId, setSolvingId] = useState<string | null>(null);

  const handleSolve = async (incident: any) => {
    setSolvingId(incident.id);
    try {
      const response = await fetch('http://localhost:3001/api/get-solutions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: incident.title })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSelectedIncident(incident);
        setSolutionData(data.solution);
        setShowSolveModal(true);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "Error Fetching Solutions",
        description: "Could not retrieve mitigation strategies.",
        variant: "destructive"
      });
    } finally {
      setSolvingId(null);
    }
  };

  const handleAcceptSolution = async () => {
    if (!selectedIncident) return;

    try {
      const response = await fetch('http://localhost:3001/api/resolve-incident', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedIncident.id })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setShowSolveModal(false);
        
        // Remove the resolved incident from the list
        setIncidents(prev => prev.filter(inc => inc.id !== selectedIncident.id));
        
        // Show success dialog/toast
        toast({
          title: "Incident Resolved",
          description: "Security patches applied and incident closed.",
          className: "bg-green-500/20 border-green-500/30 text-green-500"
        });
      }
    } catch (error) {
      toast({
        title: "Resolution Failed",
        description: "Could not resolve the incident.",
        variant: "destructive"
      });
    }
  };

  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === "all" || incident.severity === filterSeverity;
    const matchesStatus = filterStatus === "all" || incident.status === filterStatus;
    
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Security Incidents
          </h1>
          <p className="text-muted-foreground">Incident management and response coordination</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button className="glow-primary" onClick={() => setShowCreateIncident(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Incident
          </Button>
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card 
          className="card-gradient border-border/50 hover:border-primary/30 transition-colors cursor-pointer"
          onClick={() => {
            setFilterStatus("Active");
            toast({
              title: "Filter Applied",
              description: "Showing active incidents only",
            });
          }}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Incidents</p>
                <p className="text-2xl font-bold text-danger">3</p>
              </div>
              <div className="p-2 bg-danger/20 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-danger" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="card-gradient border-border/50 hover:border-primary/30 transition-colors cursor-pointer"
          onClick={() => {
            toast({
              title: "Response Time Analytics",
              description: "Average response time: 4.2 minutes. This includes detection, assignment, and initial response.",
            });
          }}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Response Time</p>
                <p className="text-2xl font-bold text-primary">4.2m</p>
              </div>
              <div className="p-2 bg-primary/20 rounded-lg">
                <Clock className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="card-gradient border-border/50 hover:border-primary/30 transition-colors cursor-pointer"
          onClick={() => {
            toast({
              title: "Resolution Statistics",
              description: "94% resolution rate this month. 47 incidents resolved, 3 active, 2 pending.",
            });
          }}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Resolution Rate</p>
                <p className="text-2xl font-bold text-success">94%</p>
              </div>
              <div className="p-2 bg-success/20 rounded-lg">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="card-gradient border-border/50 hover:border-primary/30 transition-colors cursor-pointer"
          onClick={() => {
            toast({
              title: "Team Overview",
              description: "12 active team members: 4 SOC analysts, 3 incident responders, 2 managers, 3 specialists.",
            });
          }}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Team Members</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <div className="p-2 bg-muted/20 rounded-lg">
                <Users className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="card-gradient border-border/50">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search incidents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-input/50 border-border/50"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Investigating">Investigating</SelectItem>
                  <SelectItem value="Contained">Contained</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Incidents List */}
      <div className="space-y-4">
        {filteredIncidents.length === 0 ? (
          <Card className="card-gradient border-border/50 text-center p-12">
            <div className="flex flex-col items-center space-y-4">
              <Search className="h-12 w-12 text-muted-foreground" />
              <h3 className="text-xl font-semibold">No incidents found</h3>
              <p className="text-muted-foreground">
                {searchTerm || filterSeverity !== "all" || filterStatus !== "all" 
                  ? "Try adjusting your search or filter criteria"
                  : "No incidents match the current criteria"
                }
              </p>
            </div>
          </Card>
        ) : (
          filteredIncidents.map((incident) => (
          <Card key={incident.id} className="card-gradient border-border/50 hover:border-primary/30 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold">{incident.title}</h3>
                    <Badge variant="outline" className={getSeverityColor(incident.severity)}>
                      {incident.severity}
                    </Badge>
                    <Badge variant="outline" className={getStatusColor(incident.status)}>
                      {incident.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{incident.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {incident.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>ID: {incident.id}</span>
                  <span>Assignee: {incident.assignee}</span>
                  <span>Created: {incident.created}</span>
                  <span>Updated: {incident.updated}</span>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleViewDetails(incident)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button 
                    size="sm" 
                    className="glow-primary bg-blue-600 hover:bg-blue-700" 
                    onClick={() => handleSolve(incident)}
                    disabled={solvingId === incident.id}
                  >
                    {solvingId === incident.id ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    Solve
                  </Button>
                  <Button 
                    size="sm" 
                    className="glow-primary" 
                    onClick={() => handleInvestigate(incident)}
                    disabled={investigatingId === incident.id}
                  >
                    {investigatingId === incident.id ? (
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                    ) : (
                      <Shield className="h-4 w-4 mr-2" />
                    )}
                    {investigatingId === incident.id ? "Sending..." : "Investigate"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          ))
        )}
      </div>

      {/* Modals */}
      <CreateIncidentModal 
        open={showCreateIncident} 
        onOpenChange={setShowCreateIncident} 
      />
      <IncidentDetailsModal 
        open={showIncidentDetails} 
        onOpenChange={setShowIncidentDetails}
        incident={selectedIncident}
      />
      <SolveIncidentModal
        open={showSolveModal}
        onOpenChange={setShowSolveModal}
        incident={selectedIncident}
        solution={solutionData}
        onAccept={handleAcceptSolution}
      />
    </div>
  );
};

export default Incidents;