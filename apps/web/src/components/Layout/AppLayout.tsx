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
    <>
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
    </>
  );
}