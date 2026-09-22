"use server"; // runs on the server, callable from the client form

import { client } from "@repo/db/client";
import { isLoggedIn } from "./auth";
import { validateForm, type PostForm } from "./validation";

// Turns "My New Title" into "my-new-title" for the URL.
const toUrlId = (title: string): string =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-") // anything that isn't a letter or digit becomes a hyphen
    .replace(/^-+|-+$/g, ""); // trim hyphens off both ends

// Tells the live blog to clear its one-hour cache, so admin changes show up straight away.
async function refreshBlog(): Promise<void> {
  const webUrl = process.env.WEB_URL; // e.g. https://ironlog-web.vercel.app
  const secret = process.env.REVALIDATE_SECRET;
  if (!webUrl || !secret) {
    return; // not set on a laptop or in tests, so skip
  }
  try {
    await fetch(`${webUrl}/api/revalidate`, {
      method: "POST",
      headers: { "x-revalidate-secret": secret },
    });
  } catch {
    // the blog was unreachable: its cache still refreshes on its own within the hour
  }
}

// Save an existing post. `urlId` identifies which one.
export async function savePostAction(
  urlId: string,
  form: PostForm,
): Promise<{ ok: boolean; error?: string }> {
  if (!(await isLoggedIn())) {
    return { ok: false, error: "Not authorised" }; // never trust the client to have checked
  }

  const errors = validateForm(form);
  if (Object.keys(errors).length > 0) {
    return { ok: false, error: "Please fix the errors before saving" };
  }

  const tagNames = form.tags.split(",").map((tag) => tag.trim()).filter(Boolean);

  await client.db.post.update({
    where: { urlId },
    data: {
      title: form.title,
      category: form.category,
      description: form.description,
      content: form.content,
      imageUrl: form.imageUrl,
      tags: {
        set: [], // disconnect the current tags first
        connectOrCreate: tagNames.map((name) => ({
          where: { name },
          create: { name },
        })), // then connect the new ones, creating any that don't exist
      },
    },
  });

  await refreshBlog();
  return { ok: true };
}

// Create a brand new post.
export async function createPostAction(
  form: PostForm,
): Promise<{ ok: boolean; error?: string }> {
  if (!(await isLoggedIn())) {
    return { ok: false, error: "Not authorised" };
  }

  const errors = validateForm(form);
  if (Object.keys(errors).length > 0) {
    return { ok: false, error: "Please fix the errors before saving" };
  }

  const tagNames = form.tags.split(",").map((tag) => tag.trim()).filter(Boolean);

  await client.db.post.create({
    data: {
      urlId: toUrlId(form.title), // the URL comes from the title
      title: form.title,
      category: form.category,
      description: form.description,
      content: form.content,
      imageUrl: form.imageUrl,
      date: new Date(), // created now
      views: 0,
      active: true,
      tags: {
        connectOrCreate: tagNames.map((name) => ({
          where: { name },
          create: { name },
        })),
      },
    },
  });

  await refreshBlog();
  return { ok: true };
}

// Requirement: activate / deactivate from the list, saving automatically.
export async function toggleActiveAction(
  id: number,
): Promise<{ ok: boolean; active: boolean }> {
  if (!(await isLoggedIn())) {
    return { ok: false, active: false };
  }

  const post = await client.db.post.findUnique({ where: { id } });
  if (!post) {
    return { ok: false, active: false };
  }

  const updated = await client.db.post.update({
    where: { id },
    data: { active: !post.active }, // flip it
  });

  await refreshBlog();
  return { ok: true, active: updated.active };
}