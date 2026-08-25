import type { Post } from "@repo/db/data";
import { toUrlPath } from "@repo/utils/url";
import Link from "next/link";

export function BlogListItem({ post }: { post: Post }) {
  const date = post.date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <article
      key={post.id}
      className="border-secondary/15 flex flex-col gap-4 border-b pb-8 sm:flex-row sm:gap-6"
      data-test-id={`blog-post-${post.id}`}
    >
      <img
        src={post.imageUrl}
        alt={post.title}
        className="bg-secondary/10 h-40 w-full rounded-lg object-cover sm:h-32 sm:w-48 sm:shrink-0"
      />

      <div className="flex min-w-0 flex-col gap-2">
        <div className="text-secondary flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
          <Link
            href={`/category/${toUrlPath(post.category)}`}
            className="text-wsu font-semibold"
          >
            {post.category}
          </Link>
          <span>{date}</span>
          <span>{post.views} views</span>
          <span>{post.likes} likes</span>
        </div>

        <Link
          href={`/post/${post.urlId}`}
          className="text-primary hover:text-wsu text-xl leading-snug font-bold transition-colors"
        >
          {post.title}
        </Link>

        <p className="text-secondary line-clamp-3 text-sm leading-relaxed">
          {post.description}
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          {post.tags.split(",").map((tag) => (
            <Link
              key={tag}
              href={`/tags/${toUrlPath(tag)}`}
              className="bg-secondary/10 text-secondary hover:text-primary rounded-full px-2.5 py-1 text-xs transition-colors"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}