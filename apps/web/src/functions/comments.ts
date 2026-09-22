export type CommentNode = {
  id: number;
  parentId: number | null;
  author: string;
  content: string;
  createdAt: Date;
  replies: CommentNode[]; // the replies to this comment, each with their own replies
};

export function buildCommentTree(
  comments: { id: number; parentId: number | null; author: string; content: string; createdAt: Date }[],
): CommentNode[] {
  const nodes: CommentNode[] = comments.map((c) => ({ ...c, replies: [] })); // copy each comment, with an empty replies list
  const roots: CommentNode[] = []; // top-level comments

  for (const node of nodes) {
    if (node.parentId === null) {
      roots.push(node); // no parent, so it's a top-level comment
    } else {
      const parent = nodes.find((n) => n.id === node.parentId);
      if (parent) {
        parent.replies.push(node); // put the reply inside its parent
      } else {
        roots.push(node); // parent missing, so show it at the top instead of losing it
      }
    }
  }

  return roots;
}