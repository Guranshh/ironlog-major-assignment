import { expect, test } from "vitest";
import { buildCommentTree } from "./comments";

const date = new Date("2026-01-01");

test("returns an empty list when there are no comments", () => {
  expect(buildCommentTree([])).toEqual([]);
});

test("nests replies under their parent at any depth", () => {
  const tree = buildCommentTree([
    { id: 1, parentId: null, author: "A", content: "Top", createdAt: date },
    { id: 2, parentId: 1, author: "B", content: "Reply", createdAt: date },
    { id: 3, parentId: 2, author: "C", content: "Reply to reply", createdAt: date },
    { id: 4, parentId: null, author: "D", content: "Second top", createdAt: date },
  ]);

  expect(tree).toHaveLength(2); // two top-level comments
  expect(tree[0]!.replies[0]!.content).toBe("Reply");
  expect(tree[0]!.replies[0]!.replies[0]!.content).toBe("Reply to reply");
  expect(tree[1]!.replies).toEqual([]);
});