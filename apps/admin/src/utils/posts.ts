import { client } from "@repo/db/client"; // the shared Prisma client singleton

// The flat shape the admin UI works with. Prisma returns tags as related rows,
// so this flattens them back to the comma-separated string the components expect.
export type AdminPost = {
  id: number;
  urlId: string;
  title: string;
  content: string;
  description: string;
  imageUrl: string;
  date: Date;
  category: string;
  active: boolean;
  tags: string;
};

// Admin shows both active and inactive posts, unlike the public site.
export async function getAdminPosts(): Promise<AdminPost[]> {
  const rows = await client.db.post.findMany({
    include: { tags: true }, // fetch the related tag records alongside each post
    orderBy: { date: "desc" }, // newest first, matching the default sort in the UI
  });

  return rows.map((row) => ({
    id: row.id,
    urlId: row.urlId,
    title: row.title,
    content: row.content,
    description: row.description,
    imageUrl: row.imageUrl,
    date: row.date,
    category: row.category,
    active: row.active,
    tags: row.tags.map((tag) => tag.name).join(","), // relation -> "Front-End,Dev Tools"
  }));
}