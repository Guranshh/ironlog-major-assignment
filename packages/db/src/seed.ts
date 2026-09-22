import { client } from "./client.js"; // .js extension required by this package's ESM module resolution
import { posts } from "./data.js";

export async function seed() {
  // Delete in dependency order: comments, likes and join rows reference posts, so posts go last.
  await client.db.comment.deleteMany();
  await client.db.like.deleteMany();
  await client.db.post.deleteMany();
  await client.db.tag.deleteMany();

  for (const post of posts) {
    const tagNames = post.tags.split(",").map((tag: string) => tag.trim()); // "Back-End,Databases" -> ["Back-End", "Databases"]

    await client.db.post.create({
      data: {
        id: post.id,
        urlId: post.urlId,
        title: post.title,
        content: post.content,
        description: post.description,
        imageUrl: post.imageUrl,
        date: post.date,
        category: post.category,
        views: post.views,
        active: post.active,
        tags: {
          // connectOrCreate reuses a tag if it already exists, creates it if not,
          // so "Back-End" ends up as one row shared by every post that uses it.
          connectOrCreate: tagNames.map((name: string) => ({
            where: { name },
            create: { name },
          })),
        },
      },
    });

    // Likes are rows, not a number, so we create one per like with a distinct IP.
    for (let i = 0; i < post.likes; i++) {
      await client.db.like.create({
        data: {
          postId: post.id,
          userIP: `192.168.100.${i}`,
        },
      });
    }
  }

  // Postgres: we chose the ids ourselves above, so move the Post id counter past the highest one.
  // Without this, the next post created in admin would get id 1 again and crash.
  await client.db.$queryRawUnsafe(
    `SELECT setval(pg_get_serial_sequence('"Post"', 'id'), (SELECT MAX(id) FROM "Post"))`,
  );
}