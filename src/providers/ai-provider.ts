import type { LLMResponse } from "../models/llm-response";

export interface AIProvider {
  readonly provider: string;
  readonly model: string;

  generate(prompt: string): Promise<LLMResponse>;
}