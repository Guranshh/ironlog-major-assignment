import { env } from "@repo/env/admin";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const COOKIE_NAME = "auth_token";
const ONE_DAY = 60 * 60 * 24; // seconds

// POST /api/auth — log in. The password is checked here, on the server.
export async function POST(request: Request) {
  let password: unknown;

  try {
    const body = await request.json();
    password = body?.password; // the client sends { password: "..." }
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (typeof password !== "string" || password !== env.PASSWORD) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  // The token is signed with our secret, so nobody can forge one without it.
  const token = jwt.sign({ role: "admin" }, env.JWT_SECRET, {
    expiresIn: ONE_DAY,
  });

  const response = NextResponse.json({ message: "Signed in" }, { status: 200 });

  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true, // client-side JavaScript can't read it
    path: "/",
    sameSite: "lax",
    maxAge: ONE_DAY,
  });

  return response;
}

// DELETE /api/auth — log out. Removing the cookie is all it takes.
export async function DELETE() {
  const response = NextResponse.json({ message: "Signed out" }, { status: 200 });

  response.cookies.delete(COOKIE_NAME);

  return response;
}