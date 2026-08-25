import { type Post } from "@repo/db/data";
import { toUrlPath } from "@repo/utils/url";
import { tags } from "../../functions/tags";
import { LinkList } from "./LinkList";
import { SummaryItem } from "./SummaryItem";

export function TagList({
  selectedTag,
  posts,
}: {
  selectedTag?: string;
  posts: Post[];
}) {
  return (
    <LinkList title="Tags">
      {tags(posts).map((item) => (
        <SummaryItem
          key={item.name}
          count={item.count}
          name={item.name}
          isSelected={toUrlPath(item.name) === selectedTag}
          link={`/tags/${toUrlPath(item.name)}`}
          title={`Tag / ${item.name}`}
        />
      ))}
    </LinkList>
  );
}