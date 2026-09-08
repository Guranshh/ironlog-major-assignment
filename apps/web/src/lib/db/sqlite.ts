import Database from "better-sqlite3"; // native SQLite driver with a synchronous API
import path from "node:path"; // to build an absolute path to the .sqlite file
import { posts as seedPosts, type Post } from "@repo/db/data"; // reuse the existing static data as our seed source

const DB_FILE = path.join(process.cwd(), "blog.sqlite"); // one file on disk, next to apps/web

// SQLite has no BOOLEAN and no DATE type, so `active` is stored as 0/1 and `date` as an ISO string.
const SCHEMA = `
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY,
    urlId TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    description TEXT NOT NULL,
    imageUrl TEXT NOT NULL,
    date TEXT NOT NULL,
    category TEXT NOT NULL,
    views INTEGER NOT NULL DEFAULT 0,
    likes INTEGER NOT NULL DEFAULT 0,
    tags TEXT NOT NULL,
    active INTEGER NOT NULL DEFAULT 1
  );
`;

// The shape SQLite actually gives us back: date is a string, active is a number.
export type PostRow = Omit<Post, "date" | "active"> & { date: string; active: number };

// Convert a raw database row into the Post type the rest of the app expects.
export const rowToPost = (row: PostRow): Post => ({
  ...row,
  date: new Date(row.date), // TEXT -> Date
  active: row.active === 1, // INTEGER -> boolean
});

let database: Database.Database | null = null; // module-level cache so we open the file once, not per request

const insertSeedData = (db: Database.Database) => {
  const statement = db.prepare(`
    INSERT INTO posts (id, urlId, title, content, description, imageUrl, date, category, views, likes, tags, active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `); // ? placeholders are parameterised — the driver escapes the values, which prevents SQL injection

  for (const post of seedPosts) {
    statement.run(
      post.id,
      post.urlId,
      post.title,
      post.content,
      post.description,
      post.imageUrl,
      post.date.toISOString(), // Date -> TEXT
      post.category,
      post.views,
      post.likes,
      post.tags,
      post.active ? 1 : 0, // boolean -> INTEGER
    );
  }
};

// Every query in this module goes through here.
export const getDb = (): Database.Database => {
  if (database) {
    return database; // already open, reuse the connection
  }

  const db = new Database(DB_FILE); // opens the file, creating it if it doesn't exist
  db.exec(SCHEMA); // create the table if this is a fresh database file

  const row = db.prepare("SELECT COUNT(*) AS count FROM posts").get() as { count: number };
  if (row.count === 0) {
    insertSeedData(db); // only seed an empty database, so we don't wipe data on every restart
  }

  database = db;
  return db;
};

// Drop everything and re-insert the seed data. Used by the /api/seed route before e2e tests.
export const resetDatabase = () => {
  const db = getDb();
  db.prepare("DELETE FROM posts").run();
  insertSeedData(db);
};