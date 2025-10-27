import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { FlagCard } from "@/components/FlagCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Flag } from "@/lib/types";
import { flagsApi, ApiError } from "@/lib/api";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Dashboard() {
  const [flags, setFlags] = useState<Flag[]>([]);
  const [filteredFlags, setFilteredFlags] = useState<Flag[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [flagToDelete, setFlagToDelete] = useState<string | null>(null);
  const [testFlagKey, setTestFlagKey] = useState<string | null>(null);

  const loadFlags = async () => {
    try {
      setLoading(true);
      const data = await flagsApi.list();
      setFlags(data);
      setFilteredFlags(data);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.problem.title, {
          description: Array.isArray(error.problem.detail)
            ? error.problem.detail.join(", ")
            : error.problem.detail,
        });
      } else {
        toast.error("Failed to load flags");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFlags();
  }, []);

  useEffect(() => {
    const filtered = flags.filter(
      (flag) =>
        flag.flagKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
        flag.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredFlags(filtered);
  }, [searchQuery, flags]);

  const handleDelete = async () => {
    if (!flagToDelete) return;

    try {
      await flagsApi.delete(flagToDelete);
      toast.success("Flag deleted successfully");
      setFlags(flags.filter((f) => f.flagKey !== flagToDelete));
      setDeleteDialogOpen(false);
      setFlagToDelete(null);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.problem.title, {
          description: Array.isArray(error.problem.detail)
            ? error.problem.detail.join(", ")
            : error.problem.detail,
        });
      } else {
        toast.error("Failed to delete flag");
      }
    }
  };

  const openDeleteDialog = (flagKey: string) => {
    setFlagToDelete(flagKey);
    setDeleteDialogOpen(true);
  };

  const handleTest = (flagKey: string) => {
    setTestFlagKey(flagKey);
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Feature Flags</h1>
          <p className="text-muted-foreground">
            Manage and configure your feature flags across environments
          </p>
        </div>
        <Button asChild>
          <Link to="/flags/new">
            <Plus className="h-4 w-4 mr-2" />
            Create New Flag
          </Link>
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search flags by key or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading flags...</p>
        </div>
      ) : filteredFlags.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            {searchQuery ? "No flags found matching your search" : "No flags yet. Create your first one!"}
          </p>
          {!searchQuery && (
            <Button asChild>
              <Link to="/flags/new">
                <Plus className="h-4 w-4 mr-2" />
                Create New Flag
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredFlags.map((flag) => (
            <FlagCard
              key={flag._id}
              flag={flag}
              onDelete={openDeleteDialog}
              onTest={handleTest}
            />
          ))}
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Flag</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the flag <code className="font-mono font-semibold">{flagToDelete}</code>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
