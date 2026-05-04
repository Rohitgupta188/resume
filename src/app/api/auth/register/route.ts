import { NextRequest } from "next/server";
import { userRegistrationApiSchema } from "@/lib/validation";
import { setAuthCookies } from "@/lib/auth";
import { registerUser, sanitizeUser } from "@/lib/auth/auth.service";
import { handleRoute, created, error, conflict, validationError } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  return handleRoute(async () => {
    const body = await req.json();

    const parsed = userRegistrationApiSchema.safeParse(body);
    if (!parsed.success) {
      return validationError(parsed.error);
    }

    const { username, email, password } = parsed.data;

    const result = await registerUser({ username, email, password });

    if (!result.ok) {
      return result.status === 409
        ? conflict(result.error)
        : error(result.error, result.status);
    }

    await setAuthCookies(result.accessToken, result.refreshToken);

    return created({
      message: "Account created successfully",
      user: sanitizeUser(result.user),
    });
  });
}
