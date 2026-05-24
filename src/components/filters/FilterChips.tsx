import React from 'react';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

export interface FilterChip {
  id: string;
  label: string;
  value: string;
  onRemove: () => void;
}

interface FilterChipsProps {
  chips: FilterChip[];
  onClearAll: () => void;
}

export function FilterChips({ chips, onClearAll }: FilterChipsProps) {
  if (chips.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold text-slate-500">Active Filters:</span>
      {chips.map((chip) => (
        <Badge
          key={chip.id}
          variant="secondary"
          className="gap-1.5 pl-3 pr-1.5"
        >
          <span className="text-xs">{chip.label}</span>
          <button
            onClick={chip.onRemove}
            className="inline-flex items-center rounded hover:bg-slate-300"
            aria-label={`Remove ${chip.label} filter`}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      <button
        onClick={onClearAll}
        className="text-xs font-medium text-slate-500 hover:text-slate-700 underline"
      >
        Clear all
      </button>
    </div>
  );
}
