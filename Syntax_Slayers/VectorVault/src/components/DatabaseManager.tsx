import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useTiDBConnection } from "@/hooks/use-tidb";
import { apiClient } from "@/lib/api";

import { 
  Database, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Download,
  Upload,
  TestTube
} from "lucide-react";

const DatabaseManager = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const { toast } = useToast();
  const { isConnected, isConnecting, error: connectionError, connect, disconnect } = useTiDBConnection();

  const handleSeedDatabase = async () => {
    if (!isConnected) {
      toast({
        title: "Not Connected",
        description: "Please connect to TiDB Serverless first",
        variant: "destructive",
      });
      return;
    }

    setIsSeeding(true);
    try {
      const result = await apiClient.seedData();
      if (result.success) {
        toast({
          title: result.mock ? "Mock Data Ready" : "Database Seeded",
          description: result.mock 
            ? "Mock data is ready for testing. 2 sample incidents available."
            : "Sample incident data has been added to the database",
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({
        title: "Seeding Failed",
        description: error instanceof Error ? error.message : "Failed to seed database",
        variant: "destructive",
      });
    } finally {
      setIsSeeding(false);
    }
  };

  const handleRefreshConnection = async () => {
    try {
      await disconnect();
      await connect();
      toast({
        title: "Connection Refreshed",
        description: "Successfully reconnected to TiDB Serverless",
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: error instanceof Error ? error.message : "Failed to refresh connection",
        variant: "destructive",
      });
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      const result = await apiClient.testConnection();
      if (result.success) {
        toast({
          title: "Connection Test Successful",
          description: result.mock 
            ? `Mock mode active! Found ${result.incidents} incidents, ${result.vectorized} vectorized`
            : `TiDB Serverless connected! Found ${result.incidents} incidents, ${result.vectorized} vectorized`,
        });
      } else {
        toast({
          title: "Connection Test Failed",
          description: "Check your TiDB Serverless credentials and connection",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Test Failed",
        description: error instanceof Error ? error.message : "Connection test failed",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card className="card-gradient border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Database className="h-5 w-5 text-primary" />
          <span>Database Management</span>
        </CardTitle>
        <CardDescription>
          Manage TiDB Serverless connection and seed sample data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
          <div className="flex items-center space-x-2">
            {isConnecting ? (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            ) : isConnected ? (
              <CheckCircle className="h-4 w-4 text-success" />
            ) : (
              <AlertCircle className="h-4 w-4 text-destructive" />
            )}
            <span className="font-medium">
              {isConnecting ? "Connecting..." : isConnected ? "Mock Mode Active" : "Disconnected"}
            </span>
          </div>
          <Badge variant={isConnected ? "default" : "secondary"}>
            TiDB Serverless
          </Badge>
        </div>

        {/* Connection Error */}
        {connectionError && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center space-x-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{connectionError}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handleTestConnection}
            disabled={isTesting}
            variant="outline"
            size="sm"
          >
            {isTesting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <TestTube className="h-4 w-4 mr-2" />
                Test Connection
              </>
            )}
          </Button>

          <Button
            onClick={handleRefreshConnection}
            disabled={isConnecting}
            variant="outline"
            size="sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Connection
          </Button>

          <Button
            onClick={handleSeedDatabase}
            disabled={!isConnected || isSeeding}
            className="glow-primary"
            size="sm"
          >
            {isSeeding ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Seeding...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Seed Sample Data
              </>
            )}
          </Button>
        </div>

        {/* Information */}
        <div className="text-sm text-muted-foreground space-y-1">
          <p>• Sample data includes 10 realistic security incidents</p>
          <p>• Each incident is automatically vectorized using hash-based embeddings</p>
          <p>• Data includes various security categories and severity levels</p>
          <p>• OpenAI integration disabled - using local embedding generation</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DatabaseManager;
