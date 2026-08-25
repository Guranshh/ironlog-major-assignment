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
        className={`flex items-center justify-between gap-2 rounded-md px-3 py-1.5 text-sm transition-colors ${
          isSelected
            ? "selected bg-wsu font-semibold text-white"
            : "text-secondary hover:text-primary hover:bg-secondary/10"
        }`}
      >
        <span className="truncate">{name}</span>
        <span
          data-test-id="post-count"
          className={`rounded-full px-2 py-0.5 text-xs ${
            isSelected ? "bg-white/20" : "bg-secondary/15"
          }`}
        >
          {count}
        </span>
      </Link>
    </li>
  );
}