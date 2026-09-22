import { getAllPosts, getPosts } from "@/lib/db/cached";
import { CategoryList } from "./CategoryList";
import { HistoryList } from "./HistoryList";
import { TagList } from "./TagList";

export async function LeftMenu({
  // async so we can await the database
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
  const posts = await getPosts(); // active posts, for the history list
  const allPosts = await getAllPosts(); // every post, so every category is listed

  return (
    <aside
      data-test-id="left-menu"
      className="border-secondary/15 hidden w-full shrink-0 flex-col gap-8 border-b py-6 peer-checked:flex md:flex md:w-64 md:border-r md:border-b-0 md:pr-6"
      // hidden on phones until Menu is tapped (peer-checked), always shown from tablet size (md) up
    >
      <nav>
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <CategoryList selectedCategory={selectedCategory} posts={allPosts} />
          </li>
          <li>
            <HistoryList selectedYear={selectedYear} selectedMonth={selectedMonth} posts={posts} />
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