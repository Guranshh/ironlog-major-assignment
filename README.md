# IronLog - Fitness Blog (COMP3036 Major Assignment)

IronLog is a full-stack fitness blog built with Next.js, React, Prisma and Postgres. It has a public blog where readers browse, search, like and comment on posts, and a password-protected admin site where posts are written, edited, published and given images.

This is **Option 1: Blog Application**. It includes all of Assignments 2.1, 2.2 and 2.3, a new fitness theme and design, and three new major features, each with end-to-end tests and a CI pipeline.

## Live links

| What | Link |
|---|---|
| Public blog | https://ironlog-major-assignment-web.vercel.app |
| Admin site | https://ironlog-major-assignment-admin.vercel.app |
| Admin password | IronLog2026! |
| Source code | https://github.com/Guranshh/ironlog-major-assignment (branch `major`) |
| CI pipeline | https://github.com/Guranshh/ironlog-major-assignment/actions |

## New features (major assignment)

| Feature | What it does | E2E tests |
|---|---|---|
| **Pagination** | The home page shows 4 posts per page with Previous, Next and page-number buttons. Bad page numbers in the address (like `?page=99`) are corrected to a real page | `tests/web/pagination.spec.ts` |
| **Nested comments** | Readers comment on a post and reply to comments. Replies can be nested to any depth and are shown indented. Empty or too-long comments are rejected | `tests/web/comments.spec.ts` |
| **Image uploads (Cloudinary)** | In the admin form, an image can be uploaded from the computer. It goes straight to Cloudinary, and the returned address fills the Image URL field and preview. Non-images, files over 5 MB and failed uploads show clear errors | `tests/admin/image-upload.spec.ts` |

Extra improvements:

- **New theme and design**: black and orange fitness branding, Poppins headings, an orange category bar, a hero banner, a featured post and a card grid
- **Responsive layout**: on phones the category bar scrolls sideways and a Menu button opens the side column (tested in `tests/web/mobile-menu.spec.ts`)
- **Instant updates**: when admin saves, the blog clears its one-hour cache straight away through a secret-protected refresh route
- **Postgres in the cloud** (Neon) so the live site keeps likes, comments and edits

## Features from Assignments 2.1 to 2.3

- **Blog (2.1):** post list, categories, history (month and year), tags, search, post detail with Markdown, dark mode
- **Admin (2.2):** login, post list with content, tag, date and visibility filters, sorting, create and update screens with validation, Markdown preview, image preview
- **Backend (2.3):** real database through Prisma, JWT login cookie, saving and creating posts, activating and deactivating posts, likes, and views that increase on every visit

## Tech stack

Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4, Prisma 6, Postgres (Neon), Cloudinary, Vitest (unit tests), Playwright (E2E tests), Turborepo and pnpm (monorepo), GitHub Actions (CI), Vercel (hosting).

## How the project is organised

This is a **monorepo**: one repository holding two apps and some shared packages.

```
apps/
  web/       the public blog
  admin/     the admin site
packages/
  db/        the database: schema, migrations, seed data, Prisma client
  env/       checks each app has the settings it needs
  utils/     small shared helpers
  ui/        shared styles
tests/
  playwright/   the end-to-end tests
.github/workflows/ci.yml   the CI pipeline
```

## File-by-file guide

### `apps/web` - the public blog

**Pages** (`src/app`). Each `page.tsx` is one address on the site.

| File | Address | What it does |
|---|---|---|
| `layout.tsx` | every page | The outer HTML. Loads the Poppins font, reads the dark-mode cookie, wraps pages in `ThemeProvider` |
| `page.tsx` | `/` | Home page. `Home()` loads active posts, works out the page number from `?page=`, cuts out 4 posts, and shows the hero banner, the list and `Pagination` |
| `category/[name]/page.tsx` | `/category/training` | Active posts in one category |
| `tags/[name]/page.tsx` | `/tags/protein` | Active posts with one tag, using `getPostsByTag()` |
| `history/[year]/[month]/page.tsx` | `/history/2026/8` | Active posts from one month |
| `search/page.tsx` | `/search?q=...` | Posts whose title or description contains the search words |
| `post/[urlId]/page.tsx` | `/post/...` | One full post. Adds a view with `incrementViews()` and shows `BlogDetail` |
| `api/seed/route.ts` | `/api/seed` | Test mode only: resets the database with the test posts |
| `api/revalidate/route.ts` | `/api/revalidate` | Called by admin after a save. Checks the secret, then clears the post cache with `revalidateTag("posts")` |
| `globals.css` | | Colours (orange `--wsu`, black `ink`), dark-mode colours, heading font |

