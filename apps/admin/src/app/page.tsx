import Link from "next/link";
import { isLoggedIn } from "../utils/auth";
import { getAdminPosts } from "../utils/posts";
import { LoginForm } from "../components/LoginForm";
import { LogoutButton } from "../components/LogoutButton";
import { PostList } from "../components/PostList";

export default async function Home() {
  const loggedIn = await isLoggedIn(); // reads the auth_token cookie

  if (!loggedIn) {
    return <LoginForm />; // requirement: the list is only accessible to logged in users
  }

  const posts = await getAdminPosts(); // both active and inactive

  return (
    <>
      <header className="bg-ink text-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-4">
          <div>
            <p className="font-heading text-2xl font-extrabold tracking-tight">
              IRON<span className="text-wsu">LOG</span>
            </p>
            <h1 className="text-sm text-white/70">Admin of IronLog</h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/posts/create" // must be a link, the test clicks a:has-text("Create Post")
              className="bg-wsu rounded-md px-3 py-1.5 text-sm font-semibold text-white"
            >
              Create Post
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <PostList posts={posts} />
      </main>
    </>
  );
}