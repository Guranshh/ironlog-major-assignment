import type { Post } from "@repo/db/data";
import { toUrlPath } from "@repo/utils/url";
import { marked } from "marked";
import Link from "next/link";

export async function BlogDetail({ post }: { post: Post }) {
  const content = await marked.parse(post.content);

  const date = post.date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <article data-test-id={`blog-post-${post.id}`} className="flex flex-col gap-4 py-6">
      <img
        src={post.imageUrl}
        alt={post.title}
        className="h-64 w-full rounded object-cover"
      />
      <Link href={`/post/${post.urlId}`} className="text-3xl font-bold">
        {post.title}
      </Link>
      <div className="flex flex-row gap-2 text-sm">
        <Link href={`/category/${toUrlPath(post.category)}`}>
          {post.category}
        </Link>
        <span>{date}</span>
        <span>{post.views + 1} views</span>
        <span>{post.likes} likes</span>
      </div>
      <div className="flex flex-row gap-2 text-sm">
        {post.tags.split(",").map((tag) => (
          <Link key={tag} href={`/tags/${toUrlPath(tag)}`}>
            #{tag}
          </Link>
        ))}
      </div>
      <div
        data-test-id="content-markdown"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </article>
  );
}