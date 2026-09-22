"use client"; // runs in the browser: it reads a file the user picks

import { useState } from "react";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME; // NEXT_PUBLIC_ means it's safe for the browser
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET; // the unsigned preset, no secret needed
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB in bytes

export function ImageUpload({ onUploaded }: { onUploaded: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; // the first (only) chosen file
    event.target.value = ""; // reset the picker so the same file can be chosen again later
    if (!file) {
      return; // the user closed the picker without choosing
    }

    setError("");
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file");
      return;
    }
    if (file.size > MAX_SIZE) {
      setError("Image must be 5 MB or smaller");
      return;
    }
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      setError("Image uploads are not set up");
      return;
    }

    const data = new FormData(); // the package format for sending a file over the web
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET);

    setUploading(true);
    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: data,
      });
      const result = await response.json();

      if (!response.ok || !result.secure_url) {
        setError("Upload failed, please try again");
      } else {
        onUploaded(result.secure_url); // hand the new https address to the form
      }
    } catch {
      setError("Upload failed, please check your connection"); // no internet, or Cloudinary unreachable
    }
    setUploading(false);
  }

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="imageUpload" className="text-secondary text-sm">
        Or upload an image
      </label>
      <input
        id="imageUpload"
        type="file"
        accept="image/*" // the picker only shows images
        data-test-id="image-upload"
        onChange={handleFile}
        disabled={uploading}
        className="text-secondary file:bg-wsu text-sm file:mr-3 file:rounded-md file:border-0 file:px-3 file:py-1.5 file:text-white"
      />
      {uploading && (
        <span data-test-id="upload-status" className="text-secondary text-xs">
          Uploading...
        </span>
      )}
      {error && (
        <span data-test-id="upload-error" className="text-xs text-red-500">
          {error}
        </span>
      )}
    </div>
  );
}