import { env } from "./env";
import { MODELS } from "./models";

export const PROVIDERS = [
//   {
//     provider: "Gemini",
//     apiKey: env.GEMINI_API_KEY,
//     baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",

//     models: [
//       {
//         name: "Gemini",
//         model: MODELS.GEMINI_FLASH,
//       },
//     ],
//   },

  {
    provider: "OpenRouter",
    apiKey: env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",

    models: [
      {
        name: "OpenRouter-Qwen",
        model: MODELS.QWEN,
      },

      {
        name: "OpenRouter-Llama",
        model: MODELS.LLAMA,
      },

      {
        name: "OpenRouter-Gemma",
        model: MODELS.GEMMA,
      },
    ],
  },
] as const;
