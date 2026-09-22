import Link from "next/link";
import type { PropsWithChildren } from "react";
import { Content } from "../Content";
import { LeftMenu } from "../Menu/LeftMenu";
import { TopMenu } from "./TopMenu";

export async function AppLayout({
  children,
  query,
  selectedCategory,
  selectedTag,
  selectedYear,
  selectedMonth,
}: PropsWithChildren<{
  query?: string;
  selectedCategory?: string;
  selectedTag?: string;
  selectedYear?: string;
  selectedMonth?: string;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-ink text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="font-heading text-2xl font-extrabold tracking-tight" data-test-id="site-logo">
            IRON<span className="text-wsu">LOG</span>
          </Link>
          <span className="hidden text-xs font-semibold tracking-widest text-white/60 uppercase sm:block">
            Train. Eat. Recover.
          </span>
          <label
            htmlFor="menu-toggle" // clicking this label ticks the hidden checkbox below
            data-test-id="menu-toggle"
            className="cursor-pointer rounded-md border border-white/30 px-3 py-1.5 text-sm md:hidden"
          >
            Menu
          </label>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 md:flex-row md:gap-8">
        <input id="menu-toggle" type="checkbox" className="peer hidden" aria-label="Show menu" />
        {/* peer: when the checkbox is ticked, the sidebar right after it shows on phones */}
        <LeftMenu
          selectedCategory={selectedCategory}
          selectedTag={selectedTag}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
        />
        <Content>
          <TopMenu query={query} />
          {children}
        </Content>
      </div>
    </div>
  );
}