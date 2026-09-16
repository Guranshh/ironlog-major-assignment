"use client"; // needs an onClick handler

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function handleClick() {
    // DELETE removes the cookie, as the requirement specifies.
    await fetch("/api/auth", { method: "DELETE" });
    router.refresh(); // re-fetch the page so it renders as logged out
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      data-test-id="logout-button"
      className="border-secondary/30 text-secondary hover:bg-secondary/10 rounded-md border px-3 py-1.5 text-sm"
    >
      Logout
    </button>
  );
}