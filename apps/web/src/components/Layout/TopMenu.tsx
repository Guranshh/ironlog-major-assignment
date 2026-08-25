"use client";

import { useRouter } from "next/navigation";
import ThemeSwitch from "../Themes/ThemeSwitcher";

function debounce<T extends (...args: Any[]) => Any>(fn: T, delay = 300) {
  let timeoutId: Any;
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

export function TopMenu({ query }: { query?: string }) {
  const router = useRouter();

  const handleSearch = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const search = event.target.value;
      router.push(`/search?q=${search}`);
    },
  );

  return (
    <div className="border-secondary/15 flex items-center justify-between gap-4 border-b py-4">
      <form action="#" method="GET" className="grid flex-1 grid-cols-1">
        <input
          type="search"
          name="search"
          placeholder="Search"
          defaultValue={query}
          onChange={handleSearch}
          className="border-secondary/25 text-primary placeholder:text-secondary focus:border-wsu w-full max-w-md rounded-md border bg-transparent px-3 py-2 text-sm outline-none"
        />
      </form>
      <ThemeSwitch />
    </div>
  );
}