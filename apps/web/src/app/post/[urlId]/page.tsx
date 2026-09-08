import { BlogDetail } from "@/components/Blog/Detail";
import { AppLayout } from "@/components/Layout/AppLayout";
import { getPost } from "@/lib/db/cached"; // cached single-post lookup

export default async function Page({
  params,
}: {
  params: Promise<{ urlId: string }>;
}) {
  const { urlId } = await params;

  const post = await getPost(urlId); // returns null when there's no match

  if (!post) {
    return <AppLayout>Article not found</AppLayout>;
  }

  return (
    <AppLayout selectedCategory={post.category}>
      <BlogDetail post={post} />
    </AppLayout>
  );
}