import type { PropsWithChildren } from "react";

export function Content({ children }: PropsWithChildren) {
  return <div className="flex min-w-0 flex-1 flex-col px-6">{children}</div>;
}