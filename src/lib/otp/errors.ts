// Typed error so callers can distinguish rate-limit (429) from infra failures (500)
export class RateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RateLimitError';
  }
}
