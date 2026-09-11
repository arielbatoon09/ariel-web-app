export function getErrorMessage(error: unknown, fallback = "Unknown error"): string {
  if (error instanceof Error) {
    const cause = "cause" in error ? (error as { cause?: unknown }).cause : undefined;
    if (cause instanceof Error && cause.message) {
      // Surface Postgres connection/limit errors instead of only "Failed query: …"
      if (/EMAXCONN|max client connections|FATAL|timeout|ECONN/i.test(cause.message)) {
        return cause.message;
      }
    }
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return fallback;
}
