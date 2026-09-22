import type { Post } from "@repo/db/data";
import { toUrlPath } from "@repo/utils/url";
import Link from "next/link";
import { PostLink } from "./PostLink"; // client component that preloads the post on hover

export function BlogListItem({
  post,
  onPreload, // passed down from the page, which is where the server action is imported
  featured = false, // true for the big card at the top of a list
}: {
  post: Post;
  onPreload?: (urlId: string) => void;
  featured?: boolean;
}) {
  const date = post.date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <article
      data-test-id={`blog-post-${post.id}`}
      className={`group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-xl dark:bg-white/5 dark:ring-white/10 ${
        featured ? "md:flex-row" : ""
      }`}
    >
      <div className={`overflow-hidden ${featured ? "md:w-1/2" : ""}`}>
        <img
          src={post.imageUrl}
          alt={`Image for ${post.title}`}
          className={`bg-secondary/10 w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            featured ? "h-64 md:h-full md:min-h-80" : "h-48"
          }`} // the photo zooms slightly when the card is hovered
        />
      </div>

      <div className={`flex min-w-0 flex-1 flex-col gap-3 p-5 ${featured ? "md:justify-center md:p-8" : ""}`}>
        <div className="flex items-center gap-3">
          <Link
            href={`/category/${toUrlPath(post.category)}`}
            className="text-wsu text-xs font-bold tracking-widest uppercase"
          >
            {post.category}
          </Link>
          {featured && (
            <span className="bg-ink rounded-full px-2 py-0.5 text-[10px] font-bold tracking-widest text-white uppercase">
              Featured
            </span>
          )}
        </div>

        <PostLink
          urlId={post.urlId}
          onPreload={onPreload} // requirement 2, wired up by whichever page renders this
          className={`font-heading text-primary group-hover:text-wsu leading-tight font-bold transition-colors ${
            featured ? "text-2xl md:text-3xl" : "text-xl"
          }`}
        >
          {post.title}
        </PostLink>

        <p className="text-secondary line-clamp-3 text-sm leading-relaxed">{post.description}</p>

        <div className="text-secondary flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
          <span>{date}</span>
          <span>{post.views} views</span>
          <span>{post.likes} likes</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {post.tags.split(",").map((tag) => (
            <Link
              key={tag}
              href={`/tags/${toUrlPath(tag)}`}
              className="bg-secondary/10 text-secondary hover:bg-wsu rounded-full px-2.5 py-1 text-xs transition-colors hover:text-white"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}