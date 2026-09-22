"use client"; // needs useState and an onClick handler, so it runs in the browser

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit() {
    setIsPending(true);
    setError("");

    // POST to the API route, which checks the password and sets the JWT cookie.
    const response = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setIsPending(false);

    if (!response.ok) {
      setError("Incorrect password");
      return;
    }

    router.refresh(); // re-fetch the page so it renders as logged in
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center gap-6 px-6">
      <div className="text-center">
        <p className="font-heading text-4xl font-extrabold tracking-tight">
          IRON<span className="text-wsu">LOG</span>
        </p>
        <h2 className="text-secondary mt-2 text-sm">Sign in to your account</h2>
      </div>

      <div className="flex flex-col gap-3">
        <label htmlFor="password" className="text-secondary text-sm">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleSubmit();
            }
          }}
          data-test-id="password-input"
          className="border-secondary/30 text-primary rounded-md border bg-transparent px-3 py-2 text-sm"
        />

        {error && (
          <p data-test-id="login-error" className="text-sm text-red-500">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending}
          data-test-id="sign-in-button"
          className="bg-wsu rounded-md px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          Sign In
        </button>
      </div>
    </div>
  );
}