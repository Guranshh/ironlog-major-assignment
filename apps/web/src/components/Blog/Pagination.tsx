import Link from "next/link";

export function Pagination({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) {
    return null; // everything fits on one page, so no controls
  }

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1); // [1, 2, 3, ...]

  const linkStyle =
    "rounded-md border border-secondary/30 px-3 py-1.5 text-sm text-primary hover:border-wsu hover:text-wsu";
  const disabledStyle =
    "rounded-md border border-secondary/15 px-3 py-1.5 text-sm text-secondary/50 cursor-not-allowed";

  return (
    <nav
      aria-label="Pagination"
      data-test-id="pagination"
      className="border-secondary/15 flex flex-wrap items-center justify-between gap-4 border-t py-6"
    >
      <p className="text-secondary text-sm" data-test-id="pagination-info">
        Page {page} of {totalPages}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        {page > 1 ? (
          <Link href={`/?page=${page - 1}`} className={linkStyle} data-test-id="pagination-prev">
            Previous
          </Link>
        ) : (
          <span className={disabledStyle}>Previous</span> // on page 1 there is nothing before
        )}

        {pageNumbers.map((n) =>
          n === page ? (
            <span
              key={n}
              aria-current="page" // tells screen readers this is the current page
              data-test-id={`pagination-page-${n}`}
              className="bg-wsu rounded-md px-3 py-1.5 text-sm font-semibold text-white"
            >
              {n}
            </span>
          ) : (
            <Link key={n} href={`/?page=${n}`} className={linkStyle} data-test-id={`pagination-page-${n}`}>
              {n}
            </Link>
          ),
        )}

        {page < totalPages ? (
          <Link href={`/?page=${page + 1}`} className={linkStyle} data-test-id="pagination-next">
            Next
          </Link>
        ) : (
          <span className={disabledStyle}>Next</span> // on the last page there is nothing after
        )}
      </div>
    </nav>
  );
}