import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { getPosts } from "@/lib/db/cached"; // active posts from the database

export default async function Page({
  params,
}: {
  params: Promise<{ year: string; month: string }>;
}) {
  const { year, month } = await params;
  const posts = await getPosts();

  const filteredPosts = posts.filter(
    (post) =>
      post.date.getFullYear() === Number(year) &&
      post.date.getMonth() + 1 === Number(month), // getMonth() counts from 0, so add 1
  );

  return (
    <AppLayout selectedYear={year} selectedMonth={month}>
      <Main posts={filteredPosts} />
    </AppLayout>
  );
}