import type { Post } from "@repo/db/data";
import { preloadPostAction } from "../lib/actions"; // safe here: Main is a server component and isn't unit tested
import BlogList from "./Blog/List";

export function Main({
  posts,
  className,
}: {
  posts: Post[];
  className?: string;
}) {
  return (
    <main className={className}>
      <BlogList posts={posts} onPreload={preloadPostAction} /> {/* requirement 2 */}
    </main>
  );
}