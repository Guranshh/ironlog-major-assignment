import { isLoggedIn } from "../../../utils/auth";
import { LoginForm } from "../../../components/LoginForm";
import { PostForm } from "../../../components/PostForm";

export default async function Page() {
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    return <LoginForm />;
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-8">
      <h1 className="text-primary mb-6 text-xl font-bold">Create Post</h1>

      {/* Same form as update, just with empty fields. */}
      <PostForm
        initial={{
          title: "",
          category: "",
          description: "",
          content: "",
          imageUrl: "",
          tags: "",
        }}
      />
    </main>
  );
}