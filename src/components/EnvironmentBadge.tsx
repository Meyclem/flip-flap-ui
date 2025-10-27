import { cn } from "@/lib/utils";
import { Environment } from "@/lib/types";

interface EnvironmentBadgeProps {
  environment: Environment;
  enabled: boolean;
  size?: "sm" | "md";
}

export const EnvironmentBadge = ({ environment, enabled, size = "md" }: EnvironmentBadgeProps) => {
  const labels = {
    development: "Dev",
    staging: "Staging",
    production: "Prod",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        size === "sm" && "px-2 py-0.5 text-xs",
        size === "md" && "px-3 py-1 text-sm",
        enabled
          ? "bg-success text-success-foreground"
          : "bg-disabled text-disabled-foreground"
      )}
    >
      {labels[environment]}
    </span>
  );
};
