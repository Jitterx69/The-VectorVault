import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  AlertTriangle, 
  Clock, 
  User, 
  FileText, 
  Tag,
  Activity,
  Shield,
  ExternalLink
} from "lucide-react";

interface Incident {
  id: string;
  title: string;
  severity: string;
  status: string;
  assignee: string;
  created: string;
  updated: string;
  description: string;
  tags: string[];
}

interface IncidentDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  incident: Incident | null;
}

const IncidentDetailsModal = ({ open, onOpenChange, incident }: IncidentDetailsModalProps) => {
  if (!incident) return null;

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

  const timeline = [
    {
      time: "2024-01-15 14:35:22",
      action: "Incident escalated to SOC Team Alpha",
      user: "System Auto-Escalation",
      type: "escalation"
    },
    {
      time: "2024-01-15 14:32:15", 
      action: "Initial response team assigned",
      user: "Jane Smith",
      type: "assignment"
    },
    {
      time: "2024-01-15 14:30:45",
      action: "Incident created and triaged",
      user: "Automated Detection System",
      type: "creation"
    }
  ];

  const affectedSystems = [
    { name: "Web Server Cluster", status: "Degraded", impact: "High" },
    { name: "Load Balancer", status: "Operational", impact: "Low" },
    { name: "Database Primary", status: "Operational", impact: "Medium" },
    { name: "CDN Edge Nodes", status: "Degraded", impact: "High" }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            <span>Incident Details: {incident.id}</span>
          </DialogTitle>
          <DialogDescription>
            Comprehensive incident information and response timeline
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="card-gradient">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Severity</span>
                </div>
                <Badge variant="outline" className={getSeverityColor(incident.severity)}>
                  {incident.severity}
                </Badge>
              </CardContent>
            </Card>

            <Card className="card-gradient">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Activity className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Status</span>
                </div>
                <Badge variant="outline" className={getStatusColor(incident.status)}>
                  {incident.status}
                </Badge>
              </CardContent>
            </Card>

            <Card className="card-gradient">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <User className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Assignee</span>
                </div>
                <span className="text-sm">{incident.assignee}</span>
              </CardContent>
            </Card>
          </div>

          {/* Title and Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">{incident.title}</h3>
            <p className="text-muted-foreground text-sm mb-4">{incident.description}</p>
            
            <div className="flex flex-wrap gap-2">
              {incident.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Timeline */}
            <div>
              <h4 className="font-semibold mb-4 flex items-center">
                <Clock className="h-4 w-4 mr-2 text-primary" />
                Incident Timeline
              </h4>
              <div className="space-y-3">
                {timeline.map((event, index) => (
                  <div key={index} className="flex space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{event.action}</p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <span>{event.user}</span>
                        <span>•</span>
                        <span>{event.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Affected Systems */}
            <div>
              <h4 className="font-semibold mb-4 flex items-center">
                <Shield className="h-4 w-4 mr-2 text-primary" />
                Affected Systems
              </h4>
              <div className="space-y-2">
                {affectedSystems.map((system, index) => (
                  <Card key={index} className="card-gradient">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{system.name}</span>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant="outline" 
                            className={system.status === 'Operational' ? 'status-success' : 'status-warning'}
                          >
                            {system.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Impact: {system.impact}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center">
              <FileText className="h-4 w-4 mr-2 text-primary" />
              Incident Metadata
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Incident ID:</span>
                <p className="font-mono">{incident.id}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Created:</span>
                <p>{incident.created}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Last Updated:</span>
                <p>{incident.updated}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Response Time:</span>
                <p className="text-success">2.3 minutes</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button className="glow-primary">
              <Shield className="h-4 w-4 mr-2" />
              Investigate Further
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IncidentDetailsModal;