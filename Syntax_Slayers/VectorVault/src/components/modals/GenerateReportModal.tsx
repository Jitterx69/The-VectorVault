import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Download, 
  Calendar,
  BarChart3,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GenerateReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GenerateReportModal = ({ open, onOpenChange }: GenerateReportModalProps) => {
  const [reportType, setReportType] = useState("");
  const [timeRange, setTimeRange] = useState("");
  const [sections, setSections] = useState({
    summary: true,
    incidents: true,
    metrics: true,
    threats: true,
    recommendations: false,
    timeline: false
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!reportType || !timeRange) {
      toast({
        title: "Validation Error",
        description: "Please select report type and time range",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    // Simulate report generation progress
    const intervals = [
      { step: "Collecting incident data", progress: 20 },
      { step: "Analyzing security metrics", progress: 40 },
      { step: "Processing threat intelligence", progress: 60 },
      { step: "Generating visualizations", progress: 80 },
      { step: "Finalizing report", progress: 100 }
    ];

    for (let i = 0; i < intervals.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setProgress(intervals[i].progress);
    }

    toast({
      title: "Report Generated Successfully",
      description: `${reportType} report for ${timeRange} has been generated and is ready for download`,
    });

    setIsGenerating(false);
    onOpenChange(false);
  };

  const reportTypes = [
    { value: "executive", label: "Executive Summary", description: "High-level security overview" },
    { value: "technical", label: "Technical Analysis", description: "Detailed technical findings" },
    { value: "incident", label: "Incident Report", description: "Comprehensive incident analysis" },
    { value: "compliance", label: "Compliance Report", description: "Regulatory compliance status" },
    { value: "threat", label: "Threat Intelligence", description: "Current threat landscape" }
  ];

  const timeRanges = [
    { value: "1hour", label: "Last Hour" },
    { value: "6hours", label: "Last 6 Hours" }, 
    { value: "24hours", label: "Last 24 Hours" },
    { value: "7days", label: "Last 7 Days" },
    { value: "30days", label: "Last 30 Days" },
    { value: "custom", label: "Custom Range" }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-primary" />
            <span>Generate Security Report</span>
          </DialogTitle>
          <DialogDescription>
            Create a comprehensive security report based on your selected criteria
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Report Type */}
          <div className="space-y-3">
            <Label>Report Type</Label>
            <div className="grid gap-3">
              {reportTypes.map((type) => (
                <Card 
                  key={type.value}
                  className={`cursor-pointer transition-colors hover:border-primary/50 ${
                    reportType === type.value ? 'border-primary bg-primary/5' : 'card-gradient'
                  }`}
                  onClick={() => setReportType(type.value)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        checked={reportType === type.value} 
                        onChange={() => setReportType(type.value)}
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{type.label}</h4>
                        <p className="text-sm text-muted-foreground">{type.description}</p>
                      </div>
                      <Badge variant="outline">
                        {type.value === 'executive' ? <BarChart3 className="h-3 w-3" /> :
                         type.value === 'technical' ? <Shield className="h-3 w-3" /> :
                         type.value === 'incident' ? <AlertTriangle className="h-3 w-3" /> :
                         type.value === 'compliance' ? <CheckCircle className="h-3 w-3" /> :
                         <FileText className="h-3 w-3" />}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Time Range */}
          <div className="space-y-2">
            <Label htmlFor="timeRange">Time Range</Label>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger>
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                {timeRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{range.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Report Sections */}
          <div className="space-y-3">
            <Label>Include Sections</Label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(sections).map(([key, checked]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox 
                    checked={checked}
                    onCheckedChange={(checked) => setSections(prev => ({ ...prev, [key]: !!checked }))}
                  />
                  <label className="text-sm capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Progress */}
          {isGenerating && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Generating report...</span>
                <span className="text-sm font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {/* Estimated Stats */}
          {reportType && timeRange && !isGenerating && (
            <Card className="card-gradient">
              <CardContent className="p-4">
                <h4 className="font-medium mb-3 flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2 text-primary" />
                  Report Preview
                </h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Incidents:</span>
                    <p className="font-semibold">
                      {timeRange === '1hour' ? '5' : 
                       timeRange === '24hours' ? '23' : 
                       timeRange === '7days' ? '147' : '342'}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Pages:</span>
                    <p className="font-semibold">12-15</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Est. Size:</span>
                    <p className="font-semibold">2.3 MB</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isGenerating}>
              Cancel
            </Button>
            <Button 
              onClick={handleGenerate} 
              disabled={!reportType || !timeRange || isGenerating}
              className="glow-primary"
            >
              {isGenerating ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  <span>Generating...</span>
                </div>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Generate Report
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateReportModal;