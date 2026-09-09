import { isLoggedIn } from "../utils/auth";
import { LoginForm } from "../components/LoginForm";
import { LogoutButton } from "../components/LogoutButton";

export default async function Home() {
  const loggedIn = await isLoggedIn(); // reads the auth_token cookie

  if (!loggedIn) {
    return <LoginForm />; // requirement: show the login screen when not signed in
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <div className="border-secondary/15 flex items-center justify-between border-b pb-4">
        <h1 className="text-primary text-xl font-bold">Admin of Full Stack Blog</h1>
        <LogoutButton />
      </div>
    </main>
  );
}