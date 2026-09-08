"use client"; // needs useState and an onClick handler, so it runs in the browser

import { useState } from "react";
import { toggleLikeAction } from "@/lib/actions";

export function LikeButton({
  urlId,
  likes,
  liked,
}: {
  urlId: string;
  likes: number;
  liked: boolean;
}) {
  const [count, setCount] = useState(likes); // local copy so the UI can update instantly
  const [isLiked, setIsLiked] = useState(liked); // drives the filled/outline thumb
  const [isPending, setIsPending] = useState(false); // stops double clicks while the action runs

  async function handleClick() {
    setIsPending(true);
    const result = await toggleLikeAction(urlId); // calls the server action over the network
    setCount(result.likes); // client-side mutation: swap in the values the server returned
    setIsLiked(result.liked);
    setIsPending(false);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-pressed={isLiked} // tells screen readers, and Playwright, whether it's currently liked
      data-test-id="like-button" // the Playwright config uses data-test-id, not data-testid
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm transition-colors disabled:opacity-50 ${
        isLiked
          ? "border-wsu bg-wsu/10 text-wsu" // liked: highlighted
          : "border-secondary/30 text-secondary hover:bg-secondary/10" // not liked: muted
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill={isLiked ? "currentColor" : "none"} // filled thumb when liked, outline when not
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path d="M7 10v11H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h3zm0 0 4.5-7a2.5 2.5 0 0 1 2.5 2.5V9h4.5a2 2 0 0 1 2 2.4l-1.4 7A2 2 0 0 1 17 20H7V10z" />
      </svg>
      <span data-test-id="like-count">{count}</span>
    </button>
  );
}