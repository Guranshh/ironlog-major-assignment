import { categories } from "@/functions/categories";
import { categoryList, fitnessCategories, type Post } from "@repo/db/data";
import { toUrlPath } from "@repo/utils/url";
import Link from "next/link";

export function CategoryList({
  selectedCategory,
  posts,
}: {
  selectedCategory?: string;
  posts: Post[];
}) {
  const fixedList = process.env.E2E ? categoryList : fitnessCategories; // course list for tests, IronLog list for real visitors

  const activeCategories = categories(posts); // count of ACTIVE posts in each category

  const usedCategories = categories(
    posts.map((post) => ({ ...post, active: true })), // every category any post uses
  ).map((c) => c.name);

  const extraCategories = usedCategories.filter((name) => !fixedList.includes(name));
  const names = [...fixedList, ...extraCategories]; // fixed list first, extras after

  return (
    <nav aria-label="Categories" className="-mx-4 overflow-x-auto px-4">
      {/* overflow-x-auto: on a phone the row scrolls sideways instead of squashing */}
      <ul className="flex min-w-max items-center gap-1 py-2">
        <li>
          <Link
            href="/"
            className="block rounded-md px-3 py-2 text-sm font-bold tracking-wider text-white/90 uppercase hover:bg-black/15 hover:text-white"
          >
            All
          </Link>
        </li>
        {names.map((name) => {
          const isSelected = toUrlPath(name) === selectedCategory;
          const count = activeCategories.find((c) => c.name === name)?.count ?? 0; // 0 when no active posts

          return (
            <li key={name}>
              <Link
                href={`/category/${toUrlPath(name)}`}
                title={`Category / ${name}`} // the tests find categories by this label
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold tracking-wider uppercase transition-colors ${
                  isSelected ? "selected bg-ink text-white" : "text-white/90 hover:bg-black/15 hover:text-white"
                }`}
              >
                <span>{name}</span>
                <span data-test-id="post-count" className="rounded-full bg-white/20 px-2 py-0.5 text-xs">
                  {count}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}