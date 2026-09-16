import { test as setup } from "@playwright/test";

////////////////////////////////////////////////////////
// Authentication for Assignment 3
// The login now goes through the real API route, which
// issues a JWT and sets it as the auth_token cookie.
////////////////////////////////////////////////////////

setup(
  "authenticate assignment 3",
  { tag: "@a3" },
  async ({ playwright }) => {
    const authFile = ".auth/user.json";

    const apiContext = await playwright.request.newContext();

    await apiContext.post("/api/auth", {
      data: JSON.stringify({ password: "123" }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    await apiContext.storageState({ path: authFile }); // saves whatever cookie the server set
  },
);