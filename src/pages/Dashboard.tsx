import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, AlertTriangle, AlertCircle, CheckCircle, Plus } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { StatCard } from '@/components/StatCard';
import { SupplierTable } from '@/components/SupplierTable';
import { SupplierFilters } from '@/components/SupplierFilters';
import { DashboardCharts } from '@/components/DashboardCharts';
import { ExportDropdown } from '@/components/ExportDropdown';
import { Button } from '@/components/ui/button';
import { mockSuppliers, getDashboardStats } from '@/data/mockData';
import { RiskLevel, Supplier } from '@/types/supplier';

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'all'>('all');
  const [countryFilter, setCountryFilter] = useState('all');

  const stats = useMemo(() => getDashboardStats(mockSuppliers), []);

  const filteredSuppliers = useMemo(() => {
    return mockSuppliers.filter((supplier) => {
      const matchesSearch = supplier.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRisk = riskFilter === 'all' || supplier.riskLevel === riskFilter;
      const matchesCountry = countryFilter === 'all' || supplier.country === countryFilter;
      
      return matchesSearch && matchesRisk && matchesCountry;
    });
  }, [searchQuery, riskFilter, countryFilter]);

  const hasActiveFilters = searchQuery !== '' || riskFilter !== 'all' || countryFilter !== 'all';

  const clearFilters = () => {
    setSearchQuery('');
    setRiskFilter('all');
    setCountryFilter('all');
  };

  const handleEditSupplier = (supplier: Supplier) => {
    navigate(`/supplier/edit/${supplier.id}`);
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">ESG Supplier Risk Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Monitor and evaluate supplier ESG compliance and risk levels
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ExportDropdown suppliers={filteredSuppliers} />
            <Button onClick={() => navigate('/supplier/new')} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Supplier
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Suppliers"
            value={stats.totalSuppliers}
            icon={Building2}
            variant="default"
          />
          <StatCard
            title="High Risk"
            value={stats.highRisk}
            icon={AlertTriangle}
            variant="high"
          />
          <StatCard
            title="Medium Risk"
            value={stats.mediumRisk}
            icon={AlertCircle}
            variant="medium"
          />
          <StatCard
            title="Low Risk"
            value={stats.lowRisk}
            icon={CheckCircle}
            variant="low"
          />
        </div>

        {/* Charts Section */}
        <DashboardCharts suppliers={mockSuppliers} stats={stats} />

        {/* Suppliers Table Section */}
        <div className="card-elevated">
          <div className="p-6 border-b border-border">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Suppliers</h2>
                <p className="text-sm text-muted-foreground">
                  {filteredSuppliers.length} of {mockSuppliers.length} suppliers
                </p>
              </div>
              <SupplierFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                riskFilter={riskFilter}
                onRiskFilterChange={setRiskFilter}
                countryFilter={countryFilter}
                onCountryFilterChange={setCountryFilter}
                onClearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </div>
          </div>
          <SupplierTable 
            suppliers={filteredSuppliers} 
            onEdit={handleEditSupplier}
          />
        </div>
      </div>
    </Layout>
  );
}
