"use client"; // needs form state and an onClick handler, so it runs in the browser

import { useRouter } from "next/navigation";
import { useState } from "react";
import { updatePostAction } from "../../lib/actions"; // relative path, so Vitest resolves it without an alias

export function EditForm({
  urlId,
  title,
  description,
  content,
  tags,
}: {
  urlId: string;
  title: string;
  description: string;
  content: string;
  tags: string;
}) {
  const router = useRouter(); // lets us refresh the server-rendered page after saving
  const [isOpen, setIsOpen] = useState(false); // the form is hidden until the user chooses to edit

  const [titleValue, setTitleValue] = useState(title); // one piece of state per field
  const [descriptionValue, setDescriptionValue] = useState(description);
  const [contentValue, setContentValue] = useState(content);
  const [tagsValue, setTagsValue] = useState(tags);

  const [error, setError] = useState(""); // shows whatever the server validation rejected
  const [isPending, setIsPending] = useState(false);

  async function handleSave() {
    setIsPending(true);
    setError("");

    try {
      await updatePostAction(urlId, {
        title: titleValue,
        description: descriptionValue,
        content: contentValue,
        tags: tagsValue,
      });
      setIsOpen(false); // close the form on success
      router.refresh(); // client-side mutation: re-fetch the page so the new values show
    } catch {
      setError("Could not save the post. Check every field is filled in."); // validation threw on the server
    }

    setIsPending(false);
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        data-test-id="edit-button"
        className="border-secondary/30 text-secondary hover:bg-secondary/10 self-start rounded-full border px-4 py-1.5 text-sm transition-colors"
      >
        Edit post
      </button>
    );
  }

  return (
    <div
      data-test-id="edit-form"
      className="border-secondary/20 flex flex-col gap-3 rounded-lg border p-4"
    >
      <label className="text-secondary flex flex-col gap-1 text-xs">
        Title
        <input
          type="text"
          value={titleValue}
          onChange={(event) => setTitleValue(event.target.value)}
          data-test-id="edit-title"
          className="border-secondary/30 text-primary rounded border bg-transparent px-2 py-1 text-sm"
        />
      </label>

      <label className="text-secondary flex flex-col gap-1 text-xs">
        Description
        <textarea
          value={descriptionValue}
          onChange={(event) => setDescriptionValue(event.target.value)}
          rows={3}
          data-test-id="edit-description"
          className="border-secondary/30 text-primary rounded border bg-transparent px-2 py-1 text-sm"
        />
      </label>

      <label className="text-secondary flex flex-col gap-1 text-xs">
        Content
        <textarea
          value={contentValue}
          onChange={(event) => setContentValue(event.target.value)}
          rows={8}
          data-test-id="edit-content"
          className="border-secondary/30 text-primary rounded border bg-transparent px-2 py-1 font-mono text-sm"
        />
      </label>

      <label className="text-secondary flex flex-col gap-1 text-xs">
        Tags (comma separated)
        <input
          type="text"
          value={tagsValue}
          onChange={(event) => setTagsValue(event.target.value)}
          data-test-id="edit-tags"
          className="border-secondary/30 text-primary rounded border bg-transparent px-2 py-1 text-sm"
        />
      </label>

      {error && ( // only rendered when the save failed
        <p data-test-id="edit-error" className="text-sm text-red-500">
          {error}
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          data-test-id="save-button"
          className="bg-wsu rounded-full px-4 py-1.5 text-sm text-white disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          data-test-id="cancel-button"
          className="border-secondary/30 text-secondary rounded-full border px-4 py-1.5 text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}