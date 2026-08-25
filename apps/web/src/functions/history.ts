export function history(
  posts: { date: Date; active: boolean }[],
): { month: number; year: number; count: number }[] {
  const result: { month: number; year: number; count: number }[] = [];

  posts
    .filter((post) => post.active)
    .forEach((post) => {
      const month = post.date.getMonth() + 1;
      const year = post.date.getFullYear();

      const existing = result.find((h) => h.month === month && h.year === year);
      if (existing) {
        existing.count++;
      } else {
        result.push({ month, year, count: 1 });
      }
    });

  return result.sort((a, b) => b.year - a.year || b.month - a.month);
}