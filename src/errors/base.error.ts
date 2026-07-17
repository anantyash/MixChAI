export abstract class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    cause?: unknown,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}
