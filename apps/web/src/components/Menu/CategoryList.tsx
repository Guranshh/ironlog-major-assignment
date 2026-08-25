import { categories } from "@/functions/categories";
import type { Post } from "@repo/db/data";
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
  const allCategories = categories(
    posts.map((post) => ({ ...post, active: true })),
  );

  return (
    <LinkList title="Categories">
      {allCategories.map((item) => (
        <SummaryItem
          key={item.name}
          count={item.count}
          name={item.name}
          isSelected={toUrlPath(item.name) === selectedCategory}
          link={`/category/${toUrlPath(item.name)}`}
          title={`Category / ${item.name}`}
        />
      ))}
    </LinkList>
  );
}