import { Flag } from "@/lib/types";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { EnvironmentBadge } from "./EnvironmentBadge";
import { Edit, Trash2, TestTube } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

interface FlagCardProps {
  flag: Flag;
  onDelete: (flagKey: string) => void;
  onTest: (flagKey: string) => void;
}

export const FlagCard = ({ flag, onDelete, onTest }: FlagCardProps) => {
  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <code className="text-lg font-mono font-semibold text-code-foreground bg-code px-2 py-1 rounded">
              {flag.flagKey}
            </code>
          </div>
          <h3 className="text-xl font-semibold text-card-foreground mb-1">
            {flag.name}
          </h3>
          {flag.description && (
            <p className="text-muted-foreground text-sm line-clamp-2">
              {flag.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <EnvironmentBadge
          environment="development"
          enabled={flag.environments.development.enabled}
          size="sm"
        />
        <EnvironmentBadge
          environment="staging"
          enabled={flag.environments.staging.enabled}
          size="sm"
        />
        <EnvironmentBadge
          environment="production"
          enabled={flag.environments.production.enabled}
          size="sm"
        />
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground border-t border-border pt-4">
        <div>
          <p>Created: {format(new Date(flag.createdAt), "MMM d, yyyy")}</p>
          <p>Updated: {format(new Date(flag.updatedAt), "MMM d, yyyy")}</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onTest(flag.flagKey)}
          >
            <TestTube className="h-4 w-4 mr-1" />
            Test
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to={`/flags/${flag.flagKey}`}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Link>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(flag.flagKey)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
