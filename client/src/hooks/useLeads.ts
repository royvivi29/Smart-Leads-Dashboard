import { useState, useEffect, useCallback } from 'react';
import type { Lead, LeadFilters, PaginationMeta } from '../types';
import { leadsApi, getErrorMessage } from '../services/api';
import { useDebounce } from './useDebounce';

interface UseLeadsReturn {
  leads: Lead[];
  pagination: PaginationMeta | null;
  filters: LeadFilters;
  isLoading: boolean;
  error: string | null;
  setFilter: <K extends keyof LeadFilters>(key: K, value: LeadFilters[K]) => void;
  resetFilters: () => void;
  refetch: () => void;
}

const DEFAULT_FILTERS: LeadFilters = {
  page: 1,
  status: '',
  source: '',
  search: '',
  sortBy: 'latest',
};

export function useLeads(): UseLeadsReturn {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [filters, setFilters] = useState<LeadFilters>(DEFAULT_FILTERS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(filters.search, 400);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await leadsApi.getAll({
        ...filters,
        search: debouncedSearch,
      });
      setLeads(res.data.data || []);
      setPagination(res.data.pagination || null);
    } catch (err) {
      setError(getErrorMessage(err));
      setLeads([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters.page, filters.status, filters.source, filters.sortBy, debouncedSearch]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const setFilter = useCallback(<K extends keyof LeadFilters>(key: K, value: LeadFilters[K]) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      ...(key !== 'page' ? { page: 1 } : {}),
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  return {
    leads,
    pagination,
    filters,
    isLoading,
    error,
    setFilter,
    resetFilters,
    refetch: fetchLeads,
  };
}
