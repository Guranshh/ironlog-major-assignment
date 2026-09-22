import { expect, test } from "./fixtures";

// Reset the database before each test so likes from one test
// never leak into the next one.
test.beforeEach(async ({ page }) => {
  await page.goto("/api/seed");
});

test.describe("DATABASES", () => {
  test(
    "Obtain the list of posts from the database",
    { tag: "@databases" }, // System requirement: read posts from the database
    async ({ page }) => {
      await page.goto("/");

      await expect(page.locator("article")).toHaveCount(3); // only the three active posts
      await expect(page.getByTestId("blog-post-1")).toBeVisible();
    },
  );

  test(
    "Show the list of available tags",
    { tag: "@databases" }, // System requirement 6
    async ({ page }) => {
      await page.goto("/");

      await expect(page.getByTitle("Tag / Back-End")).toBeVisible();
      await expect(page.getByTitle("Tag / Front-End")).toBeVisible();
      await expect(page.getByTitle("Tag / Optimisation")).toBeVisible();
      await expect(page.getByTitle("Tag / Dev Tools")).toBeVisible();

      await expect(page.getByText("Mainframes")).not.toBeVisible(); // inactive posts contribute no tags
    },
  );

  test(
    "Obtain a filtered list of posts based on tags",
    { tag: "@databases" }, // System requirement 5
    async ({ page }) => {
      await page.goto("/tags/front-end");

      await expect(page.locator("article")).toHaveCount(2); // two active posts carry Front-End
      await expect(page.getByTestId("blog-post-2")).toBeVisible();
      await expect(page.getByTestId("blog-post-3")).toBeVisible();
      await expect(page.getByTestId("blog-post-1")).not.toBeVisible();
    },
  );

  test(
    "Like the post",
    { tag: "@databases" }, // System requirement 7
    async ({ page }) => {
      await page.goto("/post/boost-your-conversion-rate");

      const button = page.getByTestId("like-button");
      const count = page.getByTestId("like-count");

      await expect(count).toHaveText("3 likes"); // the seeded value
      await expect(button).toHaveAttribute("aria-pressed", "false");

      await button.click(); // liking updates without a page reload
      await expect(count).toHaveText("4 likes");
      await expect(button).toHaveAttribute("aria-pressed", "true");

      await page.reload(); // the new value came from the database, not just React state
      await expect(page.getByTestId("like-count")).toHaveText("4 likes");

      await page.getByTestId("like-button").click(); // clicking again removes the like
      await expect(page.getByTestId("like-count")).toHaveText("3 likes");
    },
  );

  test(
    "Preload the post when hovering over the link",
    { tag: "@databases" }, // System requirement 2
    async ({ page }) => {
      await page.goto("/");

      const requests: string[] = [];
      page.on("request", (request) => {
        if (request.method() === "POST") {
          requests.push(request.url()); // the preload runs as a server action, which posts to the current URL
        }
      });

      await page.getByTestId("post-link-boost-your-conversion-rate").hover();

      await expect.poll(() => requests.length).toBeGreaterThan(0); // hovering triggered the preload
    },
  );
});