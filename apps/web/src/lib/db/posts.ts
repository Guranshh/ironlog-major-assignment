const USER_IP = "127.0.0.1"; // no auth in this app, so one stand-in identity for likes
import { client } from "@repo/db/client"; // the shared Prisma client singleton
import { toUrlPath } from "@repo/utils/url"; // turns "Back-End" into "back-end"
import type { Post } from "@repo/db/data"; // the flat shape the components expect

export type PostWithLike = Post & { liked: boolean };

// Prisma gives us tags as related records and likes as rows. The components still expect
// a comma-separated string and a number, so this flattens the relations back into that shape.
type PrismaPost = {
  id: number;
  urlId: string;
  title: string;
  content: string;
  description: string;
  imageUrl: string;
  date: Date;
  category: string;
  views: number;
  active: boolean;
  tags: { name: string }[];
  Likes: { userIP: string }[];
};

const toPost = (row: PrismaPost): PostWithLike => ({
  id: row.id,
  urlId: row.urlId,
  title: row.title,
  content: row.content,
  description: row.description,
  imageUrl: row.imageUrl,
  date: row.date,
  category: row.category,
  views: row.views,
  active: row.active,
  tags: row.tags.map((tag) => tag.name).join(","), // relation -> "Back-End,Databases"
  likes: row.Likes.length, // rows -> a count
    liked: row.Likes.some((like) => like.userIP === USER_IP), // only this user's like makes the button pressed
});

// include tells Prisma to fetch the related records alongside the post.
const INCLUDE = { tags: true, Likes: true };

export const findPosts = async (): Promise<PostWithLike[]> => {
  const rows = await client.db.post.findMany({
    where: { active: true },
    orderBy: { date: "desc" }, // newest first
    include: INCLUDE,
  });
  return rows.map(toPost);
};

// Every post regardless of active flag. The left menu's category list needs these.
export const findAllPosts = async (): Promise<PostWithLike[]> => {
  const rows = await client.db.post.findMany({
    orderBy: { date: "desc" },
    include: INCLUDE,
  });
  return rows.map(toPost);
};

// Requirement: filtered list of posts based on tags. `name` is the URL slug, e.g. "back-end".
export const findPostsByTag = async (name: string): Promise<PostWithLike[]> => {
  const rows = await client.db.post.findMany({
    where: { active: true },
    orderBy: { date: "desc" },
    include: INCLUDE,
  });
  return rows
    .map(toPost)
    .filter((post) =>
      post.tags.split(",").some((tag) => toUrlPath(tag) === name), // slugs are computed in JS, not stored
    );
};

export const findPost = async (urlId: string): Promise<PostWithLike | null> => {
  const row = await client.db.post.findUnique({
    where: { urlId }, // findUnique needs a field marked @unique in the schema
    include: INCLUDE,
  });
  return row ? toPost(row) : null; // null when no post matches
};

// Requirement: list of available tags, with how many posts use each one.
export const findTags = async (): Promise<{ name: string; count: number }[]> => {
  const tags = await client.db.tag.findMany({
    include: {
      posts: {
        where: { active: true }, // only active posts count toward the total
        select: { id: true }, // we only need to count them, not read them
      },
    },
    orderBy: { name: "asc" }, // alphabetical for a stable UI order
  });

  return tags
    .map((tag) => ({ name: tag.name, count: tag.posts.length }))
    .filter((tag) => tag.count > 0); // a tag used only by inactive posts isn't shown
};

// Requirement: like the post. Toggling means creating or deleting a Like row.
export const toggleLike = async (
  urlId: string,
): Promise<{ likes: number; liked: boolean }> => {
    const userIP = USER_IP; // same identity the read path checks against

  const post = await client.db.post.findUnique({
    where: { urlId },
    include: { Likes: true },
  });

  if (!post) {
    return { likes: 0, liked: false }; // no post with that urlId
  }

  const existing = post.Likes.find((like) => like.userIP === userIP);

  if (existing) {
    await client.db.like.delete({
      where: { postId_userIP: { postId: post.id, userIP } }, // the composite key from the schema
    });
  } else {
    await client.db.like.create({
      data: { postId: post.id, userIP },
    });
  }

  const count = await client.db.like.count({ where: { postId: post.id } });

  return { likes: count, liked: !existing }; // !existing is the state after the toggle
};

// Requirement: update a post.
export const updatePost = async (
  urlId: string,
  data: { title: string; description: string; content: string; tags: string },
): Promise<void> => {
  const tagNames = data.tags.split(",").map((tag) => tag.trim());

  await client.db.post.update({
    where: { urlId },
    data: {
      title: data.title,
      description: data.description,
      content: data.content,
      tags: {
        set: [], // clear the existing relations first
        connectOrCreate: tagNames.map((name) => ({
          where: { name },
          create: { name },
        })), // then reconnect, creating any tag that doesn't exist yet
      },
    },
  });
};