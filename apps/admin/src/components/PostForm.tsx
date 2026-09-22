"use client"; // the whole form is interactive: validation, previews, cursor tracking

import { marked } from "marked";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { createPostAction, savePostAction } from "../utils/actions";
import { validateForm, type FormErrors, type PostForm as FormData } from "../utils/validation";
import { ImageUpload } from "./ImageUpload"; // major feature: upload images to Cloudinary

export function PostForm({
  initial,
  urlId, // present when updating, absent when creating
}: {
  initial: FormData;
  urlId?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(initial);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showSummary, setShowSummary] = useState(false); // the "fix the errors" banner
  const [success, setSuccess] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const contentRef = useRef<HTMLTextAreaElement>(null); // to read and restore the cursor
  const cursor = useRef(0); // where the cursor was when the preview opened

  const update = (field: keyof FormData, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  async function handleSave() {
    const found = validateForm(form);
    setErrors(found);
    setSuccess(false);

    if (Object.keys(found).length > 0) {
      setShowSummary(true); // something failed, so show the banner and stop
      return;
    }

    setShowSummary(false);
    setIsSaving(true);

    // Update when we know which post, create otherwise.
    const result = urlId
      ? await savePostAction(urlId, form)
      : await createPostAction(form);

    setIsSaving(false);

    if (!result.ok) {
      setShowSummary(true);
      return;
    }

    if (urlId) {
      setSuccess(true); // updating: stay here so the admin can keep editing
      router.refresh();
    } else {
      router.push("/?saved=1"); // creating: go to the list to see the new post
    }
  }

  function togglePreview() {
    if (!previewing) {
      cursor.current = contentRef.current?.selectionStart ?? 0; // remember where the cursor was
      setPreviewing(true);
      return;
    }

    setPreviewing(false);
    // The textarea has to exist again before we can put the cursor back, so wait a tick.
    setTimeout(() => {
      const textarea = contentRef.current;
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(cursor.current, cursor.current);
      }
    }, 0);
  }

  return (
    <div className="flex flex-col gap-5">
      {showSummary && (
        <p data-test-id="form-error" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
          Please fix the errors before saving
        </p>
      )}

      {success && (
        <p
          data-test-id="form-success"
          className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700"
        >
          Post updated successfully
          <Link href="/" className="font-semibold underline">
            Back to all posts
          </Link>
        </p>
      )}

      {/* Labels use htmlFor rather than wrapping, so each one names exactly one field. */}
      <div className="flex flex-col gap-1">
        <label htmlFor="title" className="text-secondary text-sm">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={form.title}
          onChange={(event) => update("title", event.target.value)}
          className="border-secondary/30 text-primary rounded border bg-transparent px-3 py-2 text-sm"
        />
        {errors.title && <span className="text-xs text-red-500">{errors.title}</span>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="category" className="text-secondary text-sm">
          Category
        </label>
        <input
          id="category"
          type="text"
          value={form.category}
          onChange={(event) => update("category", event.target.value)}
          className="border-secondary/30 text-primary rounded border bg-transparent px-3 py-2 text-sm"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="text-secondary text-sm">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          value={form.description}
          onChange={(event) => update("description", event.target.value)}
          className="border-secondary/30 text-primary rounded border bg-transparent px-3 py-2 text-sm"
        />
        {errors.description && (
          <span className="text-xs text-red-500">{errors.description}</span>
        )}
      </div>

      <div>
        <button
          type="button"
          onClick={togglePreview}
          className="border-secondary/30 text-secondary hover:bg-secondary/10 rounded border px-3 py-1 text-sm"
        >
          {previewing ? "Close Preview" : "Preview"}
        </button>
      </div>

      {previewing ? (
        <div
          data-test-id="content-preview"
          className="border-secondary/30 text-primary rounded border px-3 py-2 text-sm [&_h1]:mb-2 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:mb-2 [&_h2]:text-xl [&_p]:mb-2"
          dangerouslySetInnerHTML={{ __html: marked.parse(form.content) as string }}
        />
      ) : (
        <div className="flex flex-col gap-1">
          <label htmlFor="content" className="text-secondary text-sm">
            Content
          </label>
          <textarea
            id="content"
            ref={contentRef}
            rows={12}
            value={form.content}
            onChange={(event) => update("content", event.target.value)}
            className="border-secondary/30 text-primary rounded border bg-transparent px-3 py-2 font-mono text-sm"
          />
          {errors.content && (
            <span className="text-xs text-red-500">{errors.content}</span>
          )}
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="imageUrl" className="text-secondary text-sm">
          Image URL
        </label>
        <input
          id="imageUrl"
          type="text"
          value={form.imageUrl}
          onChange={(event) => update("imageUrl", event.target.value)}
          className="border-secondary/30 text-primary rounded border bg-transparent px-3 py-2 text-sm"
        />
        {errors.imageUrl && (
          <span className="text-xs text-red-500">{errors.imageUrl}</span>
        )}
      </div>

      <ImageUpload onUploaded={(url) => update("imageUrl", url)} /> {/* fills the Image URL box after upload */}

      {form.imageUrl && (
        <img
          src={form.imageUrl}
          alt="Preview of the post image"
          data-test-id="image-preview" // sits under the input, as the requirement asks
          className="bg-secondary/10 h-48 w-full max-w-md rounded-lg object-cover"
        />
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="tags" className="text-secondary text-sm">
          Tags
        </label>
        <input
          id="tags"
          type="text"
          value={form.tags}
          onChange={(event) => update("tags", event.target.value)}
          className="border-secondary/30 text-primary rounded border bg-transparent px-3 py-2 text-sm"
        />
        {errors.tags && <span className="text-xs text-red-500">{errors.tags}</span>}
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={isSaving}
        data-test-id="save-button"
        className="bg-wsu self-start rounded-md px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
      >
        Save
      </button>
    </div>
  );
}