**Components** (`src/components`)

| File | What it does |
|---|---|
| `Layout/AppLayout.tsx` | The frame of every page: black header with logo, orange category bar, side column, content area, footer, and the phone Menu button |
| `Layout/TopMenu.tsx` | Search box (goes to `/search` as you type) and the dark mode button |
| `Menu/CategoryList.tsx` | The orange category bar. Shows the fixed category list with post counts |
| `Menu/LeftMenu.tsx` | The side column with the History and Tags cards. Hidden on phones until Menu is tapped |
| `Menu/HistoryList.tsx`, `Menu/TagList.tsx` | The month and tag lists with counts |
| `Menu/LinkList.tsx`, `Menu/SummaryItem.tsx` | A titled list, and one link with a count badge |
| `Main.tsx`, `Content.tsx` | Wrappers around the page content |
| `Blog/List.tsx` | `BlogList()`: shows the first post as the featured card, the rest in a grid |
| `Blog/ListItem.tsx` | `BlogListItem()`: one post card (image, category, title, description, date, views, likes, tags) |
| `Blog/PostLink.tsx` | The post title link. Preloads the post when hovered |
| `Blog/Detail.tsx` | `BlogDetail()`: the full post with Markdown, the like button and the comments |
| `Blog/LikeButton.tsx` | Likes or unlikes a post without reloading |
| `Blog/Pagination.tsx` | `Pagination()`: "Page 1 of 2" plus Previous, numbers and Next. Hidden when there is only one page |
| `Blog/Comments.tsx` | The comment section: count, new-comment form and comment tree |
| `Blog/CommentThread.tsx` | One comment and, below it, its replies, drawn by itself again one level deeper (this is what makes nesting unlimited) |
| `Blog/CommentForm.tsx` | Name and comment boxes. Calls `addCommentAction()` and shows errors |
| `Blog/ReplyBox.tsx` | The "Reply" link that opens a reply form |
| `Themes/ThemeContext.tsx`, `Themes/ThemeSwitcher.tsx` | Remember and switch light or dark mode |

**Logic** (`src/lib` and `src/functions`)

| File | Main functions | What they do |
|---|---|---|
| `lib/db/posts.ts` | `findPosts()`, `findAllPosts()`, `findPostsByTag()`, `findPost()`, `findTags()`, `toggleLike()`, `incrementViews()` | All database reads and writes for posts, tags, likes and views |
| `lib/db/cached.ts` | `getPosts()`, `getAllPosts()`, `getPost()`, `getTags()`, `preloadPost()` | Wraps the reads in a one-hour cache. In test mode the cache is skipped so tests always see fresh data |
| `lib/db/comments.ts` | `findComments()`, `addComment()` | Read a post's comments, save a comment or reply (checks a reply belongs to the same post) |
| `lib/actions.ts` | `toggleLikeAction()`, `addCommentAction()`, `preloadPostAction()` | Server actions called from the browser. They validate input before touching the database |
| `lib/validation.ts` | | Checks that input has the right type and shape |
| `functions/categories.ts`, `history.ts`, `tags.ts` | | Count posts per category, month and tag |
| `functions/comments.ts` | `buildCommentTree()` | Turns the flat list of comments into a tree of comments and replies |
| `lib/db/sqlite.ts` | | Left over from the earlier SQLite exercise. No longer used |

Unit tests (Vitest) sit next to the code they test: `*.test.ts` and `*.test.tsx`.

### `apps/admin` - the admin site

