import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import DatabaseManager from "@/components/DatabaseManager";

import { 
  Settings as SettingsIcon, 
  Database, 
  Shield, 
  Bell,
  Users,
  Key,
  Globe,
  Zap,
  Save,
  TestTube,
  RefreshCw,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [settings, setSettings] = useState({
    // Database Settings
    tidbHost: "gateway01.us-west-2.prod.aws.tidbcloud.com",
    tidbPort: "4000",
    tidbDatabase: "vectorvault_security",
    
    // Security Settings
    enableMFA: true,
    sessionTimeout: "30",
    maxLoginAttempts: "3",
    
    // Notification Settings
    emailAlerts: true,
    slackIntegration: false,
    criticalThreshold: "high",
    
    // AI Settings
    aiModel: "gpt-4",
    vectorDimensions: "1536",
    similarityThreshold: "0.8",
    
    // System Settings
    logRetention: "30",
    backupFrequency: "daily",
    autoIncidentCreation: true
  });

  const handleSave = async () => {
    setIsLoading(true);
    
    // Simulate save operation
    setTimeout(() => {
      toast({
        title: "Settings Saved",
        description: "All configuration changes have been applied successfully",
      });
      setIsLoading(false);
    }, 1500);
  };

  const handleTestConnection = async (type: string) => {
    toast({
      title: "Testing Connection",
      description: `Testing ${type} connection...`,
    });
    
    // Simulate connection test
    setTimeout(() => {
      toast({
        title: "Connection Successful",
        description: `${type} connection established successfully`,
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            System Settings
          </h1>
          <p className="text-muted-foreground">Configure VectorVault security and integration settings</p>
        </div>
        <Button 
          onClick={handleSave}
          disabled={isLoading}
          className="glow-primary"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              <span>Saving...</span>
            </div>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {/* Database Management */}
      <DatabaseManager />

      {/* Database Configuration */}
      <Card className="card-gradient border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-primary" />
            <span>TiDB Serverless Configuration</span>
          </CardTitle>
          <CardDescription>
            Vector database connection settings for incident storage and search
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tidb-host">Database Host</Label>
              <Input
                id="tidb-host"
                value={settings.tidbHost}
                onChange={(e) => setSettings({...settings, tidbHost: e.target.value})}
                className="font-mono text-sm bg-input/50 border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tidb-port">Port</Label>
              <Input
                id="tidb-port"
                value={settings.tidbPort}
                onChange={(e) => setSettings({...settings, tidbPort: e.target.value})}
                className="bg-input/50 border-border/50"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="tidb-database">Database Name</Label>
              <Input
                id="tidb-database"
                value={settings.tidbDatabase}
                onChange={(e) => setSettings({...settings, tidbDatabase: e.target.value})}
                className="bg-input/50 border-border/50"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleTestConnection("Database")}
            >
              <TestTube className="h-4 w-4 mr-2" />
              Test Connection
            </Button>
            <Badge variant="outline" className="status-success">
              <Database className="h-3 w-3 mr-1" />
              Connected
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="card-gradient border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-primary" />
            <span>Security Configuration</span>
          </CardTitle>
          <CardDescription>
            Authentication and access control settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Multi-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">Require MFA for all user logins</p>
            </div>
            <Switch
              checked={settings.enableMFA}
              onCheckedChange={(checked) => setSettings({...settings, enableMFA: checked})}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
              <Input
                id="session-timeout"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => setSettings({...settings, sessionTimeout: e.target.value})}
                className="bg-input/50 border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-attempts">Max Login Attempts</Label>
              <Input
                id="max-attempts"
                type="number"
                value={settings.maxLoginAttempts}
                onChange={(e) => setSettings({...settings, maxLoginAttempts: e.target.value})}
                className="bg-input/50 border-border/50"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI & Vector Settings */}
      <Card className="card-gradient border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-primary" />
            <span>AI Engine Configuration</span>
          </CardTitle>
          <CardDescription>
            Machine learning and vector search parameters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ai-model">AI Model</Label>
              <select 
                id="ai-model"
                className="w-full px-3 py-2 bg-input/50 border border-border/50 rounded-md"
                value={settings.aiModel}
                onChange={(e) => setSettings({...settings, aiModel: e.target.value})}
              >
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="claude-3">Claude-3</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="vector-dimensions">Vector Dimensions</Label>
              <Input
                id="vector-dimensions"
                value={settings.vectorDimensions}
                onChange={(e) => setSettings({...settings, vectorDimensions: e.target.value})}
                className="bg-input/50 border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="similarity-threshold">Similarity Threshold</Label>
              <Input
                id="similarity-threshold"
                type="number"
                step="0.1"
                min="0"
                max="1"
                value={settings.similarityThreshold}
                onChange={(e) => setSettings({...settings, similarityThreshold: e.target.value})}
                className="bg-input/50 border-border/50"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="card-gradient border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-primary" />
            <span>Notification Settings</span>
          </CardTitle>
          <CardDescription>
            Alert and notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Alerts</Label>
              <p className="text-sm text-muted-foreground">Send incident notifications via email</p>
            </div>
            <Switch
              checked={settings.emailAlerts}
              onCheckedChange={(checked) => setSettings({...settings, emailAlerts: checked})}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Slack Integration</Label>
              <p className="text-sm text-muted-foreground">Post alerts to Slack channels</p>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={settings.slackIntegration}
                onCheckedChange={(checked) => setSettings({...settings, slackIntegration: checked})}
              />
              {settings.slackIntegration && (
                <Button variant="outline" size="sm">Configure</Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="critical-threshold">Alert Threshold</Label>
            <select 
              id="critical-threshold"
              className="w-full px-3 py-2 bg-input/50 border border-border/50 rounded-md"
              value={settings.criticalThreshold}
              onChange={(e) => setSettings({...settings, criticalThreshold: e.target.value})}
            >
              <option value="low">Low and above</option>
              <option value="medium">Medium and above</option>
              <option value="high">High and above</option>
              <option value="critical">Critical only</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card className="card-gradient border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <SettingsIcon className="h-5 w-5 text-primary" />
            <span>System Configuration</span>
          </CardTitle>
          <CardDescription>
            General system and maintenance settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="log-retention">Log Retention (days)</Label>
              <Input
                id="log-retention"
                type="number"
                value={settings.logRetention}
                onChange={(e) => setSettings({...settings, logRetention: e.target.value})}
                className="bg-input/50 border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="backup-frequency">Backup Frequency</Label>
              <select 
                id="backup-frequency"
                className="w-full px-3 py-2 bg-input/50 border border-border/50 rounded-md"
                value={settings.backupFrequency}
                onChange={(e) => setSettings({...settings, backupFrequency: e.target.value})}
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto Incident Creation</Label>
              <p className="text-sm text-muted-foreground">Automatically create incidents from critical alerts</p>
            </div>
            <Switch
              checked={settings.autoIncidentCreation}
              onCheckedChange={(checked) => setSettings({...settings, autoIncidentCreation: checked})}
            />
          </div>
        </CardContent>
      </Card>

      {/* Integration Status */}
      <Card className="card-gradient border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-primary" />
            <span>External Integrations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-muted/20 rounded-lg border border-border/30">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Jira</h4>
                <Badge variant="outline" className="status-success">Connected</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2">Automatic ticket creation</p>
              <Button variant="ghost" size="sm">Configure</Button>
            </div>
            
            <div className="p-4 bg-muted/20 rounded-lg border border-border/30">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">PagerDuty</h4>
                <Badge variant="outline" className="status-warning">Disconnected</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2">On-call escalation</p>
              <Button variant="ghost" size="sm">Setup</Button>
            </div>
            
            <div className="p-4 bg-muted/20 rounded-lg border border-border/30">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Splunk</h4>
                <Badge variant="outline" className="status-success">Connected</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2">Log aggregation</p>
              <Button variant="ghost" size="sm">Configure</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="card-gradient border-danger/30">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-danger">
            <AlertTriangle className="h-5 w-5" />
            <span>Danger Zone</span>
          </CardTitle>
          <CardDescription>
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-danger/10 border border-danger/20 rounded-lg">
            <div>
              <h4 className="font-medium text-danger">Reset All Settings</h4>
              <p className="text-sm text-muted-foreground">Restore all settings to default values</p>
            </div>
            <Button variant="destructive" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-danger/10 border border-danger/20 rounded-lg">
            <div>
              <h4 className="font-medium text-danger">Clear All Data</h4>
              <p className="text-sm text-muted-foreground">Permanently delete all incidents and logs</p>
            </div>
            <Button variant="destructive" size="sm">
              Clear Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;