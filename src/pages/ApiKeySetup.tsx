import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleLeft } from "lucide-react";

export default function ApiKeySetup() {
  const [apiKey, setApiKey] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      localStorage.setItem("apiKey", apiKey.trim());
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <ToggleLeft className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-3xl">Welcome to Flip-Flap</CardTitle>
          <CardDescription>
            Enter your organization API key to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">Organization API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter your API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                required
                className="font-mono"
              />
              <p className="text-sm text-muted-foreground">
                This key will be stored locally in your browser
              </p>
            </div>
            <Button type="submit" className="w-full" disabled={!apiKey.trim()}>
              Continue
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
