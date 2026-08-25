import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { posts } from "@repo/db/data";
import { toUrlPath } from "@repo/utils/url";

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;

  const filteredPosts = posts.filter(
    (post) =>
      post.active &&
      post.tags.split(",").some((tag) => toUrlPath(tag) === name),
  );

  return (
    <AppLayout selectedTag={name}>
      <Main posts={filteredPosts} />
    </AppLayout>
  );
}