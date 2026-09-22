import type { Post } from "@repo/db/data";
import { BlogListItem } from "./ListItem";

export function BlogList({
  posts,
  onPreload, // passed straight through to each item
}: {
  posts: Post[];
  onPreload?: (urlId: string) => void;
}) {
  const [first, ...rest] = posts; // first post is featured, the rest go in the grid

  return (
    <div className="flex flex-col gap-6 py-8">
      <p className="text-secondary text-sm">{posts.length} Posts</p>

      {first && <BlogListItem post={first} onPreload={onPreload} featured />}

      {rest.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2">
          {/* one column on phones, two side by side from small tablets up */}
          {rest.map((post) => (
            <BlogListItem key={post.id} post={post} onPreload={onPreload} />
          ))}
        </div>
      )}
    </div>
  );
}

export default BlogList;