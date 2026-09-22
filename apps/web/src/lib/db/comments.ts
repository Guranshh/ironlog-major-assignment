import { client } from "@repo/db/client"; // the shared Prisma client

export type CommentRow = {
  id: number;
  parentId: number | null;
  author: string;
  content: string;
  createdAt: Date;
};

// Every comment on one post, oldest first, as a flat list. The page turns it into a tree.
export const findComments = async (postId: number): Promise<CommentRow[]> => {
  return client.db.comment.findMany({
    where: { postId },
    orderBy: { createdAt: "asc" }, // conversations read top to bottom
    select: { id: true, parentId: true, author: true, content: true, createdAt: true },
  });
};

// Saves a comment or a reply. Returns false if the post or the parent comment is invalid.
export const addComment = async (
  urlId: string,
  parentId: number | null,
  author: string,
  content: string,
): Promise<boolean> => {
  const post = await client.db.post.findUnique({ where: { urlId }, select: { id: true } });
  if (!post) {
    return false; // no post with that address
  }

  if (parentId !== null) {
    const parent = await client.db.comment.findUnique({
      where: { id: parentId },
      select: { postId: true },
    });
    if (!parent || parent.postId !== post.id) {
      return false; // a reply must answer a comment on the same post
    }
  }

  await client.db.comment.create({
    data: { postId: post.id, parentId, author, content },
  });
  return true;
};