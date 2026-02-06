import { Search, Filter, X, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
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
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { RiskLevel } from '@/types/supplier';
import { countries } from '@/data/mockData';

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface SupplierFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  riskFilter: RiskLevel | 'all';
  onRiskFilterChange: (value: RiskLevel | 'all') => void;
  countryFilter: string;
  onCountryFilterChange: (value: string) => void;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function SupplierFilters({
  searchQuery,
  onSearchChange,
  riskFilter,
  onRiskFilterChange,
  countryFilter,
  onCountryFilterChange,
  dateRange,
  onDateRangeChange,
  onClearFilters,
  hasActiveFilters,
}: SupplierFiltersProps) {
  const dateLabel = dateRange.from
    ? dateRange.to
      ? `${format(dateRange.from, 'MMM d')} – ${format(dateRange.to, 'MMM d')}`
      : format(dateRange.from, 'MMM d, yyyy')
    : null;
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search suppliers..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Risk Level Filter */}
      <Select value={riskFilter} onValueChange={(value) => onRiskFilterChange(value as RiskLevel | 'all')}>
        <SelectTrigger className="w-full sm:w-[160px]">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <SelectValue placeholder="Risk Level" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Risks</SelectItem>
          <SelectItem value="Low">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-risk-low" />
              Low Risk
            </div>
          </SelectItem>
          <SelectItem value="Medium">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-risk-medium" />
              Medium Risk
            </div>
          </SelectItem>
          <SelectItem value="High">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-risk-high" />
              High Risk
            </div>
          </SelectItem>
        </SelectContent>
      </Select>

      {/* Country Filter */}
      <Select value={countryFilter} onValueChange={onCountryFilterChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="All Countries" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Countries</SelectItem>
          {countries.map((country) => (
            <SelectItem key={country} value={country}>
              {country}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Date Range Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full sm:w-[220px] justify-start text-left font-normal',
              !dateRange.from && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            {dateLabel ?? 'Filter by date'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={dateRange.from ? { from: dateRange.from, to: dateRange.to } : undefined}
            onSelect={(range) =>
              onDateRangeChange({ from: range?.from, to: range?.to })
            }
            numberOfMonths={2}
            initialFocus
            className={cn('p-3 pointer-events-auto')}
          />
        </PopoverContent>
      </Popover>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button variant="outline" onClick={onClearFilters} className="gap-2">
          <X className="w-4 h-4" />
          Clear
        </Button>
      )}
    </div>
  );
}
