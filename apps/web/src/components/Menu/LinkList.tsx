export function LinkList({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-secondary mb-2 px-3 text-xs font-semibold tracking-widest uppercase">
        {title}
      </h2>
      <ul className="flex flex-col gap-0.5">{children}</ul>
    </div>
  );
}