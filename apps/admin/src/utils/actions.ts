"use server"; // these run on the server and can be called from client components

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const PASSWORD = "123"; // hard-coded, as the requirement specifies
const COOKIE_NAME = "auth_token"; // the tests look for a cookie with exactly this name

// Returns an error message, or empty string on success.
export async function loginAction(password: unknown): Promise<string> {
  if (typeof password !== "string") { // never trust what arrives from the client
    return "Invalid password";
  }

  if (password !== PASSWORD) {
    return "Incorrect password";
  }

  const store = await cookies(); // the server-side cookie store for this request
  store.set(COOKIE_NAME, "signed-in", {
    httpOnly: true, // the requirement asks for httpOnly, so client JavaScript can't read it
    path: "/", // available on every route, not just the one that set it
    sameSite: "lax",
  });

  revalidatePath("/"); // the home page renders differently now, so drop its cache
  return "";
}

export async function logoutAction(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME); // removing the cookie is what "logged out" means here

  revalidatePath("/");
}