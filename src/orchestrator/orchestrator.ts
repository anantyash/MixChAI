import { ProviderFactory } from "../providers/provider.factory";
import { EvaluatorService } from "../services/evaluator.service";

import type { EvaluationResult } from "../models/evaluation-result";
import type { LLMResponse } from "../models/llm-response";

export class Orchestrator {
  private readonly providers = ProviderFactory.createAll();

  constructor(private readonly evaluator = new EvaluatorService()) {}

  async run(prompt: string): Promise<EvaluationResult> {
    const responses = await this.collectResponses(prompt);

    if (responses.length === 0) {
      throw new Error("All providers failed to generate a response.");
    }

    const finalAnswer = await this.evaluator.evaluate(prompt, responses);

    return {
      finalAnswer,
    };
  }

  private async collectResponses(prompt: string): Promise<LLMResponse[]> {
    const settledResponses = await Promise.allSettled(
      this.providers.map((provider) => provider.generate(prompt)),
    );

    return settledResponses
      .filter(
        (result): result is PromiseFulfilledResult<LLMResponse> =>
          result.status === "fulfilled",
      )
      .map((result) => result.value)
      .filter((response) => !response.error);
  }
}
