import OpenAI from "openai";

import { env } from "../config/env";
import { MODELS } from "../config/models";

import type { LLMResponse } from "../models/llm-response";

import { buildEvaluationPrompt } from "../prompts/evaluator.prompt";
import { EVALUATOR_SYSTEM_PROMPT } from "../prompts/evaluator.system-prompt";

import { AIResponseSchema } from "../schemas/ai-response.schema";

export class EvaluatorService {
  private readonly client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: env.GEMINI_API_KEY,
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
    });
  }

  async evaluate(question: string, responses: LLMResponse[]): Promise<string> {
    const prompt = buildEvaluationPrompt(question, responses);

    const response = await this.client.chat.completions.create({
      model: MODELS.GEMINI_FLASH,
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

    const parsed = AIResponseSchema.safeParse(response);

    if (!parsed.success) {
      throw new Error("Invalid evaluator response structure.");
    }

    const choice = parsed.data.choices[0];

    const finalAnswer = choice?.message.content?.trim();

    if (!finalAnswer) {
      throw new Error("Evaluator returned an empty response.");
    }

    return finalAnswer;
  }
}
