import { ProviderFactory } from "../providers/provider.factory";
import { EvaluatorService } from "../services/evaluator.service";
import type { LLMResponse } from "../models/llm-response";

import { ProviderError } from "../errors/provider.error";

import { logger } from "../services/logger";

logger.info("Starting orchestration");
export class Orchestrator {
  private readonly providers = ProviderFactory.createAll();

  constructor(private readonly evaluator = new EvaluatorService()) {}

  async *stream(
    prompt: string,
    options?: {
      onResponses?: (responses: LLMResponse[]) => void;
    },
  ): AsyncGenerator<string> {
    const responses = await this.collectResponses(prompt);

    if (responses.length === 0) {
      throw new ProviderError("ALL", "All providers failed.");
    }
    options?.onResponses?.(responses);

    yield* this.evaluator.stream(prompt, responses);
  }

  private async collectResponses(prompt: string): Promise<LLMResponse[]> {
    logger.info("Executing providers in parallel");
    const settledResponses = await Promise.allSettled(
      this.providers.map((provider) => provider.generate(prompt)),
    );

    logger.info(`Collected ${settledResponses.length} successful responses`);

    const failures = settledResponses.filter(
      (r): r is PromiseRejectedResult => r.status === "rejected",
    );
    logger.warn(`${failures.length} provider(s) failed`);

    for (const failure of failures) {
      console.error(failure.reason);
    }

    return settledResponses
      .filter(
        (result): result is PromiseFulfilledResult<LLMResponse> =>
          result.status === "fulfilled",
      )
      .map((result) => result.value)
      .filter((response) => !response.error);
  }
}
