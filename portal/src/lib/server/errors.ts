export class ForbiddenError extends Error {
  readonly status = 403;
  constructor() {
    super("Forbidden");
    this.name = "ForbiddenError";
  }
}
