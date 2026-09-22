import { expect, test } from "./fixtures";

const POST = "/post/no-front-end-framework-is-the-best";
const FAKE_URL = "https://res.cloudinary.com/demo/image/upload/sample.jpg"; // what our pretend Cloudinary replies with

test.describe("IMAGE UPLOAD", () => {
  test("Uploading an image fills in the image URL and preview", { tag: "@major" }, async ({ userPage }) => {
    let sentPreset = false;

    await userPage.route("https://api.cloudinary.com/**", async (route) => {
      sentPreset = (route.request().postData() ?? "").includes("upload_preset"); // the upload included our preset
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ secure_url: FAKE_URL }), // the same shape Cloudinary really sends
      });
    });

    await userPage.goto(POST);
    await userPage.getByTestId("image-upload").setInputFiles({
      name: "workout.png",
      mimeType: "image/png",
      buffer: Buffer.from("pretend image bytes"), // a tiny fake file, the upload is intercepted anyway
    });

    await expect(userPage.locator("#imageUrl")).toHaveValue(FAKE_URL); // the box was filled automatically
    await expect(userPage.getByTestId("image-preview")).toHaveAttribute("src", FAKE_URL);
    expect(sentPreset).toBe(true);
  });

  test("Files that are not images are rejected", { tag: "@major" }, async ({ userPage }) => {
    await userPage.goto(POST);
    const before = await userPage.locator("#imageUrl").
    inputValue();

    await userPage.getByTestId("image-upload").setInputFiles({
      name: "notes.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("not an image"),
    });

    await expect(userPage.getByTestId("upload-error")).toHaveText("Please choose an image file");
    await expect(userPage.locator("#imageUrl")).toHaveValue(before); // the old image is kept
  });

  test("A failed upload shows an error", { tag: "@major" }, async ({ userPage }) => {
    await userPage.route("https://api.cloudinary.com/**", async (route) => {
      await route.fulfill({ status: 500, contentType: "application/json", body: "{}" }); // pretend Cloudinary broke
    });

    await userPage.goto(POST);
    await userPage.getByTestId("image-upload").setInputFiles({
      name: "workout.png",
      mimeType: "image/png",
      buffer: Buffer.from("pretend image bytes"),
    });

    await expect(userPage.getByTestId("upload-error")).toHaveText("Upload failed, please try again");
  });
});