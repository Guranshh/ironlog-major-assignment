export function tags(
  posts: { tags: string; active: boolean }[],
): { name: string; count: number }[] {
  const result: { name: string; count: number }[] = [];

  posts
    .filter((post) => post.active)
    .flatMap((post) => post.tags.split(","))
    .sort((a, b) => a.localeCompare(b))
    .forEach((tag) => {
      const existing = result.find((t) => t.name === tag);
      if (existing) {
        existing.count++;
      } else {
        result.push({ name: tag, count: 1 });
      }
    });

  return result;
}