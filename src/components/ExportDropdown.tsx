import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Supplier } from '@/types/supplier';
import { exportToCSV, exportToPDF } from '@/utils/exportUtils';
import { toast } from '@/hooks/use-toast';

interface ExportDropdownProps {
  suppliers: Supplier[];
  disabled?: boolean;
}

export function ExportDropdown({ suppliers, disabled }: ExportDropdownProps) {
  const handleExportCSV = () => {
    if (suppliers.length === 0) {
      toast({
        title: 'No data to export',
        description: 'There are no suppliers matching your current filters.',
        variant: 'destructive',
      });
      return;
    }
    
    exportToCSV(suppliers);
    toast({
      title: 'Export successful',
      description: `Exported ${suppliers.length} suppliers to CSV.`,
    });
  };

  const handleExportPDF = () => {
    if (suppliers.length === 0) {
      toast({
        title: 'No data to export',
        description: 'There are no suppliers matching your current filters.',
        variant: 'destructive',
      });
      return;
    }
    
    exportToPDF(suppliers);
    toast({
      title: 'Export successful',
      description: `Generated PDF report with ${suppliers.length} suppliers.`,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={disabled} className="gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Export Format</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleExportCSV} className="gap-2 cursor-pointer">
          <FileSpreadsheet className="w-4 h-4 text-esg-environmental" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportPDF} className="gap-2 cursor-pointer">
          <FileText className="w-4 h-4 text-destructive" />
          Export as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
