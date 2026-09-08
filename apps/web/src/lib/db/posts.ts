import { getDb, rowToPost, type PostRow } from "./sqlite"; // low-level helpers
import { toUrlPath } from "@repo/utils/url"; // turns "Back-End" into "back-end"
import type { Post } from "@repo/db/data"; // reuse the existing Post type

export const findPosts = async (): Promise<Post[]> => { // async so the cache layer and pages can await it
  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM posts WHERE active = 1 ORDER BY date DESC") // newest first
    .all() as PostRow[];
  return rows.map(rowToPost); // convert every row's date/active into proper JS types
};

// Requirement 5: filtered list of posts based on tags. `name` is the URL slug, e.g. "back-end".
export const findPostsByTag = async (name: string): Promise<Post[]> => {
  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM posts WHERE active = 1 ORDER BY date DESC")
    .all() as PostRow[];
  return rows
    .map(rowToPost)
    .filter((post) =>
      post.tags.split(",").some((tag) => toUrlPath(tag) === name), // same comparison the old static page used
    );
};

export const findPost = async (urlId: string): Promise<Post | null> => {
  const db = getDb();
  const row = db
    .prepare("SELECT * FROM posts WHERE urlId = ?") // ? is a parameter, safe from injection
    .get(urlId) as PostRow | undefined;
  return row ? rowToPost(row) : null; // null when no post matches
};

// Requirement 6: list of available tags, with how many posts use each one.
export const findTags = async (): Promise<{ name: string; count: number }[]> => {
  const db = getDb();
  const rows = db
    .prepare("SELECT tags FROM posts WHERE active = 1")
    .all() as { tags: string }[];

  const result: { name: string; count: number }[] = [];
  for (const row of rows) {
    for (const tag of row.tags.split(",")) {
      if (!tag) continue;
      const existing = result.find((item) => item.name === tag);
      if (existing) {
        existing.count = existing.count + 1; // seen before, bump the count
      } else {
        result.push({ name: tag, count: 1 }); // first time we've seen this tag
      }
    }
  }
  return result.sort((a, b) => a.name.localeCompare(b.name)); // alphabetical for a stable UI order
};

// Requirement 7: like a post. Returns the new like count.
export const incrementLikes = async (urlId: string): Promise<number> => {
  const db = getDb();
  db.prepare("UPDATE posts SET likes = likes + 1 WHERE urlId = ?").run(urlId); // += in SQL avoids a read-then-write race
  const row = db
    .prepare("SELECT likes FROM posts WHERE urlId = ?")
    .get(urlId) as { likes: number } | undefined;
  return row ? row.likes : 0;
};

// Requirement 8: update a post.
export const updatePost = async (
  urlId: string,
  data: { title: string; description: string; content: string; tags: string },
): Promise<void> => {
  const db = getDb();
  db.prepare(
    "UPDATE posts SET title = ?, description = ?, content = ?, tags = ? WHERE urlId = ?",
  ).run(data.title, data.description, data.content, data.tags, urlId); // order matches the ? positions
};