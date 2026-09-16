import { client } from "@repo/db/client";
import { isLoggedIn } from "../../../utils/auth";
import { LoginForm } from "../../../components/LoginForm";
import { PostForm } from "../../../components/PostForm";

export default async function Page({
  params,
}: {
  params: Promise<{ urlId: string }>;
}) {
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    return <LoginForm />; // requirement: the page is only accessible to logged in users
  }

  const { urlId } = await params;

  const post = await client.db.post.findUnique({
    where: { urlId },
    include: { tags: true },
  });

  if (!post) {
    return <main className="p-8">Post not found</main>;
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-8">
      <h1 className="text-primary mb-6 text-xl font-bold">Update Post</h1>

            <PostForm
        urlId={post.urlId}
        initial={{
          title: post.title,
          category: post.category,
          description: post.description,
          content: post.content,
          imageUrl: post.imageUrl,
          tags: post.tags.map((tag) => tag.name).join(","),
        }}
      />
    </main>
  );
}