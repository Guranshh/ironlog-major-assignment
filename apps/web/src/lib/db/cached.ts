import { unstable_cache } from "next/cache"; // Next's data cache, works with any async function
import { findAllPosts, findPost, findPosts, findPostsByTag, findTags } from "./posts";
import type { Post } from "@repo/db/data";

const ONE_HOUR = 3600; // seconds — the required 1 hour update interval

// unstable_cache serialises results to JSON, and JSON has no Date type, so dates come back as strings.
const reviveDate = (post: Post): Post => ({ ...post, date: new Date(post.date) });
const reviveDates = (posts: Post[]): Post[] => posts.map(reviveDate);

const cachedPosts = unstable_cache(findPosts, ["posts"], {
  revalidate: ONE_HOUR,
  tags: ["posts"], // tags let us invalidate early after a like or an update
});

const cachedAllPosts = unstable_cache(findAllPosts, ["all-posts"], {
  revalidate: ONE_HOUR,
  tags: ["posts"],
});

const cachedPostsByTag = unstable_cache(findPostsByTag, ["posts-by-tag"], {
  revalidate: ONE_HOUR,
  tags: ["posts"],
});

const cachedPost = unstable_cache(findPost, ["post"], {
  revalidate: ONE_HOUR,
  tags: ["posts"],
});

export const getPosts = async (): Promise<Post[]> => reviveDates(await cachedPosts());

// Includes inactive posts. The category list shows every category, even ones with no visible posts.
export const getAllPosts = async (): Promise<Post[]> => reviveDates(await cachedAllPosts());

export const getPostsByTag = async (name: string): Promise<Post[]> =>
  reviveDates(await cachedPostsByTag(name));

export const getPost = async (urlId: string): Promise<Post | null> => {
  const post = await cachedPost(urlId);
  return post ? reviveDate(post) : null; // null when no post matches
};

export const getTags = unstable_cache(findTags, ["tags"], {
  revalidate: ONE_HOUR,
  tags: ["posts"],
});

// Requirement 2: warm the cache for a post before the user clicks its link.
export const preloadPost = (urlId: string): void => {
  void getPost(urlId); // `void` makes it explicit that we're deliberately not waiting
};