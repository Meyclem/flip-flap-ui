import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard";
import CreateEditFlag from "./pages/CreateEditFlag";
import ApiKeys from "./pages/ApiKeys";
import ApiKeySetup from "./pages/ApiKeySetup";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);

  useEffect(() => {
    const apiKey = localStorage.getItem("apiKey");
    setHasApiKey(Boolean(apiKey));
  }, []);

  if (hasApiKey === null) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  return hasApiKey ? <>{children}</> : <Navigate to="/setup" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/setup" element={<ApiKeySetup />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/flags/new"
            element={
              <ProtectedRoute>
                <CreateEditFlag />
              </ProtectedRoute>
            }
          />
          <Route
            path="/flags/:flagKey"
            element={
              <ProtectedRoute>
                <CreateEditFlag />
              </ProtectedRoute>
            }
          />
          <Route
            path="/api-keys"
            element={
              <ProtectedRoute>
                <ApiKeys />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
