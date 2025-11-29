import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "./Navigation";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('vectorvault-auth');
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="lg:ml-64 p-4 lg:p-8">
        <div className="mt-16 lg:mt-0">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;