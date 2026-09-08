import { getDb, rowToPost, type PostRow, type PostWithLike } from "./sqlite"; // low-level helpers
import { toUrlPath } from "@repo/utils/url"; // turns "Back-End" into "back-end"

export const findPosts = async (): Promise<PostWithLike[]> => { // active posts, for the blog list
  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM posts WHERE active = 1 ORDER BY date DESC") // newest first
    .all() as PostRow[];
  return rows.map(rowToPost);
};

// Every post regardless of active flag. The left menu's category list needs these,
// because categories are listed even when their posts aren't shown.
export const findAllPosts = async (): Promise<PostWithLike[]> => {
  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM posts ORDER BY date DESC")
    .all() as PostRow[];
  return rows.map(rowToPost);
};

// Requirement 5: filtered list of posts based on tags. `name` is the URL slug, e.g. "back-end".
export const findPostsByTag = async (name: string): Promise<PostWithLike[]> => {
  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM posts WHERE active = 1 ORDER BY date DESC")
    .all() as PostRow[];
  return rows
    .map(rowToPost)
    .filter((post) =>
      post.tags.split(",").some((tag) => toUrlPath(tag) === name),
    );
};

export const findPost = async (urlId: string): Promise<PostWithLike | null> => {
  const db = getDb();
  const row = db
    .prepare("SELECT * FROM posts WHERE urlId = ?") // ? is a parameter, safe from injection
    .get(urlId) as PostRow | undefined;
  return row ? rowToPost(row) : null;
};

// Requirement 6: list of available tags, with how many posts use each one.
export const findTags = async (): Promise<{ name: string; count: number }[]> => {
  const db = getDb();
  const rows = db
    .prepare("SELECT tags FROM posts WHERE active = 1") // only active posts contribute tags
    .all() as { tags: string }[];

  const result: { name: string; count: number }[] = [];
  for (const row of rows) {
    for (const tag of row.tags.split(",")) {
      if (!tag) continue;
      const existing = result.find((item) => item.name === tag);
      if (existing) {
        existing.count = existing.count + 1;
      } else {
        result.push({ name: tag, count: 1 });
      }
    }
  }
  return result.sort((a, b) => a.name.localeCompare(b.name));
};

// Requirement 7: toggle the like on a post. Returns the new count and state.
export const toggleLike = async (
  urlId: string,
): Promise<{ likes: number; liked: boolean }> => {
  const db = getDb();

  db.prepare(`
    UPDATE posts
    SET liked = CASE WHEN liked = 1 THEN 0 ELSE 1 END,
        likes = CASE WHEN liked = 1 THEN likes - 1 ELSE likes + 1 END
    WHERE urlId = ?
  `).run(urlId); // doing it in SQL avoids reading the value into JS and writing it back

  const row = db
    .prepare("SELECT likes, liked FROM posts WHERE urlId = ?")
    .get(urlId) as { likes: number; liked: number } | undefined;

  return row
    ? { likes: row.likes, liked: row.liked === 1 }
    : { likes: 0, liked: false };
};

// Requirement 8: update a post.
export const updatePost = async (
  urlId: string,
  data: { title: string; description: string; content: string; tags: string },
): Promise<void> => {
  const db = getDb();
  db.prepare(
    "UPDATE posts SET title = ?, description = ?, content = ?, tags = ? WHERE urlId = ?",
  ).run(data.title, data.description, data.content, data.tags, urlId);
};