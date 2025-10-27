import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ApiKey, Environment } from "@/lib/types";
import { apiKeysApi, ApiError } from "@/lib/api";
import { Copy, Plus, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { EnvironmentBadge } from "@/components/EnvironmentBadge";

export default function ApiKeys() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newKeyDialogOpen, setNewKeyDialogOpen] = useState(false);
  const [environment, setEnvironment] = useState<Environment>("development");
  const [description, setDescription] = useState("");
  const [createdKey, setCreatedKey] = useState<ApiKey | null>(null);

  const loadApiKeys = async () => {
    try {
      setLoading(true);
      const data = await apiKeysApi.list();
      setApiKeys(data);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.problem.title);
      } else {
        toast.error("Failed to load API keys");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApiKeys();
  }, []);

  const handleCreate = async () => {
    try {
      const apiKey = await apiKeysApi.create({ environment, description });
      setCreatedKey(apiKey);
      setCreateDialogOpen(false);
      setNewKeyDialogOpen(true);
      setEnvironment("development");
      setDescription("");
      loadApiKeys();
      toast.success("API key created successfully");
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.problem.title);
      } else {
        toast.error("Failed to create API key");
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const maskKey = (key: string) => {
    if (key.length <= 8) return key;
    const start = key.substring(0, 4);
    const end = key.substring(key.length - 4);
    return `${start}${"*".repeat(key.length - 8)}${end}`;
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">API Keys</h1>
            <p className="text-muted-foreground">
              Manage API keys for different environments
            </p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create New API Key
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading API keys...</p>
          </div>
        ) : apiKeys.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No API keys yet. Create your first one!</p>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create New API Key
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {apiKeys.map((apiKey) => (
              <Card key={apiKey._id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <code className="text-sm font-mono bg-code text-code-foreground px-3 py-1 rounded">
                          {maskKey(apiKey.key)}
                        </code>
                        <EnvironmentBadge
                          environment={apiKey.environment}
                          enabled={true}
                          size="sm"
                        />
                      </div>
                      {apiKey.description && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {apiKey.description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Created: {format(new Date(apiKey.createdAt), "MMM d, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(apiKey.key)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New API Key</DialogTitle>
            <DialogDescription>
              Generate a new API key for a specific environment
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Environment *</Label>
              <Select value={environment} onValueChange={(v) => setEnvironment(v as Environment)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="staging">Staging</SelectItem>
                  <SelectItem value="production">Production</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Description (optional)</Label>
              <Textarea
                placeholder="e.g., Web app production key"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create API Key</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={newKeyDialogOpen} onOpenChange={setNewKeyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Save Your API Key
            </DialogTitle>
            <DialogDescription>
              This is the only time you'll see this API key. Make sure to save it securely.
            </DialogDescription>
          </DialogHeader>
          {createdKey && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>API Key</Label>
                <div className="flex gap-2">
                  <Input
                    value={createdKey.key}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(createdKey.key)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                <p className="text-sm text-warning-foreground">
                  Store this key in a secure location. You won't be able to see it again.
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setNewKeyDialogOpen(false)}>I've Saved the Key</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
