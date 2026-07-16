import { env } from "./env";

export const PROVIDERS = {
  GEMINI: {
    provider: "Gemini",
    apiKey: env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
  },

  OPENROUTER: {
    provider: "OpenRouter",
    apiKey: env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
  },
} as const;