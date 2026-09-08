import { getPosts } from "../lib/db/cached"; // cached DB query instead of the static array
import { AppLayout } from "../components/Layout/AppLayout";
import { Main } from "../components/Main";
import styles from "./page.module.css";

export default async function Home() { // async, because we now await a database call
  const activePosts = await getPosts(); // the query already filters to active posts and sorts by date

  return (
    <AppLayout>
      <Main posts={activePosts} className={styles.main} />
    </AppLayout>
  );
}