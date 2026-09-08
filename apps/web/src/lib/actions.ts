"use server"; // everything exported here runs on the server and can be called from client components

import { revalidateTag } from "next/cache"; // clears the cached queries tagged "posts"
import { getPost } from "./db/cached";
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