import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { getPosts } from "@/lib/db/cached"; // active posts from the database

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  const { q } = await searchParams;
  const query = (q || "").toLowerCase();
  const posts = await getPosts();

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(query) ||
      post.description.toLowerCase().includes(query), // matches the title or the short description
  );

  return (
    <AppLayout query={q}>
      <Main posts={filteredPosts} />
    </AppLayout>
  );
}