import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Brain, 
  Zap, 
  Target, 
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  TrendingUp,
  Clock,
  Cpu,
  Database,
  Network,
  ArrowRight
} from "lucide-react";

const AIAnalysis = () => {
  const [analysisInput, setAnalysisInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!analysisInput.trim()) return;
    
    setIsAnalyzing(true);
    // Simulate AI analysis delay
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 3000);
  };

  const analysisResults = {
    rootCause: {
      probability: 0.87,
      category: "Network Security",
      description: "DDoS attack utilizing compromised IoT devices in a botnet pattern",
      evidence: [
        "Traffic originated from 15,000+ unique IP addresses",
        "Packet patterns consistent with Mirai botnet variants",
        "Geographically distributed sources across 47 countries",
        "TCP SYN flood with UDP amplification characteristics"
      ]
    },
    recommendations: [
      {
        priority: "Critical",
        action: "Implement rate limiting on ingress traffic",
        confidence: 0.94,
        timeframe: "Immediate",
        complexity: "Low"
      },
      {
        priority: "High", 
        action: "Deploy upstream DDoS protection service",
        confidence: 0.91,
        timeframe: "Within 1 hour",
        complexity: "Medium"
      },
      {
        priority: "Medium",
        action: "Update firewall rules to block known botnet IPs",
        confidence: 0.85,
        timeframe: "Within 4 hours", 
        complexity: "Low"
      },
      {
        priority: "Low",
        action: "Review and strengthen IoT device security policies",
        confidence: 0.78,
        timeframe: "Within 24 hours",
        complexity: "High"
      }
    ],
    similarIncidents: [
      { id: "INC-2023-847", similarity: 0.94, outcome: "Resolved in 2.3 hours" },
      { id: "INC-2023-701", similarity: 0.87, outcome: "Resolved in 1.8 hours" },
      { id: "INC-2023-623", similarity: 0.82, outcome: "Resolved in 3.1 hours" }
    ],
    riskAssessment: {
      currentLevel: "High",
      businessImpact: "Service degradation affecting 23% of users",
      dataExposure: "None detected",
      estimatedCost: "$12,500 per hour of downtime"
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'Critical': return 'status-critical';
      case 'High': return 'status-warning';
      case 'Medium': return 'status-info';
      case 'Low': return 'status-success';
      default: return 'status-info';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          AI-Powered Analysis Engine
        </h1>
        <p className="text-muted-foreground">Advanced machine learning for root cause analysis and incident response</p>
      </div>

      {/* Analysis Input */}
      <Card className="card-gradient border-border/50 glow-primary">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-primary" />
            <span>Incident Analysis Input</span>
          </CardTitle>
          <CardDescription>
            Describe the incident details, symptoms, and any relevant context for AI analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Describe the incident details...&#10;Example: 'Web servers experiencing high load, response times increased from 200ms to 5000ms, multiple user reports of timeouts. Traffic volume 10x normal levels from various IPs.'"
            value={analysisInput}
            onChange={(e) => setAnalysisInput(e.target.value)}
            className="min-h-[120px] bg-input/50 border-border/50 focus:border-primary"
            rows={5}
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                <Cpu className="h-3 w-3 mr-1" />
                GPT-4 Enhanced
              </Badge>
              <Badge variant="secondary" className="text-xs">
                <Database className="h-3 w-3 mr-1" />
                Vector DB Enabled
              </Badge>
            </div>
            <Button 
              onClick={handleAnalyze}
              disabled={!analysisInput.trim() || isAnalyzing}
              className="glow-primary"
            >
              {isAnalyzing ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  <span>Analyzing...</span>
                </div>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Analyze Incident
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {analysisInput && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Root Cause Analysis */}
          <Card className="lg:col-span-2 card-gradient border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-success" />
                <span>Root Cause Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Main Analysis */}
              <div className="p-4 bg-success/10 border border-success/30 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-success">Primary Root Cause</h3>
                  <Badge variant="outline" className="status-success">
                    {Math.round(analysisResults.rootCause.probability * 100)}% confidence
                  </Badge>
                </div>
                <p className="text-sm mb-2">{analysisResults.rootCause.description}</p>
                <Badge variant="secondary" className="text-xs">{analysisResults.rootCause.category}</Badge>
              </div>

              {/* Evidence */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                  Supporting Evidence
                </h4>
                <div className="space-y-2">
                  {analysisResults.rootCause.evidence.map((evidence, index) => (
                    <div key={index} className="flex items-start space-x-2 p-2 bg-muted/20 rounded">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm">{evidence}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center">
                  <Lightbulb className="h-4 w-4 mr-2 text-warning" />
                  Recommended Actions
                </h4>
                <div className="space-y-3">
                  {analysisResults.recommendations.map((rec, index) => (
                    <div key={index} className="p-3 bg-muted/20 rounded-lg border border-border/30">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className={getPriorityColor(rec.priority)}>
                          {rec.priority}
                        </Badge>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <span>{Math.round(rec.confidence * 100)}% confidence</span>
                          <span>•</span>
                          <span>{rec.timeframe}</span>
                        </div>
                      </div>
                      <p className="text-sm mb-2">{rec.action}</p>
                      <Badge variant="secondary" className="text-xs">
                        Complexity: {rec.complexity}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sidebar - Risk & Similar Cases */}
          <div className="space-y-6">
            
            {/* Risk Assessment */}
            <Card className="card-gradient border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2 text-danger" />
                  Risk Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Threat Level</span>
                    <Badge variant="outline" className="status-warning">
                      {analysisResults.riskAssessment.currentLevel}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Business Impact:</span>
                    <p className="text-foreground mt-1">{analysisResults.riskAssessment.businessImpact}</p>
                  </div>
                  
                  <div>
                    <span className="text-muted-foreground">Data Exposure:</span>
                    <p className="text-success mt-1">{analysisResults.riskAssessment.dataExposure}</p>
                  </div>
                  
                  <div>
                    <span className="text-muted-foreground">Cost Impact:</span>
                    <p className="text-warning mt-1">{analysisResults.riskAssessment.estimatedCost}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Similar Incidents */}
            <Card className="card-gradient border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-primary" />
                  Similar Cases
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analysisResults.similarIncidents.map((incident, index) => (
                  <div key={index} className="p-3 bg-muted/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-sm">{incident.id}</span>
                      <Badge variant="outline" className="text-xs">
                        {Math.round(incident.similarity * 100)}%
                      </Badge>
                    </div>
                    <p className="text-xs text-success">{incident.outcome}</p>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full">
                  View All Similar Cases
                  <ArrowRight className="h-3 w-3 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Analysis Stats */}
            <Card className="card-gradient border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Analysis Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Processing Time</span>
                  <span>2.4s</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Models Used</span>
                  <span>4</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Data Points</span>
                  <span>847</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Accuracy Rate</span>
                  <span className="text-success">96.2%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {!analysisInput && (
        <Card className="card-gradient border-border/50 text-center p-12">
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-primary/20 rounded-full glow-primary">
              <Brain className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">AI Analysis Ready</h3>
            <p className="text-muted-foreground max-w-md">
              Provide incident details above to get AI-powered root cause analysis and recommended response actions
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AIAnalysis;