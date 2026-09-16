import { BlogDetail } from "@/components/Blog/Detail";
import { AppLayout } from "@/components/Layout/AppLayout";
import { getPost } from "@/lib/db/cached";
import { incrementViews } from "@/lib/db/posts";

export default async function Page({
  params,
}: {
  params: Promise<{ urlId: string }>;
}) {
  const { urlId } = await params;

  const post = await getPost(urlId); // cached read

  if (!post) {
    return <AppLayout>Article not found</AppLayout>;
  }

  // The increment runs outside the cache, so it happens on every visit.
  // It returns the new count, which we show instead of the cached one.
  const views = await incrementViews(urlId);

  return (
    <AppLayout selectedCategory={post.category}>
      <BlogDetail post={{ ...post, views }} />
    </AppLayout>
  );
}