import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Zap, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Play,
  Pause,
  Server,
  Database,
  Cpu,
  Activity
} from "lucide-react";

interface Threat {
  id: string;
  title: string;
  effect: string;
  severity: string;
  timestamp: string;
  status: 'active' | 'resolved';
}

const THREAT_TEMPLATES = [
  {
    title: "Advanced Persistent Threat (APT-29)",
    effect: "Exfiltrating encrypted credentials from domain controller",
    severity: "Critical"
  },
  {
    title: "Zero-Day RCE in WebLogic",
    effect: "Remote code execution detected on primary app server",
    severity: "Critical"
  },
  {
    title: "Volumetric DDoS (Mirai Variant)",
    effect: "Inbound traffic spike 50Gbps - Service degradation imminent",
    severity: "Critical"
  },
  {
    title: "SQL Injection (Blind Boolean)",
    effect: "Database schema enumeration attempt detected",
    severity: "Critical"
  },
  {
    title: "Ransomware Pre-Execution",
    effect: "Suspicious file encryption behavior on file server",
    severity: "Critical"
  },
  {
    title: "Privilege Escalation Attempt",
    effect: "Unauthorized modification of sudoers file",
    severity: "Critical"
  }
];

const AIAnalysis = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [activeThreats, setActiveThreats] = useState<Threat[]>([]);
  const [resolvedThreats, setResolvedThreats] = useState<Threat[]>([]);
  const [threatIndex, setThreatIndex] = useState(0);

  // Simulation Loop
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        // 1. Move oldest active threat to resolved (if any)
        if (activeThreats.length > 0) {
          const threatToResolve = activeThreats[0];
          setResolvedThreats(prev => [
            { ...threatToResolve, status: 'resolved', timestamp: new Date().toLocaleTimeString() },
            ...prev.slice(0, 9) // Keep last 10 resolved
          ]);
          setActiveThreats(prev => prev.slice(1));
        }

        // 2. Add new critical threat
        const template = THREAT_TEMPLATES[threatIndex % THREAT_TEMPLATES.length];
        const newThreat: Threat = {
          id: `THREAT-${Date.now().toString().slice(-6)}`,
          title: template.title,
          effect: template.effect,
          severity: template.severity,
          timestamp: "LIVE",
          status: 'active'
        };

        setActiveThreats(prev => [...prev, newThreat]);
        setThreatIndex(prev => prev + 1);

      }, 3000); // Update every 3 seconds
    }

    return () => clearInterval(interval);
  }, [isRunning, activeThreats, threatIndex]);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            AI Threat Analysis Engine
          </h1>
          <p className="text-muted-foreground">Real-time critical threat detection and automated mitigation</p>
        </div>
        
        <div className="flex items-center space-x-2 bg-muted/30 p-2 rounded-lg border border-border/50">
          <Badge variant="secondary" className="text-xs">
            <Cpu className="h-3 w-3 mr-1" />
            Arpita AI Enhanced
          </Badge>
          <Badge variant="secondary" className="text-xs">
            <Database className="h-3 w-3 mr-1" />
            Vector DB Enabled
          </Badge>
        </div>
      </div>

      {/* Controls */}
      <Card className="card-gradient border-border/50">
        <CardContent className="p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-full ${isRunning ? 'bg-green-500/20 animate-pulse' : 'bg-muted'}`}>
              <Activity className={`h-6 w-6 ${isRunning ? 'text-green-500' : 'text-muted-foreground'}`} />
            </div>
            <div>
              <h3 className="font-semibold">System Status: {isRunning ? 'Monitoring Active' : 'Paused'}</h3>
              <p className="text-sm text-muted-foreground">
                {isRunning ? 'Analyzing incoming traffic streams...' : 'Analysis engine standby'}
              </p>
            </div>
          </div>
          
          <Button 
            size="lg"
            variant={isRunning ? "destructive" : "default"}
            className={isRunning ? "" : "glow-primary"}
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? (
              <>
                <Pause className="h-5 w-5 mr-2" />
                Stop Analysis
              </>
            ) : (
              <>
                <Play className="h-5 w-5 mr-2" />
                Start Analysis
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Critical Threats Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center text-red-500">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Critical Threats Detected
            </h2>
            <Badge variant="outline" className="border-red-500/50 text-red-500">
              {activeThreats.length} Active
            </Badge>
          </div>
          
          <div className="space-y-4 min-h-[400px]">
            {activeThreats.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-border/30 rounded-xl bg-muted/5">
                <Shield className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">No critical threats currently detected</p>
              </div>
            ) : (
              activeThreats.map((threat) => (
                <Card key={threat.id} className="bg-red-500/5 border-red-500/20 animate-in slide-in-from-right duration-500">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="destructive" className="animate-pulse">CRITICAL</Badge>
                        <span className="font-mono text-xs text-red-400">{threat.id}</span>
                      </div>
                      <span className="text-xs font-bold text-red-500 flex items-center">
                        <Activity className="h-3 w-3 mr-1" />
                        LIVE
                      </span>
                    </div>
                    <h3 className="font-bold text-lg mb-1">{threat.title}</h3>
                    <div className="flex items-start space-x-2 text-sm text-muted-foreground bg-background/50 p-2 rounded">
                      <Server className="h-4 w-4 mt-0.5 shrink-0" />
                      <span>Impact: {threat.effect}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Resolved/Saved Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center text-green-500">
              <CheckCircle className="h-5 w-5 mr-2" />
              Resolved & Saved
            </h2>
            <Badge variant="outline" className="border-green-500/50 text-green-500">
              {resolvedThreats.length} Processed
            </Badge>
          </div>

          <div className="space-y-4 min-h-[400px]">
            {resolvedThreats.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-border/30 rounded-xl bg-muted/5">
                <Database className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">No processed threats yet</p>
              </div>
            ) : (
              resolvedThreats.map((threat) => (
                <Card key={threat.id} className="bg-green-500/5 border-green-500/20 animate-in fade-in slide-in-from-left duration-500">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-green-500 border-green-500/30">MITIGATED</Badge>
                        <span className="font-mono text-xs text-muted-foreground">{threat.id}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{threat.timestamp}</span>
                    </div>
                    <h3 className="font-semibold text-base mb-1 text-muted-foreground line-through decoration-green-500/50">
                      {threat.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-xs text-green-600/80">
                      <Database className="h-3 w-3" />
                      <span>Threat signature saved to Vector DB</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AIAnalysis;