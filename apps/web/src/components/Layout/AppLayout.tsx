import { getAllPosts } from "@/lib/db/cached";
import Link from "next/link";
import type { PropsWithChildren } from "react";
import { Content } from "../Content";
import { CategoryList } from "../Menu/CategoryList";
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
  const allPosts = await getAllPosts(); // every post, so the category bar lists every category

  return (
    <div className="flex min-h-screen flex-col">
      <header>
        <div className="bg-ink text-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
            <Link href="/" className="font-heading text-3xl font-extrabold tracking-tight" data-test-id="site-logo">
              IRON<span className="text-wsu">LOG</span>
            </Link>
            <span className="hidden text-xs font-semibold tracking-[0.3em] text-white/60 uppercase md:block">
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
        </div>

        <div className="bg-wsu text-white shadow-md">
          <div className="mx-auto max-w-7xl px-4">
            <CategoryList selectedCategory={selectedCategory} posts={allPosts} /> {/* the orange category bar */}
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 md:flex-row md:gap-8">
        <input id="menu-toggle" type="checkbox" className="peer hidden" aria-label="Show menu" />
        {/* peer: when the checkbox is ticked, the side column right after it shows on phones */}
        <LeftMenu selectedTag={selectedTag} selectedYear={selectedYear} selectedMonth={selectedMonth} />
        <Content>
          <TopMenu query={query} />
          {children}
        </Content>
      </div>

      <footer className="bg-ink mt-12 text-white/60">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-6 text-xs">
          <span className="font-heading text-lg font-extrabold text-white">
            IRON<span className="text-wsu">LOG</span>
          </span>
          <span>Train. Eat. Recover. © 2026 IronLog</span>
        </div>
      </footer>
    </div>
  );
}