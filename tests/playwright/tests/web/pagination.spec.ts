import { client } from "@repo/db/client";
import { expect, test } from "./fixtures";

const extraPosts = [101, 102, 103]; // ids that don't clash with the 4 seeded posts

test.beforeAll(async ({ browser }) => {
  const page = await browser.newPage();
  await page.goto("/api/seed"); // the web app resets the data itself, so only one program writes at a time
  await page.close();

  for (const id of extraPosts) {
    await client.db.post.create({
      data: {
        id,
        urlId: `extra-post-${id}`,
        title: `Extra post ${id}`,
        content: "Extra content",
        description: "Extra description",
        imageUrl:
          "https://images.unsplash.com/photo-1496128858413-b36217c2ce36?auto=format&fit=crop&w=800&q=60",
        date: new Date("Jan 10, 2026"), // newest, so these land on page 1
        category: "React",
        views: 0,
        active: true,
      },
    });
  }
  // now 6 active posts: page 1 = 3 extras + Dec 2024 post, page 2 = the 2020 and 2022 posts
});

test.afterAll(async ({ browser }) => {
  const page = await browser.newPage();
  await page.goto("/api/seed"); // remove the extras through the web app, so later test files see clean data
  await page.close();
});

test.describe("PAGINATION", () => {
  test("Shows four posts on the first page", { tag: "@major" }, async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("article")).toHaveCount(4);
    await expect(page.getByTestId("pagination-info")).toHaveText("Page 1 of 2");
    await expect(page.getByTestId("blog-post-101")).toBeVisible(); // newest post is on page 1
    await expect(page.getByTestId("blog-post-1")).not.toBeVisible(); // oldest posts are on page 2
  });

  test("Next and Previous move between pages", { tag: "@major" }, async ({ page }) => {
    await page.goto("/");

    await page.getByTestId("pagination-next").click();
    await expect(page).toHaveURL("/?page=2");
    await expect(page.locator("article")).toHaveCount(2);
    await expect(page.getByTestId("blog-post-1")).toBeVisible();
    await expect(page.getByTestId("blog-post-2")).toBeVisible();

    await page.getByTestId("pagination-prev").click();
    await expect(page).toHaveURL("/?page=1");
    await expect(page.locator("article")).toHaveCount(4);
  });

  test("Page numbers work and bad page numbers are corrected", { tag: "@major" }, async ({ page }) => {
    await page.goto("/?page=99"); // a page that doesn't exist
    await expect(page.getByTestId("pagination-info")).toHaveText("Page 2 of 2"); // shows the last page instead

    await page.getByTestId("pagination-page-1").click();
    await expect(page.getByTestId("pagination-info")).toHaveText("Page 1 of 2");
  });
});