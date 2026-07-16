import OpenAI from "openai";

import { env } from "../config/env";
import { MODELS } from "../config/models";

import type { LLMResponse } from "../models/llm-response";

import { buildEvaluationPrompt } from "../prompts/evaluator.prompt";
import { EVALUATOR_SYSTEM_PROMPT } from "../prompts/evaluator.system-prompt";

export class EvaluatorService {
  private readonly client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: env.GEMINI_API_KEY,
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
    });
  }

  async *stream(
    question: string,
    responses: LLMResponse[],
  ): AsyncGenerator<string> {
    const prompt = buildEvaluationPrompt(question, responses);

    const stream = await this.client.chat.completions.create({
      model: MODELS.GEMINI_FLASH,
      stream: true,
      messages: [
        {
          role: "system",
          content: EVALUATOR_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;

      if (content) {
        yield content;
      }
    }
  }
}
