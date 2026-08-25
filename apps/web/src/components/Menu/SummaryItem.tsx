import Link from "next/link";

export function SummaryItem({
  name,
  link,
  count,
  isSelected,
  title,
}: {
  name: string;
  link: string;
  count: number;
  isSelected: boolean;
  title?: string;
}) {
  return (
    <li>
      <Link
        href={link}
        title={title}
        className={`flex justify-between gap-2 rounded px-2 py-1 hover:bg-gray-100 ${
          isSelected ? "selected bg-gray-200 font-semibold" : ""
        }`}
      >
        <span>{name}</span>
        <span data-test-id="post-count">{count}</span>
      </Link>
    </li>
  );
}