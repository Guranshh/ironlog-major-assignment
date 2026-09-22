import { getPosts } from "@/lib/db/cached";
import { HistoryList } from "./HistoryList";
import { TagList } from "./TagList";

export async function LeftMenu({
  // async so we can await the database
  selectedTag,
  selectedYear,
  selectedMonth,
}: {
  selectedTag?: string;
  selectedYear?: string;
  selectedMonth?: string;
}) {
  const posts = await getPosts(); // active posts, for the history list

  const card =
    "rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 dark:bg-white/5 dark:ring-white/10"; // shared card look

  return (
    <aside
      data-test-id="left-menu"
      className="hidden w-full shrink-0 flex-col gap-6 py-6 peer-checked:flex md:flex md:w-60"
      // hidden on phones until Menu is tapped (peer-checked), always shown from tablet size (md) up
    >
      <div className={card}>
        <HistoryList selectedYear={selectedYear} selectedMonth={selectedMonth} posts={posts} />
      </div>
      <div className={card}>
        <TagList selectedTag={selectedTag} />
      </div>
    </aside>
  );
}