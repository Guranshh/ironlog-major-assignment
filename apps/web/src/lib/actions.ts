"use server"; // everything exported here runs on the server and can be called from client components

import { revalidateTag } from "next/cache"; // clears the cached queries tagged "posts"
import { toggleLike, updatePost } from "./db/posts";
import { validatePostUpdate, validateUrlId } from "./validation";

// Requirement 7: toggle the like. Returns the new state so the client can display it.
export const toggleLikeAction = async (
  urlId: unknown,
): Promise<{ likes: number; liked: boolean }> => {
  const validUrlId = validateUrlId(urlId); // requirement 4: never trust input from the client
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