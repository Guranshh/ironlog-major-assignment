import type { CommentNode } from "@/functions/comments";
import { ReplyBox } from "./ReplyBox";

export function CommentThread({
  comment,
  urlId,
  depth,
}: {
  comment: CommentNode;
  urlId: string;
  depth: number; // 0 for top-level, 1 for a reply, 2 for a reply to a reply...
}) {
  const date = comment.createdAt.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <li data-test-id="comment-item" className="flex flex-col gap-3">
      <div className="bg-secondary/5 rounded-lg p-4">
        <div className="flex items-center gap-2 text-xs">
          <span data-test-id="comment-author" className="text-primary font-semibold">
            {comment.author}
          </span>
          <span className="text-secondary">{date}</span>
        </div>
        <p data-test-id="comment-content" className="text-primary mt-1 text-sm whitespace-pre-line">
          {comment.content}
        </p>
        <ReplyBox urlId={urlId} parentId={comment.id} />
      </div>

      {comment.replies.length > 0 && (
        <ul
          data-test-id="comment-replies"
          className={
            depth < 4
              ? "border-secondary/20 ml-3 flex flex-col gap-3 border-l-2 pl-3 md:ml-6 md:pl-4" // indent the first few levels
              : "flex flex-col gap-3" // stop indenting deep threads so they still fit on a phone
          }
        >
          {comment.replies.map((reply) => (
            <CommentThread key={reply.id} comment={reply} urlId={urlId} depth={depth + 1} /> // same component, one level deeper
          ))}
        </ul>
      )}
    </li>
  );
}