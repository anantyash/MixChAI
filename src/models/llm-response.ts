export interface LLMResponse {
  provider: string;
  model: string;
  content: string;
  success: boolean;
  latency: number;
  error?: string;
}
