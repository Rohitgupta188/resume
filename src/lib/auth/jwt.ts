import { SignJWT, jwtVerify, errors } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_ISSUER = process.env.JWT_ISSUER ?? "ai-resume";
const ACCESS_TOKEN_TTL = process.env.ACCESS_TOKEN_TTL ?? "15m";
const REFRESH_TOKEN_TTL = process.env.REFRESH_TOKEN_TTL ?? "7d";

function getSecretKey(): Uint8Array {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return new TextEncoder().encode(JWT_SECRET);
}

export interface JwtPayload {
  sub: string; // userId
  email: string;
  username: string;
  type: "access" | "refresh";
}

export async function signAccessToken(payload: Omit<JwtPayload, "type">): Promise<string> {
  return new SignJWT({ ...payload, type: "access" as const })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(JWT_ISSUER)
    .setExpirationTime(ACCESS_TOKEN_TTL)
    .setJti(crypto.randomUUID())
    .sign(getSecretKey());
}

export async function signRefreshToken(payload: Omit<JwtPayload, "type">): Promise<string> {
  return new SignJWT({ ...payload, type: "refresh" as const })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(JWT_ISSUER)
    .setExpirationTime(REFRESH_TOKEN_TTL)
    .setJti(crypto.randomUUID())
    .sign(getSecretKey());
}

export async function signTokenPair(
  payload: Omit<JwtPayload, "type">
): Promise<{ accessToken: string; refreshToken: string }> {
  const [accessToken, refreshToken] = await Promise.all([
    signAccessToken(payload),
    signRefreshToken(payload),
  ]);
  return { accessToken, refreshToken };
}

export type VerifyResult =
  | { ok: true; payload: JwtPayload }
  | { ok: false; error: "expired" | "invalid" };

export async function verifyToken(
  token: string,
  expectedType?: "access" | "refresh"
): Promise<VerifyResult> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      issuer: JWT_ISSUER,
    });

    const typed = payload as unknown as JwtPayload;

    if (expectedType && typed.type !== expectedType) {
      return { ok: false, error: "invalid" };
    }

    return { ok: true, payload: typed };
  } catch (err) {
    if (err instanceof errors.JWTExpired) {
      return { ok: false, error: "expired" };
    }
    return { ok: false, error: "invalid" };
  }
}
