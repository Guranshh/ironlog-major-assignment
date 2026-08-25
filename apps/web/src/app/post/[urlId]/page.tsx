import { BlogDetail } from "@/components/Blog/Detail";
import { AppLayout } from "@/components/Layout/AppLayout";
import { posts } from "@repo/db/data";

export default async function Page({
  params,
}: {
  params: Promise<{ urlId: string }>;
}) {
  const { urlId } = await params;

  const post = posts.find((p) => p.urlId === urlId);

  if (!post) {
    return <AppLayout>Article not found</AppLayout>;
  }

  return (
    <AppLayout selectedCategory={post.category}>
      <BlogDetail post={post} />
    </AppLayout>
  );
}