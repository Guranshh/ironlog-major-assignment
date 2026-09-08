import { unstable_cache } from "next/cache"; // Next's data cache, works with any async function
import { findPost, findPosts, findPostsByTag, findTags } from "./posts";
import type { Post } from "@repo/db/data";

const ONE_HOUR = 3600; // seconds — the required 1 hour update interval

// unstable_cache serialises results to JSON, and JSON has no Date type, so dates come back as strings.
// These helpers turn them back into real Date objects before the components use them.
const reviveDate = (post: Post): Post => ({ ...post, date: new Date(post.date) });
const reviveDates = (posts: Post[]): Post[] => posts.map(reviveDate);

const cachedPosts = unstable_cache(
  findPosts, // the function whose result gets cached
  ["posts"], // cache key parts — arguments are appended to this automatically
  { revalidate: ONE_HOUR, tags: ["posts"] }, // tags let us invalidate early after a like or an update
);

const cachedPostsByTag = unstable_cache(findPostsByTag, ["posts-by-tag"], {
  revalidate: ONE_HOUR,
  tags: ["posts"],
});

const cachedPost = unstable_cache(findPost, ["post"], {
  revalidate: ONE_HOUR,
  tags: ["posts"],
});

// The exported functions wrap the cached ones so callers always get proper Date objects.
export const getPosts = async (): Promise<Post[]> => reviveDates(await cachedPosts());

export const getPostsByTag = async (name: string): Promise<Post[]> =>
  reviveDates(await cachedPostsByTag(name));

export const getPost = async (urlId: string): Promise<Post | null> => {
  const post = await cachedPost(urlId);
  return post ? reviveDate(post) : null; // null when no post matches
};

// Tags have no dates, so this one needs no revival.
export const getTags = unstable_cache(findTags, ["tags"], {
  revalidate: ONE_HOUR,
  tags: ["posts"],
});

// Requirement 2: kick off the post query without awaiting it, so the result is
// already in the cache by the time the user actually clicks through.
export const preloadPost = (urlId: string): void => {
  void getPost(urlId); // `void` makes it explicit that we're deliberately not waiting
};