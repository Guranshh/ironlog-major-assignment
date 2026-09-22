import { getPosts } from "../lib/db/cached"; // cached DB query, all active posts newest first
import { AppLayout } from "../components/Layout/AppLayout";
import { Main } from "../components/Main";
import { Pagination } from "../components/Blog/Pagination";
import styles from "./page.module.css";

const PAGE_SIZE = 4; // posts per page

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>; // the ?page=2 part of the address
}) {
  const activePosts = await getPosts();
  const params = await searchParams;

  const totalPages = Math.max(1, Math.ceil(activePosts.length / PAGE_SIZE)); // at least 1 page
  const requested = Math.floor(Number(params.page)) || 1; // missing or "abc" becomes page 1
  const page = Math.min(Math.max(requested, 1), totalPages); // keeps ?page=99 or ?page=-3 inside the real range

  const start = (page - 1) * PAGE_SIZE; // page 1 starts at 0, page 2 at 4
  const pagePosts = activePosts.slice(start, start + PAGE_SIZE); // just this page's posts

  return (
    <AppLayout>
      <div className="flex min-w-0 flex-1 flex-col">
        <Main posts={pagePosts} className={styles.main} />
        <Pagination page={page} totalPages={totalPages} />
      </div>
    </AppLayout>
  );
}