import { NextRequest } from "next/server";
import { userLoginSchema } from "@/lib/validation";
import { setAuthCookies } from "@/lib/auth";
import { loginUser, sanitizeUser } from "@/lib/auth/auth.service";
import { handleRoute, success, unauthorized, validationError, notFound } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  return handleRoute(async () => {
    const body = await req.json();

    const parsed = userLoginSchema.safeParse(body);
    if (!parsed.success) {
      return validationError(parsed.error);
    }

    const result = await loginUser(parsed.data);

    if (!result.ok) {
      
      if (result.error === "USER_NOT_FOUND") {
        return notFound("User not found");
      }

      if (result.error === "INVALID_PASSWORD") {
        return unauthorized("Invalid email or password");
      }

      return unauthorized(result.error || "Login failed");
    }

    await setAuthCookies(result.accessToken, result.refreshToken);

    return success({
      message: "Logged in successfully",
      user: sanitizeUser(result.user),
    });
  });
}
