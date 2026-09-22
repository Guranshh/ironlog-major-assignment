"use server"; // everything exported here runs on the server and can be called from client components

import { revalidateTag } from "next/cache"; // clears the cached queries tagged "posts"
import { getPost } from "./db/cached";
import { addComment } from "./db/comments";
import { toggleLike, updatePost } from "./db/posts";
import { validatePostUpdate, validateUrlId } from "./validation";

// Requirement 2: warm the cache for a post before the user clicks its link.
export const preloadPostAction = async (urlId: unknown): Promise<void> => {
  const validUrlId = validateUrlId(urlId); // requirement 4: validate even a preload
  await getPost(validUrlId); // populates the cache, so the detail page renders from cache
};

// Requirement 7: toggle the like. Returns the new state so the client can display it.
export const toggleLikeAction = async (
  urlId: unknown,
): Promise<{ likes: number; liked: boolean }> => {
  const validUrlId = validateUrlId(urlId); // never trust input from the client
  const result = await toggleLike(validUrlId);

  revalidateTag("posts"); // the cached post now has a stale like count, so drop it

  return result;
};

// Requirement 8: update a post.
export const updatePostAction = async (urlId: unknown, data: unknown): Promise<void> => {
  const validUrlId = validateUrlId(urlId);
  const validData = validatePostUpdate(data);

  await updatePost(validUrlId, validData);

  revalidateTag("posts"); // the cached post and lists are now stale
};

// Major feature: add a comment, or a reply when parentId is a comment id.
// Returns an error message instead of throwing, so the form can show it to the user.
export const addCommentAction = async (
  urlId: unknown,
  parentId: unknown,
  author: unknown,
  content: unknown,
): Promise<{ error?: string }> => {
  const validUrlId = validateUrlId(urlId);
  const name = typeof author === "string" ? author.trim() : ""; // anything that isn't text counts as empty
  const text = typeof content === "string" ? content.trim() : "";

  if (name.length === 0) {
    return { error: "Please enter your name" };
  }
  if (name.length > 50) {
    return { error: "Name must be 50 characters or less" };
  }
  if (text.length === 0) {
    return { error: "Comment cannot be empty" };
  }
  if (text.length > 1000) {
    return { error: "Comment must be 1000 characters or less" };
  }

  const validParent =
    typeof parentId === "number" && Number.isInteger(parentId) ? parentId : null; // anything else means top-level

  const saved = await addComment(validUrlId, validParent, name, text);
  if (!saved) {
    return { error: "Could not save your comment" };
  }

  return {}; // no error means it worked
};