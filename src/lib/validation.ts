import { z } from "zod";

const operatorExpressionSchema = z.object({
  eq: z.union([z.string(), z.number(), z.boolean()]).optional(),
  neq: z.union([z.string(), z.number(), z.boolean()]).optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  oneOf: z.array(z.union([z.string(), z.number(), z.boolean()])).optional(),
  notOneOf: z.array(z.union([z.string(), z.number(), z.boolean()])).optional(),
});

const phaseSchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  percentage: z.number().min(0).max(100),
});

const environmentConfigSchema = z.object({
  enabled: z.boolean(),
  phases: z.array(phaseSchema).optional(),
  contextRules: z.record(z.string(), operatorExpressionSchema).optional(),
});

export const flagSchema = z.object({
  flagKey: z
    .string()
    .min(1, "Flag key is required")
    .max(100, "Flag key must be less than 100 characters")
    .regex(
      /^[a-z0-9_-]+$/,
      "Flag key must contain only lowercase letters, numbers, hyphens, and underscores"
    ),
  name: z
    .string()
    .min(1, "Name is required")
    .max(200, "Name must be less than 200 characters"),
  description: z.string().max(1000, "Description must be less than 1000 characters").optional(),
  environments: z.object({
    development: environmentConfigSchema,
    staging: environmentConfigSchema,
    production: environmentConfigSchema,
  }),
});

export const apiKeySchema = z.object({
  environment: z.enum(["development", "staging", "production"]),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
});

export type FlagFormData = z.infer<typeof flagSchema>;
export type ApiKeyFormData = z.infer<typeof apiKeySchema>;
