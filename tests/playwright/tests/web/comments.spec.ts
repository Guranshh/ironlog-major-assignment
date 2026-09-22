import { expect, test, type Locator, type Page } from "./fixtures";

const POST = "/post/boost-your-conversion-rate";

test.beforeEach(async ({ page }) => {
  await page.goto("/api/seed"); // fresh data, so every test starts with no comments
});

async function addComment(page: Page, author: string, text: string) {
  const form = page.getByTestId("comment-form").first(); // the top form, above the list
  await form.getByTestId("comment-author").fill(author);
  await form.getByTestId("comment-content").fill(text);
  await form.getByTestId("comment-submit").click();
  await expect(page.getByText(text)).toBeVisible();
}

async function replyTo(item: Locator, author: string, text: string) {
  await item.getByTestId("reply-button").first().click(); // first = this comment's own button, not a nested one
  const form = item.getByTestId("comment-form");
  await form.getByTestId("comment-author").fill(author);
  await form.getByTestId("comment-content").fill(text);
  await form.getByTestId("comment-submit").click();
}

test.describe("COMMENTS", () => {
  test("Add a comment to a post", { tag: "@major" }, async ({ page }) => {
    await page.goto(POST);
    await expect(page.getByTestId("comment-count")).toHaveText("0 comments");
    await expect(page.getByText("No comments yet")).toBeVisible();

    await addComment(page, "Alex", "Great tips, thanks!");
    await expect(page.getByTestId("comment-count")).toHaveText("1 comment");

    await page.reload(); // it was saved in the database, not just on screen
    await expect(page.getByText("Great tips, thanks!")).toBeVisible();

    const first = page.getByTestId("comment-item").first(); // the saved comment, not the form above it
    await expect(first.getByTestId("comment-author")).toHaveText("Alex");
  });

  test("Reply to a comment", { tag: "@major" }, async ({ page }) => {
    await page.goto(POST);
    await addComment(page, "Alex", "First comment");

    const first = page.getByTestId("comment-item").first();
    await replyTo(first, "Sam", "I agree!");

    await expect(first.getByTestId("comment-replies").getByText("I agree!")).toBeVisible(); // shown inside its parent
    await expect(page.getByTestId("comment-count")).toHaveText("2 comments");
  });

  test("Replies can be nested more than one level", { tag: "@major" }, async ({ page }) => {
    await page.goto(POST);
    await addComment(page, "Alex", "Level one");

    const first = page.getByTestId("comment-item").first();
    await replyTo(first, "Sam", "Level two");
    await expect(first.getByTestId("comment-replies").getByText("Level two")).toBeVisible();

    const reply = first.getByTestId("comment-replies").getByTestId("comment-item").first();
    await replyTo(reply, "Jo", "Level three");

    await expect(reply.getByTestId("comment-replies").getByText("Level three")).toBeVisible(); // a reply inside a reply
    await expect(page.getByTestId("comment-count")).toHaveText("3 comments");
  });

  test("Empty comments are rejected", { tag: "@major" }, async ({ page }) => {
    await page.goto(POST);

    const form = page.getByTestId("comment-form").first();
    await form.getByTestId("comment-submit").click(); // nothing typed

    await expect(form.getByTestId("comment-error")).toBeVisible();
    await expect(page.getByTestId("comment-count")).toHaveText("0 comments");
  });
});