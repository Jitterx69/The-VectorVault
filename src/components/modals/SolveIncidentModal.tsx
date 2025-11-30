import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Code, Terminal, ShieldCheck } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SolveIncidentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  incident: any;
  solution: any;
  onAccept: () => void;
}

const SolveIncidentModal = ({ open, onOpenChange, incident, solution, onAccept }: SolveIncidentModalProps) => {
  const [activeTab, setActiveTab] = useState("cpp");

  if (!incident || !solution) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-background/95 backdrop-blur-xl border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            Threat Mitigation: {incident.title}
          </DialogTitle>
          <DialogDescription>
            Review the recommended security patches and mitigation strategies below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
            <h4 className="font-semibold mb-2 text-primary">Threat Analysis</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {solution.description}
            </p>
          </div>

          <Tabs defaultValue="cpp" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="cpp" className="flex items-center gap-2">
                <Code className="h-4 w-4" /> C++ Patch
              </TabsTrigger>
              <TabsTrigger value="asm" className="flex items-center gap-2">
                <Terminal className="h-4 w-4" /> Assembly Validation
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="cpp" className="mt-4">
              <ScrollArea className="h-[300px] w-full rounded-md border border-border/50 bg-black/50 p-4">
                <pre className="font-mono text-sm text-green-400">
                  {solution.cpp_snippet}
                </pre>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="asm" className="mt-4">
              <ScrollArea className="h-[300px] w-full rounded-md border border-border/50 bg-black/50 p-4">
                <pre className="font-mono text-sm text-blue-400">
                  {solution.assembly_snippet}
                </pre>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            className="glow-primary bg-green-600 hover:bg-green-700 text-white"
            onClick={onAccept}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Accept & Resolve Incident
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SolveIncidentModal;
