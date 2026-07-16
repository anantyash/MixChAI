export interface LLMResponse {
  provider: string;
  model: string;
  content: string;
  latency: number;
  error?: string;
}
