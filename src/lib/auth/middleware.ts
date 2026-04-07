import { NextRequest, NextResponse } from "next/server";
import { verifyToken, signAccessToken, type JwtPayload } from "./jwt";
import { getAccessToken, getRefreshToken, setAuthCookies } from "./cookies";

export type AuthenticatedRequest = {
  user: JwtPayload;
};

type RouteHandler<T = any> = (
  req: NextRequest,
  context: AuthenticatedRequest & T
) => Promise<NextResponse>;

export function withAuth<T = any>(handler: RouteHandler<T>) {
  return async (req: NextRequest, context: T) => {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const result = await verifyToken(accessToken, "access");

    if (result.ok) {
      return handler(req, { ...context, user: result.payload });
    }

    // 🔁 Refresh flow
    if (result.error === "expired") {
      const refreshToken = await getRefreshToken();

      if (!refreshToken) {
        return NextResponse.json(
          { error: "Session expired. Please log in again." },
          { status: 401 }
        );
      }

      const refreshResult = await verifyToken(refreshToken, "refresh");

      if (!refreshResult.ok) {
        return NextResponse.json(
          { error: "Session expired. Please log in again." },
          { status: 401 }
        );
      }

      const { sub, email, username } = refreshResult.payload;

      const newAccessToken = await signAccessToken({
        sub,
        email,
        username,
      });

      await setAuthCookies(newAccessToken, refreshToken);

      return handler(req, { ...context, user: refreshResult.payload });
    }

    return NextResponse.json(
      { error: "Invalid token" },
      { status: 401 }
    );
  };
}

export async function getCurrentUser(): Promise<JwtPayload | null> {
  const accessToken = await getAccessToken();
  if (!accessToken) return null;

  const result = await verifyToken(accessToken, "access");
  return result.ok ? result.payload : null;
}
