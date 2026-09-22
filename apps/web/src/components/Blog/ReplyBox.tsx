"use client";

import { useState } from "react";
import { CommentForm } from "./CommentForm";

export function ReplyBox({ urlId, parentId }: { urlId: string; parentId: number }) {
  const [open, setOpen] = useState(false); // is the reply form showing?

  return (
    <div className="mt-2">
      {open ? (
        <CommentForm
          urlId={urlId}
          parentId={parentId}
          onDone={() => setOpen(false)} // close after posting
          onCancel={() => setOpen(false)}
        />
      ) : (
        <button
          type="button"
          data-test-id="reply-button"
          onClick={() => setOpen(true)}
          className="text-wsu text-xs font-semibold hover:underline"
        >
          Reply
        </button>
      )}
    </div>
  );
}