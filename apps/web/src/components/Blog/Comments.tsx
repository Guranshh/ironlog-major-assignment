import { buildCommentTree } from "@/functions/comments";
import { findComments } from "@/lib/db/comments";
import { CommentForm } from "./CommentForm";
import { CommentThread } from "./CommentThread";

export async function Comments({ postId, urlId }: { postId: number; urlId: string }) {
  const rows = await findComments(postId); // read fresh every time, not cached, so new comments show at once
  const tree = buildCommentTree(rows);

  return (
    <section data-test-id="comments" className="border-secondary/15 flex flex-col gap-6 border-t py-8">
      <h2 data-test-id="comment-count" className="text-primary text-2xl font-bold">
        {rows.length} {rows.length === 1 ? "comment" : "comments"}
      </h2>

      <CommentForm urlId={urlId} />

      {tree.length === 0 ? (
        <p className="text-secondary text-sm">No comments yet. Be the first!</p>
      ) : (
        <ul className="flex flex-col gap-6">
          {tree.map((comment) => (
            <CommentThread key={comment.id} comment={comment} urlId={urlId} depth={0} />
          ))}
        </ul>
      )}
    </section>
  );
}