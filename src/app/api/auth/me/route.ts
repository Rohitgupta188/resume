import { NextRequest } from "next/server";
import { withAuth } from "@/lib/auth";
import { handleRoute, success } from "@/lib/api-response";

export const GET = withAuth(async (req, { user }) => {
  return handleRoute(async () => {
    return success({
      user: {
        id: user.sub,
        email: user.email,
        username: user.username,
      },
    });
  });
});
