"use client"; // filtering and sorting happen in the browser as the user types

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toggleActiveAction } from "../utils/actions";
import type { AdminPost } from "../utils/posts";

// The four sort options the Sort By select offers.
type SortOption = "date-desc" | "date-asc" | "title-asc" | "title-desc";

export function PostList({ posts }: { posts: AdminPost[] }) {
  const [content, setContent] = useState(""); // matches against title and content
  const [tag, setTag] = useState("");
  const [date, setDate] = useState(""); // an ISO date string from the date input
  const [visibility, setVisibility] = useState("all");
  const [sort, setSort] = useState<SortOption>("date-desc");

  // Each filter narrows the list further, so combining them works for free.
  let visible = posts;

  if (content) {
    const term = content.toLowerCase();
    visible = visible.filter(
      (post) =>
        post.title.toLowerCase().includes(term) ||
        post.content.toLowerCase().includes(term),
    );
  }

  if (tag) {
    const term = tag.toLowerCase();
    visible = visible.filter((post) => post.tags.toLowerCase().includes(term));
  }

  if (date) {
    const from = new Date(date);
    visible = visible.filter((post) => new Date(post.date) >= from); // posts created on or after the chosen day
  }

  if (visibility !== "all") {
    const wantActive = visibility === "active";
    visible = visible.filter((post) => post.active === wantActive);
  }

  // Copy before sorting, so we never mutate the array we were given as a prop.
  const sorted = [...visible].sort((a, b) => {
    if (sort === "title-asc") return a.title.localeCompare(b.title);
    if (sort === "title-desc") return b.title.localeCompare(a.title);

    const aTime = new Date(a.date).getTime();
    const bTime = new Date(b.date).getTime();
    return sort === "date-asc" ? aTime - bTime : bTime - aTime;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="border-secondary/15 grid gap-4 rounded-lg border p-4 sm:grid-cols-2 lg:grid-cols-5">
        <label className="text-secondary flex flex-col gap-1 text-xs">
          Filter by Content:
          <input
            type="text"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            className="border-secondary/30 text-primary rounded border bg-transparent px-2 py-1.5 text-sm"
          />
        </label>

        <label className="text-secondary flex flex-col gap-1 text-xs">
          Filter by Tag:
          <input
            type="text"
            value={tag}
            onChange={(event) => setTag(event.target.value)}
            className="border-secondary/30 text-primary rounded border bg-transparent px-2 py-1.5 text-sm"
          />
        </label>

        <label className="text-secondary flex flex-col gap-1 text-xs">
          Filter by Date Created:
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="border-secondary/30 text-primary rounded border bg-transparent px-2 py-1.5 text-sm"
          />
        </label>

        <label className="text-secondary flex flex-col gap-1 text-xs">
          Filter by Visibility:
          <select
            value={visibility}
            onChange={(event) => setVisibility(event.target.value)}
            className="border-secondary/30 text-primary rounded border bg-transparent px-2 py-1.5 text-sm"
          >
            <option value="all">All</option>
            <option value="active">Active only</option>
            <option value="inactive">Inactive only</option>
          </select>
        </label>

        <label className="text-secondary flex flex-col gap-1 text-xs">
          Sort By:
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortOption)}
            className="border-secondary/30 text-primary rounded border bg-transparent px-2 py-1.5 text-sm"
          >
            <option value="date-desc">Newest first</option>
            <option value="date-asc">Oldest first</option>
            <option value="title-asc">Title A–Z</option>
            <option value="title-desc">Title Z–A</option>
          </select>
        </label>
      </div>

      <p className="text-secondary text-sm">{sorted.length} Posts</p>

      <div className="flex flex-col gap-6">
        {sorted.map((post) => (
          <PostListItem key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

// Separate component because each row tracks its own active state.
function PostListItem({ post }: { post: AdminPost }) {
  const router = useRouter();
  const [active, setActive] = useState(post.active); // local copy so the button updates instantly
  const [isPending, setIsPending] = useState(false);

  const date = new Date(post.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }); // "Dec 16, 2024"

  const tags = post.tags
    .split(",")
    .map((name) => `#${name}`)
    .join(", "); // "#Front-End, #Dev Tools"

  async function handleToggle() {
    setIsPending(true);
    const result = await toggleActiveAction(post.id); // writes to the database immediately
    setIsPending(false);

    if (result.ok) {
      setActive(result.active); // show the value the server actually saved
      router.refresh(); // keep the server-rendered page in step
    }
  }

  return (
    <article
      data-test-id={`admin-post-${post.id}`}
      className="border-secondary/15 flex flex-col gap-4 border-b pb-6 sm:flex-row sm:gap-6"
    >
      <img
        src={post.imageUrl}
        alt={`Image for ${post.title}`}
        className="bg-secondary/10 h-32 w-full rounded-lg object-cover sm:w-48 sm:shrink-0"
      />

      <div className="flex min-w-0 flex-col gap-2">
        <Link
          href={`/post/${post.urlId}`} // clicking the title opens the update screen
          className="text-primary hover:text-wsu text-lg font-bold transition-colors"
        >
          {post.title}
        </Link>

        <div className="text-secondary flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
          <span className="text-wsu font-semibold">{post.category}</span>
          <span>Posted on {date}</span>
          <span>{tags}</span>
        </div>

        <div>
          <button
            type="button"
            onClick={handleToggle}
            disabled={isPending}
            data-test-id={`status-button-${post.id}`}
            className={`rounded-full border px-3 py-1 text-xs disabled:opacity-50 ${
              active
                ? "border-wsu text-wsu" // active posts are highlighted
                : "border-secondary/30 text-secondary"
            }`}
          >
            {active ? "Active" : "Inactive"}
          </button>
        </div>
      </div>
    </article>
  );
}