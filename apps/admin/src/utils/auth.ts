import jwt from "jsonwebtoken";
import { env } from "@repo/env/admin";
import { cookies } from "next/headers";

export async function isLoggedIn() {
  const userCookies = await cookies();

  // Assignment 3: the cookie must exist AND hold a token we signed ourselves.
  // jwt.verify throws if the signature is wrong or the token is malformed.
  const token = userCookies.get("auth_token")?.value;

  if (!token) {
    return false;
  }

  try {
    jwt.verify(token, env.JWT_SECRET || "");
    return true;
  } catch {
    return false; // tampered with, expired, or signed with a different secret
  }
}
