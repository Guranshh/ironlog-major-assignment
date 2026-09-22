import { categories } from "@/functions/categories";
import { categoryList, type Post } from "@repo/db/data";
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
  const activeCategories = categories(posts); // count of ACTIVE posts in each category

  const usedCategories = categories(
    posts.map((post) => ({ ...post, active: true })), // every category any post uses
  ).map((c) => c.name);

  const extraCategories = usedCategories.filter(
    (name) => !categoryList.includes(name), // a post's category that isn't in the fixed list
  );

  const names = [...categoryList, ...extraCategories]; // fixed list first, extras after

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