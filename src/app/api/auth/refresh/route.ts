import { verifyToken, signAccessToken, setAuthCookies, getRefreshToken } from "@/lib/auth";
import { handleRoute, success, unauthorized } from "@/lib/api-response";

export async function POST() {
  return handleRoute(async () => {
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      return unauthorized("No refresh token found. Please log in again.");
    }

    const result = await verifyToken(refreshToken, "refresh");

    if (!result.ok) {
      return unauthorized("Invalid or expired refresh token. Please log in again.");
    }

    const { sub, email, username } = result.payload;
    const newAccessToken = await signAccessToken({ sub, email, username });

    await setAuthCookies(newAccessToken, refreshToken);

    return success({ message: "Token refreshed successfully" });
  });
}
