import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/Background-removebg-preview.png";

const Auth = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication with hashcode validation
    setTimeout(() => {
      if (username && password) {
        // Store auth state in localStorage for demo
        localStorage.setItem('vectorvault-auth', 'true');
        localStorage.setItem('vectorvault-user', username);
        
        toast({
          title: "Authentication Successful",
          description: "Welcome to VectorVault Security Center",
        });
        
        navigate("/dashboard");
      } else {
        toast({
          title: "Authentication Failed", 
          description: "Please enter valid hashcode credentials",
          variant: "destructive"
        });
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
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
    </div>
  );
};

export default Auth;