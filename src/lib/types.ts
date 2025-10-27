export interface OperatorExpression {
  eq?: string | number | boolean;
  neq?: string | number | boolean;
  gt?: number;
  gte?: number;
  lt?: number;
  lte?: number;
  oneOf?: (string | number | boolean)[];
  notOneOf?: (string | number | boolean)[];
}

export interface Phase {
  startDate: string;
  endDate?: string;
  percentage: number;
}

export interface EnvironmentConfig {
  enabled: boolean;
  phases?: Phase[];
  contextRules?: Record<string, OperatorExpression>;
}

export interface Flag {
  _id: string;
  organizationId: string;
  flagKey: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  environments: {
    development: EnvironmentConfig;
    staging: EnvironmentConfig;
    production: EnvironmentConfig;
  };
}

export interface ApiKey {
  _id: string;
  key: string;
  environment: "development" | "staging" | "production";
  description?: string;
  createdAt: string;
}

export interface ProblemDetails {
  type: string;
  title: string;
  detail: string | string[];
  instance: string;
}

export interface EvaluateResponse {
  flagKey: string;
  enabled: boolean;
  metadata: {
    reason: string;
    phase?: Phase;
  };
}

export type Environment = "development" | "staging" | "production";

export const ENVIRONMENTS: Environment[] = ["development", "staging", "production"];
