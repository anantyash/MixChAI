import OpenAI from "openai";

import type { AIProvider } from "./ai-provider";
import type { ProviderConfig } from "../models/provider-config";
import type { LLMResponse } from "../models/llm-response";
import { AIResponseSchema } from "../schemas/ai-response.schema";
import { ProviderError } from "../errors/provider.error";
import { logger } from "../services/logger";

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
    logger.info(`[${this.provider}] Request started (${this.model})`);
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
      logger.info(`[${this.provider}] Response received`);

      const latency = performance.now() - start;

      logger.debug(`[${this.provider}] Latency ${latency.toFixed(2)} ms`);

      const parsed = AIResponseSchema.safeParse(response);
      if (!parsed.success) {
        logger.error(
          `[${this.provider}] Invalid response schema`,
          parsed.error,
        );
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
        logger.warn(`[${this.provider}] No choices returned`);
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
      const providerError = new ProviderError(
        this.provider,
        "Failed to generate completion",
        error,
      );

      const latency = performance.now() - start;

      logger.error(`[${this.provider}] Request failed`, error);

      return {
        provider: this.provider,
        model: this.model,
        content: "",
        latency,
        error: providerError.message,
      };
    }
  }
}
