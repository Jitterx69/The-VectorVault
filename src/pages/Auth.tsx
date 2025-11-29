import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, User, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/Background-removebg-preview.png";

const Auth = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isGenerating, setIsGenerating] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    if (timeLeft === null) return;

    if (timeLeft === 0) {
      setTimeLeft(null);
      toast({
        title: "Credentials Expired",
        description: "Please generate new credentials to login",
        variant: "destructive"
      });
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, toast]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('vectorvault-auth', 'true');
        localStorage.setItem('vectorvault-user', username);
        
        toast({
          title: "Authentication Successful",
          description: "Welcome to VectorVault Security Center",
          className: "bg-success/20 border-success/30 text-success"
        });
        
        navigate("/dashboard");
      } else {
        throw new Error(data.error || 'Authentication failed');
      }
    } catch (error) {
      toast({
        title: "Authentication Failed", 
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateCredentials = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('http://localhost:3001/api/generate-auth', {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.success) {
        setTimeLeft(120); // Start 2 minute timer
        toast({
          title: "Credentials Generated",
          description: "Check your admin email. Valid for 2 minutes.",
          className: "bg-primary/20 border-primary/30 text-primary"
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Could not generate credentials",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-danger/5" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-danger/10 rounded-full blur-3xl" />
      
      <Card className="w-full max-w-md relative z-10 card-gradient border-border/50 glow-primary">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img src={logo} alt="VectorVault Logo" className="h-16 w-16" />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                VectorVault
              </h1>
              <p className="text-xs text-muted-foreground">Skyraa PEAR Engine v1</p>
            </div>
          </div>
          <CardTitle className="text-xl">Secure Access Portal</CardTitle>
          {timeLeft !== null && (
            <div className="mt-2 p-2 bg-primary/10 rounded-md border border-primary/20 animate-pulse">
              <p className="text-sm font-mono text-primary">
                Login Window: {formatTime(timeLeft)}
              </p>
            </div>
          )}
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>Username Hash</span>
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter username hashcode"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="font-mono text-sm bg-input/50 border-border/50 focus:border-primary focus:glow-primary"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center space-x-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <span>Password Hash</span>
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password hashcode"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="font-mono text-sm bg-input/50 border-border/50 focus:border-primary focus:glow-primary"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary glow-primary transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </div>
              ) : (
                "Access Security Center"
              )}
            </Button>
          </form>
        </CardContent> 
      </Card>

      <div className="flex items-center justify-between mt-6">
        <Button 
          variant="outline"
          className="glow-primary active:scale-95 transition-all duration-200 group relative overflow-hidden"
          onClick={handleGenerateCredentials}
          disabled={isGenerating}
        >
          <div className="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <div className="relative flex items-center space-x-2">
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                <span>Generating Secure Keys...</span>
              </>
            ) : (
              <>
                <Key className="h-4 w-4" />
                <span>Generate Authentication Credentials</span>
              </>
            )}
          </div>
        </Button>
      </div>
    </div>
  );
};

export default Auth;