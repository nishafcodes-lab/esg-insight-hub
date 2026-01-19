import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RiskLevel } from '@/types/supplier';
import { countries } from '@/data/mockData';

interface SupplierFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  riskFilter: RiskLevel | 'all';
  onRiskFilterChange: (value: RiskLevel | 'all') => void;
  countryFilter: string;
  onCountryFilterChange: (value: string) => void;
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
  onClearFilters,
  hasActiveFilters,
}: SupplierFiltersProps) {
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
