import { expect, test } from "./fixtures";

// Reset the SQLite database before each test so likes and edits from one test
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
    "Update the post",
    { tag: "@databases" }, // System requirement 8
    async ({ page }) => {
      await page.goto("/post/boost-your-conversion-rate");

      await page.getByTestId("edit-button").click();
      await expect(page.getByTestId("edit-form")).toBeVisible();

      await page.getByTestId("edit-title").fill("An updated title");
      await page.getByTestId("save-button").click();

      await expect(page.getByText("An updated title")).toBeVisible(); // the page refreshed with new data

      await page.reload(); // the change was written to the database
      await expect(page.getByText("An updated title")).toBeVisible();

    
      await page.getByTestId("edit-button").click(); // put the original title back so other suites see clean data
      await page.getByTestId("edit-title").fill("Boost your conversion rate");
      await page.getByTestId("save-button").click();
      await expect(page.getByText("Boost your conversion rate")).toBeVisible();
    },
  );

  test(
    "Reject invalid update data",
    { tag: "@databases" }, // System requirement 4: validate types and structure
    async ({ page }) => {
      await page.goto("/post/boost-your-conversion-rate");

      await page.getByTestId("edit-button").click();
      await page.getByTestId("edit-title").fill("   "); // whitespace only, so validation must reject it
      await page.getByTestId("save-button").click();

      await expect(page.getByTestId("edit-error")).toBeVisible();
      await expect(page.getByTestId("edit-form")).toBeVisible(); // the form stays open on failure
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