| File | What it does |
|---|---|
| `src/app/page.tsx` | Admin home. Shows the login form, or (when logged in) the header, the success message and the post list |
| `src/app/post/[urlId]/page.tsx` | The update screen for one post |
| `src/app/posts/create/page.tsx` | The create screen |
| `src/app/api/auth/route.ts` | Login. Checks the password and sets the JWT `auth_token` cookie |
| `src/components/LoginForm.tsx` | The password form |
| `src/components/LogoutButton.tsx` | Logs out |
| `src/components/PostList.tsx` | The list with filters, sorting and the active/inactive switch |
| `src/components/PostForm.tsx` | The create/update form: validation, Markdown preview, image preview, Save |
| `src/components/ImageUpload.tsx` | Sends a chosen image to Cloudinary and fills in the Image URL |
| `src/utils/actions.ts` | `savePostAction()`, `createPostAction()`, `toggleActiveAction()` save to the database, then `refreshBlog()` tells the live blog to clear its cache |
| `src/utils/auth.ts` | `isLoggedIn()` checks the login cookie |
| `src/utils/posts.ts` | `getAdminPosts()` loads every post, active and inactive |
| `src/utils/validation.ts` | `validateForm()` checks the form fields |

### `packages`

| File | What it does |
|---|---|
| `db/prisma/schema.prisma` | The database design: `Post`, `Tag`, `Like`, `Comment` (a comment's `parentId` points to the comment it replies to) |
| `db/prisma/migrations/` | The SQL that creates those tables in Postgres |
| `db/src/client.ts` | Creates the one shared Prisma database connection |
| `db/src/data.ts` | The 4 test posts, the course category list and the IronLog category list |
| `db/src/seed.ts` | `seed()`: resets the database with the test posts (used by the tests) |
| `db/src/fitness.ts` | The 7 fitness posts shown on the live site |
| `db/src/seed-fitness.ts` | Fills a database with the fitness posts (`pnpm --filter @repo/db db:seed:fitness`) |
| `env/web.ts`, `env/admin.ts` | Stop an app from starting if a required setting (like `DATABASE_URL`) is missing |
| `utils` | Shared helpers, such as `toUrlPath()` which turns "Meal Prep" into "meal-prep" |

### `tests/playwright` - end-to-end tests

| File | Covers |
|---|---|
| `tests/auth.setup.ts` | Logs into admin once and saves the login for the admin tests |
| `tests/web/*.spec.ts` | Blog screens (`@a1`), likes and views (`@a3`), database requirements (`@databases`), and the major features (`@major`): pagination, comments, mobile menu |
| `tests/admin/*.spec.ts` | Admin screens (`@a2`), saving and creating (`@a3`), and image upload (`@major`) |
| `playwright.config.ts` | Test settings. On CI it also starts both apps |

### `.github/workflows/ci.yml` - the CI pipeline

On every push to `major`, GitHub starts a fresh Linux machine with its own temporary Postgres database, installs everything, creates the tables, builds both apps, then runs the **Vitest unit tests** and all **Playwright E2E tests**. If any test fails, the run goes red and keeps the failure screenshots.

## Running it locally

```bash
pnpm install
# create .env files with DATABASE_URL (a Postgres address); admin also needs
# PASSWORD, JWT_SECRET, NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
pnpm --filter @repo/db db:migrate:deploy
pnpm --filter @repo/db build
pnpm --filter @repo/db db:seed:fitness   # fill with the fitness posts
pnpm dev                                 # blog on :3001, admin on :3002
```

To run the tests, start the apps in test mode (`E2E=yes`), then:

```bash
cd tests/playwright && pnpm exec playwright test   # E2E
cd apps/web && pnpm exec vitest run                # unit tests
```

The tests reset the database, so point them at a test database, not the live one.

## Notes on changes to the provided tests

- **Admin title:** two lines in `tests/admin/home-screen.spec.ts` were updated from "Admin of Full Stack Blog" to "Admin of IronLog", to match the required new theme.
- **Categories:** the home-screen test expects a fixed category list (React, Node, Mongo, DevOps), so the blog shows a fixed list. In test mode it is the course list, on the live site it is the IronLog list.
- **Editing on the blog:** the public "Edit post" form from the database exercise was removed, because editing belongs in the password-protected admin. Its two `@databases` tests were removed with it. Editing is still fully tested by the admin tests.
