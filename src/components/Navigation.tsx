import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Home,
  Search,
  Brain,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  AlertTriangle,
  Database
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/Background-removebg-preview.png";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem('vectorvault-auth');
    localStorage.removeItem('vectorvault-user');
    toast({
      title: "Logged Out",
      description: "Session terminated securely",
    });
    navigate("/auth");
  };

  const navItems = [
    { path: "/dashboard", icon: Home, label: "Dashboard" },
    { path: "/incidents", icon: AlertTriangle, label: "Incidents" },
    { path: "/search", icon: Search, label: "Vector Search" },
    { path: "/ai-analysis", icon: Brain, label: "AI Analysis" },
    { path: "/logs", icon: FileText, label: "System Logs" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-card/80 backdrop-blur-sm border-border/50"
        >
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-card/80 backdrop-blur-xl border-r border-border/50 z-40
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Header */}
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="VectorVault Logo" className="h-16 w-16" />
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent" style={{ fontFamily: "Bank Gothic", fontWeight: "bold", fontSize: "1.5rem" }}>
                VectorVault
              </h1>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    isActive 
                      ? "bg-gradient-to-r from-primary to-primary-glow glow-primary text-primary-foreground" 
                      : "hover:bg-muted/50"
                  }`}
                >
                  <Icon className="h-4 w-4 mr-3" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border/50">
          <div className="mb-3 p-3 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground">Logged in as:</p>
            <p className="text-sm font-mono text-foreground truncate">
              {localStorage.getItem('vectorvault-user') || 'security_user'}
            </p>
            <div className="flex items-center mt-1">
              <div className="w-2 h-2 bg-success rounded-full mr-2 animate-pulse"></div>
              <span className="text-xs text-success">System Active</span>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full justify-start hover:bg-danger/20 hover:text-danger hover:border-danger/50"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-3" />
            Logout
          </Button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Navigation;