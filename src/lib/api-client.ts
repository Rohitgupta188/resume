interface ApiResponse<T = unknown> {
  status: number;
  ok: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
  details?: any;
}

class ApiError extends Error {
  status: number;
  details?: any;

  constructor(message: string, status: number, details?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

/* ═══════════════════════════════════════════════
   REFRESH CONTROL (Prevents multiple calls)
   ═══════════════════════════════════════════════ */

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function refreshToken(): Promise<boolean> {
  try {
    const res = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include", //  required for cookies
    });

    return res.ok;
  } catch {
    return false;
  }
}

/* ═══════════════════════════════════════════════
   CORE FETCH FUNCTION
   ═══════════════════════════════════════════════ */

async function apiFetch<T = unknown>(
  url: string,
  options: RequestInit = {},
  retry = false
): Promise<T> {
  const config: RequestInit = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  // Remove content-type for FormData
  if (options.body instanceof FormData) {
    const headers = config.headers as Record<string, string>;
    delete headers["Content-Type"];
  }

  const response = await fetch(url, config);

  /* ─────────────────────────────────────────────
     HANDLE BINARY (PDF)
     ───────────────────────────────────────────── */
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/pdf")) {
    if (!response.ok) {
      throw new ApiError("Failed to download PDF", response.status);
    }
    return response.blob() as unknown as T;
  }

  /* ─────────────────────────────────────────────
     PARSE JSON
     ───────────────────────────────────────────── */
  const json: ApiResponse<T> = await response.json();

  /* ─────────────────────────────────────────────
     HANDLE ERRORS
     ───────────────────────────────────────────── */
  if (!response.ok) {
    // 🔐 Handle expired access token
    if (
      response.status === 401 &&
      !retry &&
      !url.includes("/api/auth/refresh")
    ) {
      // Prevent multiple refresh calls
      if (!isRefreshing) {
        isRefreshing = true;

        refreshPromise = refreshToken().finally(() => {
          isRefreshing = false;
        });
      }

      const success = await refreshPromise;

      if (success) {
        // Retry original request ONCE
        return apiFetch<T>(url, options, true);
      }

      // ❌ Refresh token expired → propagate error
      throw new ApiError("SESSION_EXPIRED", 401);
    }

    throw new ApiError(
      json.error || "Something went wrong",
      response.status,
      json.details || json.errors
    );
  }

  return json.data as T;
}

/* ═══════════════════════════════════════════════
   API METHODS
   ═══════════════════════════════════════════════ */

export const api = {
  get: <T = unknown>(url: string) =>
    apiFetch<T>(url, { method: "GET" }),

  post: <T = unknown>(url: string, body?: unknown) =>
    apiFetch<T>(url, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T = unknown>(url: string, body?: unknown) =>
    apiFetch<T>(url, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T = unknown>(url: string) =>
    apiFetch<T>(url, { method: "DELETE" }),

  /** Download a blob (e.g., PDF) */
  download: async (url: string, filename: string) => {
    const blob = await apiFetch<Blob>(url);

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(a.href);
  },
};

export { ApiError };
export type { ApiResponse };
