import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { getPosts } from "@/lib/db/cached"; // active posts from the database, not the built-in test list
import { toUrlPath } from "@repo/utils/url";

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const posts = await getPosts();

  const filteredPosts = posts.filter(
    (post) => toUrlPath(post.category) === name, // "Training" becomes "training", matching the address
  );

  return (
    <AppLayout selectedCategory={name}>
      <Main posts={filteredPosts} />
    </AppLayout>
  );
}