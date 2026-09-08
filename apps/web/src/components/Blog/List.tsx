import type { Post } from "@repo/db/data";
import { BlogListItem } from "./ListItem";

export function BlogList({
  posts,
  onPreload, // passed straight through to each item
}: {
  posts: Post[];
  onPreload?: (urlId: string) => void;
}) {
  return (
    <div className="flex flex-col gap-8 py-8">
      <p className="text-secondary text-sm">{posts.length} Posts</p>
      {posts.map((post) => (
        <BlogListItem key={post.id} post={post} onPreload={onPreload} />
      ))}
    </div>
  );
}

export default BlogList;