import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import AdvancedFiltersModal from "@/components/modals/AdvancedFiltersModal";
import { useToast } from "@/hooks/use-toast";
import { useTiDBConnection, useVectorSearch, useSearchStats } from "@/hooks/use-tidb";
import { 
  Search, 
  Database, 
  Zap, 
  Filter,
  History,
  Sparkles,
  ArrowRight,
  Clock,
  Target,
  Crosshair,
  AlertCircle,
  CheckCircle
} from "lucide-react";

const VectorSearch = () => {
  const [part1, setPart1] = useState("");
  const [part2, setPart2] = useState("");
  const [part3, setPart3] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<any>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [predictionResult, setPredictionResult] = useState<any>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionError, setPredictionError] = useState<string | null>(null);
  
  const { toast } = useToast();
  const { isConnected, isConnecting, error: connectionError } = useTiDBConnection();
  const { isSearching, searchResults, searchError, performSearch, clearSearch } = useVectorSearch();
  const { stats, isLoading: statsLoading } = useSearchStats();

  const handleSearch = async () => {
    const searchQuery = `${part1} ${part2} ${part3}`.trim();
    if (!searchQuery) return;
    
    setIsPredicting(true);
    setPredictionError(null);
    setPredictionResult(null);

    try {
      // Call ML prediction endpoint
      const response = await fetch('http://localhost:3001/api/predict-attack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ part1, part2, part3 })
      });

      if (!response.ok) {
        throw new Error('Prediction failed');
      }

      const data = await response.json();
      
      if (data.success) {
        setPredictionResult(data);
        
        // Add to recent searches
        if (!recentSearches.includes(searchQuery)) {
          setRecentSearches(prev => [searchQuery, ...prev.slice(0, 4)]);
        }

        toast({
          title: "Attack Predicted",
          description: `Identified as ${data.prediction.attackName} with ${Math.round(data.prediction.confidence * 100)}% confidence`,
        });
      } else {
        throw new Error(data.error || 'Prediction failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Prediction failed';
      setPredictionError(errorMessage);
      toast({
        title: "Prediction Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsPredicting(false);
    }
  };

  // Initialize with some default recent searches
  useEffect(() => {
    if (recentSearches.length === 0) {
      setRecentSearches([
        "1 * *",
        "0 * *",
        "0 * *",
        "0 * *",
        "1 * *"
      ]);
    }
  }, [recentSearches.length]);

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 0.9) return "text-success";
    if (similarity >= 0.8) return "text-primary";
    if (similarity >= 0.7) return "text-warning";
    return "text-muted-foreground";
  };

  const getSimilarityBg = (similarity: number) => {
    if (similarity >= 0.9) return "bg-success/20 border-success/30";
    if (similarity >= 0.8) return "bg-primary/20 border-primary/30";
    if (similarity >= 0.7) return "bg-warning/20 border-warning/30";
    return "bg-muted/20 border-muted/30";
  };

  const handleApplyFilters = (filters: any) => {
    setAppliedFilters(filters);
    toast({
      title: "Filters Applied",
      description: "Search results will be updated with your filter criteria",
    });
  };

  const handleClearSearch = () => {
    clearSearch();
    setPart1("");
    setPart2("");
    setPart3("");
    setPredictionResult(null);
    setPredictionError(null);
  };

  const handleApplySolution = (result: any) => {
    toast({
      title: "Solution Applied",
      description: `Applying resolution from incident ${result.incident} to current situation`,
    });
  };

  const handleNumericInput = (value: string, setter: (val: string) => void) => {
    if (/^\d*$/.test(value)) {
      setter(value);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          Vector Search Engine
        </h1>
        <p className="text-muted-foreground">AI-powered similarity search across historical incidents and security data</p>
        
        {/* Connection Status */}
        <div className="mt-4 flex items-center space-x-2">
          {isConnecting ? (
            <Badge variant="outline" className="flex items-center space-x-1">
              <div className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              <span>Connecting to TiDB...</span>
            </Badge>
          ) : isConnected ? (
            <Badge variant="outline" className="flex items-center space-x-1 text-success">
              <CheckCircle className="h-3 w-3" />
              <span>Connected to TiDB Serverless</span>
            </Badge>
          ) : (
            <Badge variant="outline" className="flex items-center space-x-1 text-warning">
              <AlertCircle className="h-3 w-3" />
              <span>Mock Mode - No Database Connection</span>
            </Badge>
          )}
        </div>
      </div>

      {/* Search Interface */}
      <Card className="card-gradient border-border/50 glow-primary">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-primary" />
            <span>Search By Code</span>
          </CardTitle>
          <CardDescription>
            Enter Your Security Code (Numerical Only)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Input
              placeholder="Part 1"
              value={part1}
              onChange={(e) => handleNumericInput(e.target.value, setPart1)}
              className="bg-input/50 border-border/50 focus:border-primary text-center text-lg tracking-widest"
              maxLength={3}
            />
            <Input
              placeholder="Part 2"
              value={part2}
              onChange={(e) => handleNumericInput(e.target.value, setPart2)}
              className="bg-input/50 border-border/50 focus:border-primary text-center text-lg tracking-widest"
              maxLength={3}
            />
            <Input
              placeholder="Part 3"
              value={part3}
              onChange={(e) => handleNumericInput(e.target.value, setPart3)}
              className="bg-input/50 border-border/50 focus:border-primary text-center text-lg tracking-widest"
              maxLength={3}
            />
          </div>
          
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => setShowAdvancedFilters(true)}>
                  <Filter className="h-4 w-4 mr-2" />
                  Advanced Filters
                  {appliedFilters && <Badge variant="secondary" className="ml-1 text-xs">Active</Badge>}
                </Button>
                <Badge variant="secondary" className="text-xs">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI Enhanced
                </Badge>
              </div>
            <Button 
              onClick={handleSearch}
              disabled={(!part1 && !part2 && !part3) || isPredicting}
              className="glow-primary"
            >
              {isPredicting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  <span>Predicting...</span>
                </div>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Predict Attack
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Prediction Results */}
        <div className="lg:col-span-3 space-y-4">
          {predictionError && (
            <Card className="card-gradient border-destructive/50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>Prediction Error: {predictionError}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {predictionResult && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Prediction Result</h2>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className={getSimilarityBg(predictionResult.prediction.confidence)}>
                    <Target className="h-3 w-3 mr-1" />
                    {Math.round(predictionResult.prediction.confidence * 100)}% confidence
                  </Badge>
                  <Button size="sm" variant="outline" onClick={handleClearSearch}>
                    Clear Result
                  </Button>
                </div>
              </div>

              <Card className="card-gradient border-primary/30 hover:border-primary/50 transition-colors glow-primary">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Attack Name Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Zap className="h-6 w-6 text-warning animate-pulse" />
                          <h3 className="text-2xl font-bold bg-gradient-to-r from-warning to-destructive bg-clip-text text-transparent">
                            {predictionResult.prediction.attackName}
                          </h3>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>Input Vector: [{predictionResult.input.join(', ')}]</span>
                          <span>•</span>
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(predictionResult.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className={`text-right ml-4 font-mono text-3xl font-bold ${getSimilarityColor(predictionResult.prediction.confidence)}`}>
                        {Math.round(predictionResult.prediction.confidence * 100)}%
                      </div>
                    </div>

                    {/* Summary Section */}
                    <div className="bg-muted/30 p-4 rounded-lg border border-border/30">
                      <h4 className="font-semibold mb-2 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2 text-primary" />
                        Attack Summary
                      </h4>
                      <p className="text-sm leading-relaxed">
                        {predictionResult.prediction.summary}
                      </p>
                    </div>

                    {/* Mitigation Points */}
                    {predictionResult.prediction.points && predictionResult.prediction.points.length > 0 && (
                      <div className="bg-success/10 p-4 rounded-lg border border-success/30">
                        <h4 className="font-semibold mb-3 flex items-center text-success">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Recommended Actions
                        </h4>
                        <ul className="space-y-2">
                          {predictionResult.prediction.points.map((point: string, index: number) => (
                            <li key={index} className="flex items-start space-x-2 text-sm">
                              <span className="text-success mt-0.5">✓</span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Database Status */}
                    <div className="flex items-center justify-between pt-4 border-t border-border/30">
                      <div className="flex items-center space-x-2 text-sm">
                        <Database className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Database Lookup: 
                        </span>
                        {predictionResult.prediction.foundInDatabase ? (
                          <Badge variant="outline" className="bg-success/20 border-success/30 text-success">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Found
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-warning/20 border-warning/30 text-warning">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Not in Database
                          </Badge>
                        )}
                      </div>
                      <Button className="glow-primary">
                        Generate Full Report
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {(!part1 && !part2 && !part3 && !predictionResult) && (
            <Card className="card-gradient border-border/50 text-center p-12">
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-primary/20 rounded-full glow-primary">
                  <Target className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Ready to Search</h3>
                <p className="text-muted-foreground max-w-md">
                  Enter a description of your security incident to find similar historical cases and their solutions
                </p>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* Recent Searches */}
          <Card className="card-gradient border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <History className="h-4 w-4 mr-2 text-primary" />
                Recent Searches
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const parts = search.split(" ");
                    setPart1(parts[0] || "");
                    setPart2(parts[1] || "");
                    setPart3(parts[2] || "");
                  }}
                  className="w-full text-left p-2 text-sm bg-muted/20 hover:bg-muted/40 rounded border border-border/30 transition-colors"
                >
                  {search}
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Search Stats */}
          <Card className="card-gradient border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Search Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {statsLoading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
              ) : stats ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Incidents</span>
                    <span className="font-semibold">{stats.totalIncidents.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Indexed Vectors</span>
                    <span className="font-semibold">{stats.indexedVectors.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Search Accuracy</span>
                    <span className="font-semibold text-success">{stats.searchAccuracy}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Avg Response Time</span>
                    <span className="font-semibold">{stats.avgResponseTime}s</span>
                  </div>
                </>
              ) : (
                <div className="text-center text-muted-foreground py-4">
                  No statistics available
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>

      {/* Modals */}
      <AdvancedFiltersModal 
        open={showAdvancedFilters} 
        onOpenChange={setShowAdvancedFilters}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
};

export default VectorSearch;