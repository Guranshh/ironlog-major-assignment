import { unstable_cache } from "next/cache"; // Next's data cache, works with any async function
import {
  findAllPosts,
  findPost,
  findPosts,
  findPostsByTag,
  findTags,
  type PostWithLike,
} from "./posts";

const ONE_HOUR = 3600; // seconds, the required 1 hour update interval
const TEST_MODE = !!process.env.E2E; // true while the Playwright tests run

// unstable_cache serialises results to JSON, and JSON has no Date type, so dates come back as strings.
const reviveDate = (post: PostWithLike): PostWithLike => ({
  ...post,
  date: new Date(post.date), // turns a string back into a Date (a Date stays a Date)
});
const reviveDates = (posts: PostWithLike[]): PostWithLike[] => posts.map(reviveDate);

const cachedPosts = TEST_MODE
  ? findPosts // tests reset the database directly, so they must always read fresh rows
  : unstable_cache(findPosts, ["posts"], {
      revalidate: ONE_HOUR,
      tags: ["posts"], // tags let us clear the cache early after a like or an update
    });

const cachedAllPosts = TEST_MODE
  ? findAllPosts
  : unstable_cache(findAllPosts, ["all-posts"], {
      revalidate: ONE_HOUR,
      tags: ["posts"],
    });

const cachedPostsByTag = TEST_MODE
  ? findPostsByTag
  : unstable_cache(findPostsByTag, ["posts-by-tag"], {
      revalidate: ONE_HOUR,
      tags: ["posts"],
    });

const cachedPost = TEST_MODE
  ? findPost
  : unstable_cache(findPost, ["post"], {
      revalidate: ONE_HOUR,
      tags: ["posts"],
    });

export const getPosts = async (): Promise<PostWithLike[]> =>
  reviveDates(await cachedPosts()); // active posts only

export const getAllPosts = async (): Promise<PostWithLike[]> =>
  reviveDates(await cachedAllPosts()); // includes inactive posts

export const getPostsByTag = async (name: string): Promise<PostWithLike[]> =>
  reviveDates(await cachedPostsByTag(name));

export const getPost = async (urlId: string): Promise<PostWithLike | null> => {
  const post = await cachedPost(urlId);
  return post ? reviveDate(post) : null; // null when no post matches
};

export const getTags = TEST_MODE
  ? findTags
  : unstable_cache(findTags, ["tags"], {
      revalidate: ONE_HOUR,
      tags: ["posts"],
    });

// Requirement: warm the cache for a post before the user clicks its link.
export const preloadPost = (urlId: string): void => {
  void getPost(urlId); // `void` means we deliberately don't wait for it
};