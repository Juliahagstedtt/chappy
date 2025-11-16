import { verifyToken } from "./Jwt.js";

export function validateJwt(authHeader?: string) {
  if (!authHeader) return null;

  let token = "";

  if (authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7).trim();
  } else {
    token = authHeader.split(" ")[1] ?? "";
  }

  if (!token) return null;

  try {
    const payload = verifyToken(token);
    return { userId: payload.userId };
  } catch {
    return null;
  }
}