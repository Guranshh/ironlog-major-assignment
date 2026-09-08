"use client"; // hover is a browser event, so this part has to run on the client

import Link from "next/link";
import { useRef } from "react";
import { preloadPostAction } from "@/lib/actions";

export function PostLink({
  urlId,
  className,
  children,
}: {
  urlId: string;
  className?: string;
  children: React.ReactNode;
}) {
  const hasPreloaded = useRef(false); // a ref, not state, because changing it shouldn't re-render

  function handleMouseEnter() {
    if (hasPreloaded.current) {
      return; // only preload once per mount, no matter how often the pointer crosses the link
    }
    hasPreloaded.current = true;
    void preloadPostAction(urlId); // fire and forget: we don't block hover on the response
  }

  return (
    <Link
      href={`/post/${urlId}`}
      className={className}
      onMouseEnter={handleMouseEnter} // requirement 2: preload the post on hover
      data-test-id={`post-link-${urlId}`} // gives the e2e test something to hover
    >
      {children}
    </Link>
  );
}