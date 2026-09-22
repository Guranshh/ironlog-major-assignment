"use client"; // runs in the browser, because it has typing and clicking

import { addCommentAction } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function CommentForm({
  urlId,
  parentId,
  onDone,
  onCancel,
}: {
  urlId: string;
  parentId?: number; // set when this form is a reply
  onDone?: () => void; // called after a successful save
  onCancel?: () => void; // when set, a Cancel button is shown
}) {
  const router = useRouter();
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit() {
    setError("");
    setSaving(true);
    const result = await addCommentAction(urlId, parentId ?? null, author, content); // runs on the server
    setSaving(false);

    if (result.error) {
      setError(result.error); // show why it was rejected
      return;
    }

    setAuthor("");
    setContent("");
    router.refresh(); // redraw the page so the new comment appears
    if (onDone) {
      onDone();
    }
  }

  return (
    <div data-test-id="comment-form" className="flex flex-col gap-3">
      <input
        data-test-id="comment-author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        placeholder="Your name"
        className="border-secondary/30 bg-transparent text-primary rounded-md border px-3 py-2 text-sm"
      />
      <textarea
        data-test-id="comment-content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={parentId ? "Write a reply..." : "Share your thoughts..."}
        rows={3}
        className="border-secondary/30 bg-transparent text-primary rounded-md border px-3 py-2 text-sm"
      />
      {error && (
        <p data-test-id="comment-error" className="text-sm text-red-600">
          {error}
        </p>
      )}
      <div className="flex gap-2">
        <button
          type="button"
          data-test-id="comment-submit"
          onClick={submit}
          disabled={saving}
          className="bg-wsu rounded-md px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {saving ? "Posting..." : parentId ? "Post reply" : "Post comment"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-secondary rounded-md px-4 py-2 text-sm hover:underline"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}