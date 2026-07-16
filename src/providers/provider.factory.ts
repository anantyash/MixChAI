import { PROVIDERS } from "../config/providers";

import type { AIProvider } from "./ai-provider";

import { OpenAICompatibleProvider } from "./openai-compatible.provider";

export class ProviderFactory {
  static createAll(): AIProvider[] {
    return PROVIDERS.flatMap((provider) =>
      provider.models.map(
        (model) =>
          new OpenAICompatibleProvider({
            name: model.name,
            provider: provider.provider,
            apiKey: provider.apiKey,
            baseURL: provider.baseURL,
            model: model.model,
          }),
      ),
    );
  }
}
