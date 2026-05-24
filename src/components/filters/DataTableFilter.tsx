import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar, Filter, X } from 'lucide-react';
import { format } from 'date-fns';

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

interface DataTableFilterProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
  searchPlaceholder?: string;
  statusOptions?: Array<{ value: string; label: string }>;
  roleOptions?: Array<{ value: string; label: string }>;
  regionOptions?: Array<{ value: string; label: string }>;
  showDateRange?: boolean;
  showStatus?: boolean;
  showRole?: boolean;
  showRegion?: boolean;
  showSearch?: boolean;
}

export function DataTableFilter({
  filters,
  onFiltersChange,
  onReset,
  hasActiveFilters,
  searchPlaceholder = 'Search...',
  statusOptions = [],
  roleOptions = [],
  regionOptions = [],
  showDateRange = false,
  showStatus = false,
  showRole = false,
  showRegion = false,
  showSearch = true,
}: DataTableFilterProps) {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value });
  };

  const handleStatusChange = (value: string) => {
    onFiltersChange({ ...filters, status: value || undefined });
  };

  const handleRoleChange = (value: string) => {
    onFiltersChange({ ...filters, role: value || undefined });
  };

  const handleRegionChange = (value: string) => {
    onFiltersChange({ ...filters, region: value || undefined });
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2">
        {/* Search Input */}
        {showSearch && (
          <div className="flex-1 min-w-0">
            <Input
              placeholder={searchPlaceholder}
              value={filters.search || ''}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="h-9 text-sm"
            />
          </div>
        )}

        {/* Status Filter */}
        {showStatus && statusOptions.length > 0 && (
          <Select value={filters.status || ''} onValueChange={handleStatusChange}>
            <SelectTrigger className="h-9 w-full sm:w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Role Filter */}
        {showRole && roleOptions.length > 0 && (
          <Select value={filters.role || ''} onValueChange={handleRoleChange}>
            <SelectTrigger className="h-9 w-full sm:w-[140px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Roles</SelectItem>
              {roleOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Region Filter */}
        {showRegion && regionOptions.length > 0 && (
          <Select value={filters.region || ''} onValueChange={handleRegionChange}>
            <SelectTrigger className="h-9 w-full sm:w-[140px]">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Regions</SelectItem>
              {regionOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Date Range Filter */}
        {showDateRange && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-2 text-xs font-medium"
              >
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  {filters.dateRange
                    ? `${format(filters.dateRange.from, 'MMM dd')} - ${format(
                        filters.dateRange.to,
                        'MMM dd'
                      )}`
                    : 'Date Range'}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <div className="p-4 text-sm text-slate-600">
                Date range filter coming soon
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Reset Button */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-9 gap-1 text-xs text-slate-600 hover:text-slate-900"
        >
          <X className="h-3.5 w-3.5" />
          Reset
        </Button>
      )}
    </div>
  );
}
