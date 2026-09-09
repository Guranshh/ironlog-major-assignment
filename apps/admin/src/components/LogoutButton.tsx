"use client"; // needs an onClick handler

import { useRouter } from "next/navigation";
import { logoutAction } from "../utils/actions";

export function LogoutButton() {
  const router = useRouter();

  async function handleClick() {
    await logoutAction(); // clears the auth_token cookie on the server
    router.refresh(); // re-fetch the page so it re-renders as logged out
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