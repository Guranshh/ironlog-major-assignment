import type { Post } from "@repo/db/data";
import { toUrlPath } from "@repo/utils/url";
import { marked } from "marked";
import Link from "next/link";
import { EditForm } from "./EditForm"; // client component for requirement 8
import { LikeButton } from "./LikeButton"; // client component that calls the like server action

export async function BlogDetail({ post }: { post: Post & { liked: boolean } }) {
  const content = await marked.parse(post.content);

  const date = post.date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <article
      data-test-id={`blog-post-${post.id}`}
      className="flex flex-col gap-5 py-8"
    >
      <img
        src={post.imageUrl}
                alt={`Image for ${post.title}`}
        className="bg-secondary/10 h-72 w-full rounded-xl object-cover"
      />

      <div className="text-secondary flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
        <Link
          href={`/category/${toUrlPath(post.category)}`}
          className="text-wsu font-semibold"
        >
          {post.category}
        </Link>
        <span>{date}</span>
        <span>{post.views + 1} views</span>
      </div>

      <Link
        href={`/post/${post.urlId}`}
        className="text-primary text-4xl leading-tight font-bold"
      >
        {post.title}
      </Link>

      <div className="flex flex-wrap gap-2">
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

      <div className="flex flex-wrap items-center gap-3">
        <LikeButton urlId={post.urlId} likes={post.likes} liked={post.liked} /> {/* requirement 7 */}
        <EditForm
          urlId={post.urlId}
          title={post.title}
          description={post.description}
          content={post.content}
          tags={post.tags}
        /> {/* requirement 8 */}
      </div>

      <div
        data-test-id="content-markdown"
        className="text-primary [&_h1]:mt-6 [&_h1]:mb-3 [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-semibold [&_p]:text-secondary [&_p]:mb-4 [&_p]:leading-relaxed"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </article>
  );
}