import { clearAuthCookies } from "@/lib/auth";
import { handleRoute, success } from "@/lib/api-response";

export async function POST() {
  return handleRoute(async () => {
    await clearAuthCookies();

    return success({ message: "Logged out successfully" });
  });
}
