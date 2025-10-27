import { Flag, ApiKey, ProblemDetails, EvaluateResponse } from "./types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export class ApiError extends Error {
  constructor(
    public problem: ProblemDetails,
    public status: number
  ) {
    super(problem.title);
    this.name = "ApiError";
  }
}

async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const apiKey = localStorage.getItem("apiKey");
  
  if (!apiKey) {
    throw new Error("API key not found. Please configure your API key.");
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const problem: ProblemDetails = await response.json();
    throw new ApiError(problem, response.status);
  }

  return response;
}

export const flagsApi = {
  async list(): Promise<Flag[]> {
    const response = await fetchWithAuth("/flags");
    const data = await response.json();
    return data.flags;
  },

  async get(flagKey: string): Promise<Flag> {
    const response = await fetchWithAuth(`/flags/${flagKey}`);
    const data = await response.json();
    return data.flag;
  },

  async create(flag: Omit<Flag, "_id" | "organizationId" | "createdAt" | "updatedAt">): Promise<Flag> {
    const response = await fetchWithAuth("/flags", {
      method: "POST",
      body: JSON.stringify(flag),
    });
    const data = await response.json();
    return data.flag;
  },

  async update(flagKey: string, flag: Omit<Flag, "_id" | "organizationId" | "createdAt" | "updatedAt">): Promise<Flag> {
    const response = await fetchWithAuth(`/flags/${flagKey}`, {
      method: "PUT",
      body: JSON.stringify(flag),
    });
    const data = await response.json();
    return data.flag;
  },

  async delete(flagKey: string): Promise<void> {
    await fetchWithAuth(`/flags/${flagKey}`, {
      method: "DELETE",
    });
  },

  async evaluate(flagKey: string, context: Record<string, any>): Promise<EvaluateResponse> {
    const response = await fetchWithAuth("/flags/evaluate", {
      method: "POST",
      body: JSON.stringify({ flagKey, context }),
    });
    return response.json();
  },
};

export const apiKeysApi = {
  async list(): Promise<ApiKey[]> {
    const response = await fetchWithAuth("/keys");
    const data = await response.json();
    return data.apiKeys;
  },

  async create(apiKey: { environment: string; description?: string }): Promise<ApiKey> {
    const response = await fetchWithAuth("/keys", {
      method: "POST",
      body: JSON.stringify(apiKey),
    });
    const data = await response.json();
    return data.apiKey;
  },
};
