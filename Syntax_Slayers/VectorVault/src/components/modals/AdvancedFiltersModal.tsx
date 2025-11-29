import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Filter, 
  Calendar,
  Target,
  Tag,
  Database,
  Zap,
  X,
  RotateCcw
} from "lucide-react";

interface AdvancedFiltersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: (filters: any) => void;
}

const AdvancedFiltersModal = ({ open, onOpenChange, onApplyFilters }: AdvancedFiltersModalProps) => {
  const [filters, setFilters] = useState({
    dateRange: "7days",
    categories: [] as string[],
    severity: [] as string[],
    similarityThreshold: [70],
    status: [] as string[],
    sources: [] as string[],
    tags: [] as string[],
    includeResolved: true,
    vectorDistance: [0.3],
    minConfidence: [0.8]
  });

  const categories = [
    "Network Security",
    "Application Security", 
    "Infrastructure Security",
    "Data Security",
    "Email Security",
    "Endpoint Security",
    "Cloud Security",
    "Identity & Access"
  ];

  const severityLevels = ["Critical", "High", "Medium", "Low"];
  const statusOptions = ["Active", "Investigating", "Contained", "Resolved", "Scheduled"];
  const sources = ["Firewall", "IDS/IPS", "SIEM", "Antivirus", "Network Monitor", "Application Logs"];

  const toggleArrayItem = (array: string[], item: string, setter: (fn: (prev: any) => any) => void) => {
    setter((prev: any) => ({
      ...prev,
      [array === filters.categories ? 'categories' : 
       array === filters.severity ? 'severity' :
       array === filters.status ? 'status' :
       array === filters.sources ? 'sources' : 'tags']: 
        array.includes(item) 
          ? array.filter((i: string) => i !== item)
          : [...array, item]
    }));
  };

  const resetFilters = () => {
    setFilters({
      dateRange: "7days",
      categories: [],
      severity: [],
      similarityThreshold: [70],
      status: [],
      sources: [],
      tags: [],
      includeResolved: true,
      vectorDistance: [0.3],
      minConfidence: [0.8]
    });
  };

  const applyFilters = () => {
    onApplyFilters(filters);
    onOpenChange(false);
  };

  const activeFiltersCount = 
    filters.categories.length + 
    filters.severity.length + 
    filters.status.length + 
    filters.sources.length + 
    filters.tags.length +
    (filters.dateRange !== "7days" ? 1 : 0) +
    (filters.similarityThreshold[0] !== 70 ? 1 : 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-primary" />
            <span>Advanced Search Filters</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount} active
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Fine-tune your vector search with advanced filtering options
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          
          {/* Date Range */}
          <div className="space-y-2">
            <Label className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Time Range</span>
            </Label>
            <Select 
              value={filters.dateRange} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1hour">Last Hour</SelectItem>
                <SelectItem value="6hours">Last 6 Hours</SelectItem>
                <SelectItem value="24hours">Last 24 Hours</SelectItem>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Similarity Threshold */}
          <div className="space-y-3">
            <Label className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Similarity Threshold: {filters.similarityThreshold[0]}%</span>
            </Label>
            <Slider
              value={filters.similarityThreshold}
              onValueChange={(value) => setFilters(prev => ({ ...prev, similarityThreshold: value }))}
              max={100}
              min={50}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>50% (Broad)</span>
              <span>75% (Moderate)</span>
              <span>100% (Exact)</span>
            </div>
          </div>

          <Separator />

          {/* Categories */}
          <div className="space-y-3">
            <Label>Security Categories</Label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox 
                    checked={filters.categories.includes(category)}
                    onCheckedChange={() => toggleArrayItem(filters.categories, category, setFilters)}
                  />
                  <label className="text-sm">{category}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Severity Levels */}
          <div className="space-y-3">
            <Label>Severity Levels</Label>
            <div className="flex flex-wrap gap-2">
              {severityLevels.map((severity) => (
                <Badge 
                  key={severity}
                  variant={filters.severity.includes(severity) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleArrayItem(filters.severity, severity, setFilters)}
                >
                  {severity}
                </Badge>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-3">
            <Label>Incident Status</Label>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((status) => (
                <Badge 
                  key={status}
                  variant={filters.status.includes(status) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleArrayItem(filters.status, status, setFilters)}
                >
                  {status}
                </Badge>
              ))}
            </div>
          </div>

          {/* Sources */}
          <div className="space-y-3">
            <Label>Data Sources</Label>
            <div className="grid grid-cols-3 gap-2">
              {sources.map((source) => (
                <div key={source} className="flex items-center space-x-2">
                  <Checkbox 
                    checked={filters.sources.includes(source)}
                    onCheckedChange={() => toggleArrayItem(filters.sources, source, setFilters)}
                  />
                  <label className="text-sm">{source}</label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* AI Parameters */}
          <div className="space-y-4">
            <Label className="flex items-center space-x-2">
              <Zap className="h-4 w-4" />
              <span>AI Search Parameters</span>
            </Label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Vector Distance: {filters.vectorDistance[0]}</Label>
                <Slider
                  value={filters.vectorDistance}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, vectorDistance: value }))}
                  max={1}
                  min={0.1}
                  step={0.05}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm">Min Confidence: {Math.round(filters.minConfidence[0] * 100)}%</Label>
                <Slider
                  value={filters.minConfidence}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, minConfidence: value }))}
                  max={1}
                  min={0.5}
                  step={0.05}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                checked={filters.includeResolved}
                onCheckedChange={(checked) => setFilters(prev => ({ ...prev, includeResolved: !!checked }))}
              />
              <Label className="text-sm">Include resolved incidents</Label>
            </div>
          </div>

          {/* Summary */}
          {activeFiltersCount > 0 && (
            <Card className="card-gradient">
              <CardContent className="p-4">
                <h4 className="font-medium mb-2 flex items-center">
                  <Database className="h-4 w-4 mr-2 text-primary" />
                  Filter Summary
                </h4>
                <p className="text-sm text-muted-foreground">
                  {activeFiltersCount} filter(s) active. This will search through incidents from the {filters.dateRange} 
                  {filters.similarityThreshold[0] !== 70 && ` with ${filters.similarityThreshold[0]}% minimum similarity`}
                  {filters.categories.length > 0 && ` in ${filters.categories.length} categor${filters.categories.length === 1 ? 'y' : 'ies'}`}
                  .
                </p>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={resetFilters}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset All
            </Button>
            
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={applyFilters} className="glow-primary">
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdvancedFiltersModal;