import { Link, useLocation } from "react-router-dom";
import { ToggleLeft, Key } from "lucide-react";
import { Button } from "./ui/button";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <ToggleLeft className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Flip-Flap</h1>
            </Link>
            
            <nav className="flex items-center gap-4">
              <Button
                variant={location.pathname === "/" ? "default" : "ghost"}
                asChild
              >
                <Link to="/">Flags</Link>
              </Button>
              <Button
                variant={location.pathname === "/api-keys" ? "default" : "ghost"}
                asChild
              >
                <Link to="/api-keys">
                  <Key className="h-4 w-4 mr-2" />
                  API Keys
                </Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};
