export function LinkList({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="py-4">
      <h2 className="mb-2 text-lg font-bold">{title}</h2>
      <ul className="flex flex-col gap-1">{children}</ul>
    </div>
  );
}