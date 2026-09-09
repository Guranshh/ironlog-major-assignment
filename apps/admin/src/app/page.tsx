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
    <main className="mx-auto max-w-5xl px-6 py-8">
      <div className="border-secondary/15 mb-6 flex items-center justify-between border-b pb-4">
        <h1 className="text-primary text-xl font-bold">Admin of Full Stack Blog</h1>

        <div className="flex items-center gap-3">
          <Link
            href="/posts/create" // must be a link, the test clicks a:has-text("Create Post")
            className="bg-wsu rounded-md px-3 py-1.5 text-sm text-white"
          >
            Create Post
          </Link>
          <LogoutButton />
        </div>
      </div>

      <PostList posts={posts} />
    </main>
  );
}