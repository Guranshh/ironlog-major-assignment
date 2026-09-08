import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { getPostsByTag } from "@/lib/db/cached"; // cached DB query, filtering happens server-side

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;

  const filteredPosts = await getPostsByTag(name); // the slug goes straight to the query

  return (
    <AppLayout selectedTag={name}>
      <Main posts={filteredPosts} />
    </AppLayout>
  );
}