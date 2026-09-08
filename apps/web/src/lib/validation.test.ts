import { describe, expect, test } from "vitest";
import { validatePostUpdate, validateUrlId } from "./validation";

describe("validateUrlId", () => {
  test("returns a valid slug unchanged", () => {
    expect(validateUrlId("boost-your-conversion-rate")).toBe(
      "boost-your-conversion-rate",
    );
  });

  test("trims surrounding whitespace", () => {
    expect(validateUrlId("  my-post  ")).toBe("my-post"); // the trimmed value is what reaches the database
  });

  test("accepts digits and hyphens", () => {
    expect(validateUrlId("post-123-abc")).toBe("post-123-abc");
  });

  test("rejects values that are not strings", () => {
    expect(() => validateUrlId(42)).toThrow(); // a number could come from a malformed client request
    expect(() => validateUrlId(null)).toThrow();
    expect(() => validateUrlId(undefined)).toThrow();
    expect(() => validateUrlId({})).toThrow();
  });

  test("rejects empty or whitespace-only values", () => {
    expect(() => validateUrlId("")).toThrow();
    expect(() => validateUrlId("   ")).toThrow();
  });

  test("rejects slugs with invalid characters", () => {
    expect(() => validateUrlId("Boost-Your-Post")).toThrow(); // uppercase is not a valid slug
    expect(() => validateUrlId("my post")).toThrow(); // spaces are not allowed
    expect(() => validateUrlId("../../etc/passwd")).toThrow(); // path traversal attempt
    expect(() => validateUrlId("'; DROP TABLE posts; --")).toThrow(); // SQL injection attempt
  });
});

describe("validatePostUpdate", () => {
  const valid = {
    title: "A title",
    description: "A description",
    content: "Some content",
    tags: "Back-End,Databases",
  };

  test("returns the cleaned data when every field is valid", () => {
    expect(validatePostUpdate(valid)).toEqual(valid);
  });

  test("trims every field", () => {
    const result = validatePostUpdate({
      title: "  A title  ",
      description: "  A description  ",
      content: "  Some content  ",
      tags: "  Back-End  ",
    });

    expect(result).toEqual({
      title: "A title",
      description: "A description",
      content: "Some content",
      tags: "Back-End",
    });
  });

  test("rejects values that are not objects", () => {
    expect(() => validatePostUpdate(null)).toThrow(); // typeof null is "object", so this is worth checking explicitly
    expect(() => validatePostUpdate("a string")).toThrow();
    expect(() => validatePostUpdate(42)).toThrow();
    expect(() => validatePostUpdate(undefined)).toThrow();
  });

  test("rejects an object with a missing field", () => {
    expect(() => validatePostUpdate({ ...valid, title: undefined })).toThrow();
    expect(() => validatePostUpdate({ ...valid, tags: undefined })).toThrow();
  });

  test("rejects an empty field", () => {
    expect(() => validatePostUpdate({ ...valid, title: "" })).toThrow();
    expect(() => validatePostUpdate({ ...valid, title: "   " })).toThrow(); // whitespace only, the case the e2e test covers
  });

  test("rejects a field of the wrong type", () => {
    expect(() => validatePostUpdate({ ...valid, title: 42 })).toThrow();
    expect(() => validatePostUpdate({ ...valid, content: [] })).toThrow();
  });

  test("rejects a field that is too long", () => {
    expect(() =>
      validatePostUpdate({ ...valid, title: "a".repeat(201) }), // the title limit is 200
    ).toThrow();

    expect(() =>
      validatePostUpdate({ ...valid, description: "a".repeat(1001) }), // the description limit is 1000
    ).toThrow();
  });

  test("accepts a field at exactly the length limit", () => {
    const title = "a".repeat(200); // the boundary itself should pass
    expect(validatePostUpdate({ ...valid, title }).title).toBe(title);
  });
});