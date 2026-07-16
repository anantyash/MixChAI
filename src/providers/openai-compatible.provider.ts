import OpenAI from "openai";

import type { AIProvider } from "./ai-provider";
import type { ProviderConfig } from "../models/provider-config";
import type { LLMResponse } from "../models/llm-response";
import { AIResponseSchema } from "../schemas/ai-response.schema";

export class OpenAICompatibleProvider implements AIProvider {
  readonly provider: string;
  readonly model: string;

  private readonly client: OpenAI;

  constructor(private readonly config: ProviderConfig) {
    this.provider = config.provider;
    this.model = config.model;

    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseURL,
    });
  }

  async generate(prompt: string): Promise<LLMResponse> {
    const start = performance.now();

    try {
      const response = await this.client.chat.completions.create({
        model: this.config.model,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      const latency = performance.now() - start;

      const parsed = AIResponseSchema.safeParse(response);
      if (!parsed.success) {
        return {
          provider: this.provider,
          model: this.model,
          content: "",
          latency,
          error: "Invalid response structure",
        };
      }

      const choice = parsed.data.choices[0];

      if (!choice) {
        return {
          provider: this.provider,
          model: this.model,
          content: "",
          latency,
          error: "Provider returned no choices",
        };
      }

      return {
        provider: this.provider,
        model: this.model,
        content: choice.message.content ?? "",
        latency,
      };
    } catch (error) {
      const latency = performance.now() - start;

      return {
        provider: this.provider,
        model: this.model,
        content: "",
        latency,
        error:
          error instanceof Error ? error.message : "Unknown provider error",
      };
    }
  }
}
