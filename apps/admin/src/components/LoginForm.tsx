"use client"; // needs useState and an onClick handler, so it runs in the browser

import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginAction } from "../utils/actions";

export function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit() {
    setIsPending(true);
    const message = await loginAction(password); // the server action sets the cookie on success
    setError(message);
    setIsPending(false);

    if (!message) {
      router.refresh(); // no error, so re-fetch the page and it renders as logged in
    }
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center gap-6 px-6">
      <div className="text-center">
        <h1 className="text-wsu text-2xl font-bold">Full Stack Blog</h1>
        <h2 className="text-secondary mt-2 text-sm">Sign in to your account</h2>
      </div>

      <div className="flex flex-col gap-3">
        <label htmlFor="password" className="text-secondary text-sm">
          Password
        </label>
        <input
          id="password" // the label's htmlFor points here, which is how getByLabel finds it
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleSubmit(); // submitting with Enter, without needing a form element
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
          className="bg-wsu rounded-md px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          Sign In
        </button>
      </div>
    </div>
  );
}