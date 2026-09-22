import { expect, test } from "./fixtures";

test.use({ viewport: { width: 390, height: 844 } }); // an iPhone-sized screen for every test in this file

test.describe("MOBILE MENU", () => {
  test("The sidebar opens with the Menu button on phones", { tag: "@major" }, async ({ page }) => {
    await page.goto("/");

    await expect(page.getByTestId("site-logo")).toBeVisible();
    await expect(page.getByTestId("left-menu")).toBeHidden(); // hidden on a small screen

    await page.getByTestId("menu-toggle").click();
    await expect(page.getByTestId("left-menu")).toBeVisible();
    await expect(page.getByTitle("Category / React")).toBeVisible(); // categories are reachable on a phone
  });
});