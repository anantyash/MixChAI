import { AppError } from "./base.error";

export class ProviderError extends AppError {
  constructor(provider: string, message: string, cause?: unknown) {
    super(message, "PROVIDER_ERROR", cause);

    this.provider = provider;
  }

  readonly provider: string;
}
