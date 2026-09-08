import { getTags } from "@/lib/db/cached"; // requirement 6: tags come from the database now
import { toUrlPath } from "@repo/utils/url";
import { LinkList } from "./LinkList";
import { SummaryItem } from "./SummaryItem";

export async function TagList({ selectedTag }: { selectedTag?: string }) { // async server component
  const tags = await getTags(); // already returns { name, count } sorted alphabetically

  return (
    <LinkList title="Tags">
      {tags.map((item) => (
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