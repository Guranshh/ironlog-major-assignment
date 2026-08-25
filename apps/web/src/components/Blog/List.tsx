import type { Post } from "@repo/db/data";
import { BlogListItem } from "./ListItem";

export function BlogList({ posts }: { posts: Post[] }) {
  return (
    <div className="flex flex-col gap-8 py-8">
      <p className="text-secondary text-sm">{posts.length} Posts</p>
      {posts.map((post) => (
        <BlogListItem key={post.id} post={post} />
      ))}
    </div>
  );
}

export default BlogList;