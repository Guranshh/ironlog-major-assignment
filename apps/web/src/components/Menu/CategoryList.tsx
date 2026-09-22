import { categories } from "@/functions/categories";
import { categoryList, fitnessCategories, type Post } from "@repo/db/data";
import { toUrlPath } from "@repo/utils/url";
import { LinkList } from "./LinkList";
import { SummaryItem } from "./SummaryItem";

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

  const extraCategories = usedCategories.filter(
    (name) => !fixedList.includes(name), // a post's category that isn't in the fixed list
  );

  const names = [...fixedList, ...extraCategories]; // fixed list first, extras after

  return (
    <LinkList title="Categories">
      {names.map((name) => (
        <SummaryItem
          key={name}
          count={activeCategories.find((c) => c.name === name)?.count ?? 0} // 0 when no active posts
          name={name}
          isSelected={toUrlPath(name) === selectedCategory}
          link={`/category/${toUrlPath(name)}`}
          title={`Category / ${name}`}
        />
      ))}
    </LinkList>
  );
}