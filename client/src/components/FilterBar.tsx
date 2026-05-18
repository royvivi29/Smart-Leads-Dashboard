import { LeadStatus, LeadSource } from '../types';
import type { LeadFilters } from '../types';
import { HiOutlineMagnifyingGlass } from 'react-icons/hi2';

interface FilterBarProps {
  filters: LeadFilters;
  onFilterChange: <K extends keyof LeadFilters>(key: K, value: LeadFilters[K]) => void;
  onReset: () => void;
  totalResults: number;
}

export default function FilterBar({
  filters,
  onFilterChange,
  onReset,
  totalResults,
}: FilterBarProps) {
  const hasActiveFilters =
    filters.status !== '' ||
    filters.source !== '' ||
    filters.search !== '' ||
    filters.sortBy !== 'latest';

  const inputClasses = "px-3.5 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm w-full md:w-auto min-w-[150px] text-stone-800 dark:text-stone-200";

  return (
    <div className="bg-white/80 dark:bg-[#1a1917]/80 backdrop-blur-sm border border-stone-200 dark:border-stone-700/50 rounded-2xl shadow-sm mb-5">
      <div className="px-5 py-4">
        <div className="flex flex-col md:flex-row flex-wrap gap-3 items-stretch md:items-center">
          <div className="relative flex-1 min-w-[200px] max-w-full md:max-w-xs">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500" />
            <input
              type="text"
              className={`${inputClasses} !pl-9`}
              placeholder="Search by name or email…"
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
              id="search-input"
            />
          </div>

          <select
            className={inputClasses}
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value as LeadStatus | '')}
            id="filter-status"
          >
            <option value="">All statuses</option>
            {Object.values(LeadStatus).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            className={inputClasses}
            value={filters.source}
            onChange={(e) => onFilterChange('source', e.target.value as LeadSource | '')}
            id="filter-source"
          >
            <option value="">All sources</option>
            {Object.values(LeadSource).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            className={inputClasses}
            value={filters.sortBy}
            onChange={(e) => onFilterChange('sortBy', e.target.value as 'latest' | 'oldest')}
            id="filter-sort"
          >
            <option value="latest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>

          {hasActiveFilters && (
            <button 
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100 border border-stone-200 dark:border-stone-700 transition-all"
              onClick={onReset} 
              id="filter-reset-btn"
            >
              Clear filters
            </button>
          )}

          <span className="text-sm text-stone-500 dark:text-stone-400 tabular-nums ml-0 md:ml-auto mt-2 md:mt-0 text-center md:text-right font-medium">
            {totalResults} lead{totalResults !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  );
}
