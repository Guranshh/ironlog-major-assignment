import { history } from "@/functions/history";
import { type Post } from "@repo/db/data";
import { LinkList } from "./LinkList";
import { SummaryItem } from "./SummaryItem";

const months = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function HistoryList({
  selectedYear,
  selectedMonth,
  posts,
}: {
  selectedYear?: string;
  selectedMonth?: string;
  posts: Post[];
}) 
{
  return (
    <LinkList title="History">
      {history(posts).map((item) => (
        <SummaryItem
          key={`${item.year}-${item.month}`}
          count={item.count}
          name={`${months[item.month]}, ${item.year}`}
          isSelected={
            String(item.year) === selectedYear &&
            String(item.month) === selectedMonth
          }
          link={`/history/${item.year}/${item.month}`}
          title={`History / ${months[item.month]}, ${item.year}`}
        />
      ))}
    </LinkList>
  );
}