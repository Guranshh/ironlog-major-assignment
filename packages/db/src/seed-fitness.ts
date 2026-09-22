import { client } from "./client.js";
import { fitnessPosts } from "./fitness.js";

async function main() {
  // Same order as seed(): children first, posts last.
  await client.db.comment.deleteMany();
  await client.db.like.deleteMany();
  await client.db.post.deleteMany();
  await client.db.tag.deleteMany();

  for (const post of fitnessPosts) {
    const tagNames = post.tags.split(",").map((tag) => tag.trim());

    const created = await client.db.post.create({
      data: {
        // no id here: the database numbers the posts itself
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
          connectOrCreate: tagNames.map((name) => ({
            where: { name },
            create: { name },
          })),
        },
      },
    });

    for (let i = 0; i < post.likes; i++) {
      await client.db.like.create({
        data: { postId: created.id, userIP: `10.0.0.${i}` }, // uses the id the database just chose
      });
    }
  }

  console.log(`Seeded ${fitnessPosts.length} IronLog posts`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1); // a non-zero exit tells the terminal it failed
  });