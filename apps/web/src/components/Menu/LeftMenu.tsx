import { getPosts } from "@/lib/db/cached"; // all three lists derive from the post list
import Link from "next/link";
import { CategoryList } from "./CategoryList";
import { HistoryList } from "./HistoryList";
import { TagList } from "./TagList";

export async function LeftMenu({ // async so we can await the database
  selectedCategory,
  selectedTag,
  selectedYear,
  selectedMonth,
}: {
  selectedCategory?: string;
  selectedTag?: string;
  selectedYear?: string;
  selectedMonth?: string;
}) {
  const posts = await getPosts(); // replaces the static import

  return (
    <aside className="border-secondary/15 hidden w-64 shrink-0 flex-col gap-8 border-r py-6 pr-6 md:flex">
      <Link href="/" className="px-3">
        <span className="text-wsu block text-xl leading-tight font-bold">
          Full Stack
        </span>
        <span className="text-secondary block text-sm">Blog</span>
      </Link>

      <nav>
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <CategoryList selectedCategory={selectedCategory} posts={posts} />
          </li>
          <li>
            <HistoryList
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              posts={posts}
            />
          </li>
          <li>
            <TagList selectedTag={selectedTag} />
          </li>
          <li>
            <span className="text-secondary px-3 text-xs">Admin</span>
          </li>
        </ul>
      </nav>
    </aside>
  );
}