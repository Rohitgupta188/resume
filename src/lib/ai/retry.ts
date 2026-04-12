export async function generateWithRetry(
  fn: () => Promise<any>,
  fallbackFn?: (() => Promise<any>) | number,
  retries = 5
): Promise<{ response: any; modelUsed: string } | false> {
  
  if (typeof fallbackFn === "number") {
    retries = fallbackFn;
    fallbackFn = undefined;
  }

  let attempt = 0;

  while (attempt < retries) {
    try {
      const response = await fn();
      return { response, modelUsed: "gemini-2.5-flash" };
    } catch (error: any) {
      const status = error?.status || error?.code;

      if (status === 503 || status === 429) {
        if (attempt === 2 && fallbackFn) {
          try {
            const response = await fallbackFn();
            return { response, modelUsed: "gemini-2.5-flash-lite" };
          } catch {}
        }

        const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
        await new Promise((res) => setTimeout(res, delay));
        attempt++;
      } else {
        throw error;
      }
    }
  }

  return false;
}