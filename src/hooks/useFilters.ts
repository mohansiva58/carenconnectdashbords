import { useState, useCallback, useMemo } from 'react';

export interface FilterOptions {
  search?: string;
  status?: string;
  role?: string;
  region?: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
  [key: string]: any;
}

interface FilterChip {
  id: string;
  label: string;
  value: string;
  onRemove: () => void;
}

export function useFilters(initialFilters: FilterOptions = {}) {
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);

  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some((value) => {
      if (value === undefined || value === null || value === '') {
        return false;
      }
      if (typeof value === 'object' && Object.keys(value).length === 0) {
        return false;
      }
      return true;
    });
  }, [filters]);

  const filterChips = useMemo<FilterChip[]>(() => {
    const chips: FilterChip[] = [];

    if (filters.search) {
      chips.push({
        id: 'search',
        label: `Search: "${filters.search}"`,
        value: filters.search,
        onRemove: () => setFilters((prev) => ({ ...prev, search: undefined })),
      });
    }

    if (filters.status) {
      chips.push({
        id: 'status',
        label: `Status: ${filters.status}`,
        value: filters.status,
        onRemove: () => setFilters((prev) => ({ ...prev, status: undefined })),
      });
    }

    if (filters.role) {
      chips.push({
        id: 'role',
        label: `Role: ${filters.role}`,
        value: filters.role,
        onRemove: () => setFilters((prev) => ({ ...prev, role: undefined })),
      });
    }

    if (filters.region) {
      chips.push({
        id: 'region',
        label: `Region: ${filters.region}`,
        value: filters.region,
        onRemove: () => setFilters((prev) => ({ ...prev, region: undefined })),
      });
    }

    if (filters.dateRange) {
      chips.push({
        id: 'dateRange',
        label: `Date Range: ${filters.dateRange.from.toLocaleDateString()} - ${filters.dateRange.to.toLocaleDateString()}`,
        value: `${filters.dateRange.from}-${filters.dateRange.to}`,
        onRemove: () => setFilters((prev) => ({ ...prev, dateRange: undefined })),
      });
    }

    return chips;
  }, [filters]);

  const updateFilters = useCallback((newFilters: FilterOptions) => {
    setFilters(newFilters);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const removeFilter = useCallback((key: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: undefined,
    }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({});
  }, []);

  return {
    filters,
    updateFilters,
    resetFilters,
    removeFilter,
    clearAllFilters,
    hasActiveFilters,
    filterChips,
  };
}
