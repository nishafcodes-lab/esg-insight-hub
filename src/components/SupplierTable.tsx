import { Supplier } from '@/types/supplier';
import { RiskBadge } from './RiskBadge';
import { ESGScoreCircle } from './ESGScoreCircle';
import { Button } from '@/components/ui/button';
import { Eye, Edit, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';

interface SupplierTableProps {
  suppliers: Supplier[];
  onEdit?: (supplier: Supplier) => void;
}

export function SupplierTable({ suppliers, onEdit }: SupplierTableProps) {
  const navigate = useNavigate();

  if (suppliers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Eye className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No suppliers found</h3>
        <p className="text-muted-foreground max-w-sm">
          Try adjusting your search or filter criteria, or add a new supplier to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            <th>Supplier Name</th>
            <th>Country</th>
            <th>Category</th>
            <th>ESG Score</th>
            <th>Risk Level</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier, index) => (
            <tr 
              key={supplier.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <td>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">
                      {supplier.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{supplier.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Updated {new Date(supplier.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </td>
              <td>
                <span className="text-sm">{supplier.country}</span>
              </td>
              <td>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-secondary text-secondary-foreground text-xs font-medium">
                  {supplier.category}
                </span>
              </td>
              <td>
                <ESGScoreCircle score={supplier.esgScore} size="sm" showLabel={false} />
              </td>
              <td>
                <RiskBadge level={supplier.riskLevel} size="sm" />
              </td>
              <td>
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/supplier/${supplier.id}`)}
                    className="hidden sm:flex"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate(`/supplier/${supplier.id}`)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit?.(supplier)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Supplier
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
