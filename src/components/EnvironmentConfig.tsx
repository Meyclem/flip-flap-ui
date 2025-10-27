import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Environment, EnvironmentConfig as EnvironmentConfigType } from "@/lib/types";
import { ContextRulesBuilder } from "./ContextRulesBuilder";
import { PhasesBuilder } from "./PhasesBuilder";
import { ChevronDown, ChevronUp, Copy } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { toast } from "sonner";

interface EnvironmentConfigProps {
  environment: Environment;
  config: EnvironmentConfigType;
  allEnvironments: {
    development: EnvironmentConfigType;
    staging: EnvironmentConfigType;
    production: EnvironmentConfigType;
  };
  onChange: (config: EnvironmentConfigType) => void;
}

export const EnvironmentConfig = ({ environment, config, allEnvironments, onChange }: EnvironmentConfigProps) => {
  const [contextRulesOpen, setContextRulesOpen] = useState(false);
  const [phasesOpen, setPhasesOpen] = useState(false);

  const envLabels = {
    development: "Development",
    staging: "Staging",
    production: "Production",
  };

  const getOtherEnvironments = (): Environment[] => {
    return (["development", "staging", "production"] as Environment[]).filter(
      (env) => env !== environment
    );
  };

  const copyFromEnvironment = (sourceEnv: Environment) => {
    const sourceConfig = allEnvironments[sourceEnv];
    onChange({
      ...config,
      contextRules: sourceConfig.contextRules ? { ...sourceConfig.contextRules } : undefined,
      phases: sourceConfig.phases ? [...sourceConfig.phases] : undefined,
    });
    toast.success(`Copied settings from ${envLabels[sourceEnv]}`);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{envLabels[environment]}</CardTitle>
            <CardDescription>Configure {environment} environment settings</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={config.enabled}
              onCheckedChange={(enabled) => onChange({ ...config, enabled })}
              id={`${environment}-enabled`}
            />
            <Label htmlFor={`${environment}-enabled`} className="font-semibold">
              {config.enabled ? "Enabled" : "Disabled"}
            </Label>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-end mb-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Copy from Environment
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {getOtherEnvironments().map((env) => (
                <DropdownMenuItem
                  key={env}
                  onClick={() => copyFromEnvironment(env)}
                >
                  Copy from {envLabels[env]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Collapsible open={contextRulesOpen} onOpenChange={setContextRulesOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span>Context-Based Targeting</span>
              {contextRulesOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <ContextRulesBuilder
              rules={config.contextRules || {}}
              onChange={(contextRules) => onChange({ ...config, contextRules })}
            />
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={phasesOpen} onOpenChange={setPhasesOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span>Progressive Rollout Phases</span>
              {phasesOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <PhasesBuilder
              phases={config.phases || []}
              onChange={(phases) => onChange({ ...config, phases })}
            />
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};
