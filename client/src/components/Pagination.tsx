import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi2';
import type { PaginationMeta } from '../types';

interface PaginationProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
}

export default function Pagination({ pagination, onPageChange }: PaginationProps) {
  const { page, totalPages, total, limit } = pagination;

  if (totalPages <= 1) return null;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const getPages = (): (number | '...')[] => {
    const pages: (number | '...')[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push('...');
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
        pages.push(i);
      }
      if (page < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  const btnClasses = "flex items-center justify-center min-w-[34px] h-[34px] px-2 border border-stone-200 dark:border-stone-800 rounded-md bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 text-[0.82rem] font-medium transition-colors hover:not-disabled:bg-stone-100 dark:hover:not-disabled:bg-stone-800 hover:not-disabled:border-stone-300 dark:hover:not-disabled:border-stone-700 hover:not-disabled:text-stone-900 dark:hover:not-disabled:text-stone-100 disabled:opacity-40 disabled:cursor-not-allowed";
  const activeClasses = "!bg-orange-600 !border-orange-600 !text-white";

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between flex-wrap gap-3" id="pagination">
      <span className="text-[0.82rem] text-stone-500 dark:text-stone-400 tabular-nums">
        Showing {start}–{end} of {total}
      </span>

      <div className="flex gap-1">
        <button
          className={btnClasses}
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <HiOutlineChevronLeft size={14} />
        </button>

        {getPages().map((p, idx) =>
          p === '...' ? (
            <span
              key={`ellipsis-${idx}`}
              className={`${btnClasses} !border-transparent !bg-transparent !cursor-default hover:!bg-transparent`}
            >
              …
            </span>
          ) : (
            <button
              key={p}
              className={`${btnClasses} ${page === p ? activeClasses : ''}`}
              onClick={() => onPageChange(p as number)}
              aria-label={`Page ${p}`}
              aria-current={page === p ? 'page' : undefined}
            >
              {p}
            </button>
          )
        )}

        <button
          className={btnClasses}
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <HiOutlineChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
