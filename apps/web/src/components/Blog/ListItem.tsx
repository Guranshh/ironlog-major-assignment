import type { Post } from "@repo/db/data";
import Link from "next/link";
import { toUrlPath } from "@repo/utils/url";

export function BlogListItem({ post }: { post: Post }) {
  const date = post.date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <article
      key={post.id}
      className="flex flex-row gap-8"
      data-test-id={`blog-post-${post.id}`}
    >
      <img
        src={post.imageUrl}
        alt={post.title}
        className="h-32 w-48 rounded object-cover"
      />
      <div className="flex flex-col gap-2">
        <Link href={`/post/${post.urlId}`} className="text-xl font-bold">
          {post.title}
        </Link>
        <div className="flex flex-row gap-2 text-sm">
          <Link href={`/category/${toUrlPath(post.category)}`}>
            {post.category}
          </Link>
          <span>{date}</span>
          <span>{post.views} views</span>
          <span>{post.likes} likes</span>
        </div>
        <div className="flex flex-row gap-2 text-sm">
          {post.tags.split(",").map((tag) => (
            <Link key={tag} href={`/tags/${toUrlPath(tag)}`}>
              #{tag}
            </Link>
          ))}
        </div>
        <p>{post.description}</p>
      </div>
    </article>
  );
}