import { Supplier } from '@/types/supplier';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// CSV Export
export function exportToCSV(suppliers: Supplier[], filename: string = 'suppliers-export') {
  const headers = [
    'Supplier Name',
    'Country',
    'Category',
    'ESG Score',
    'Risk Level',
    'Environmental Policy',
    'Carbon Emissions',
    'ISO 14001',
    'Labour Rights',
    'Health & Safety',
    'Anti-Corruption',
    'Created Date',
    'Updated Date',
  ];

  const rows = suppliers.map((s) => [
    s.name,
    s.country,
    s.category,
    s.esgScore.toString(),
    s.riskLevel,
    s.esgBreakdown.environmentalPolicy ? 'Yes' : 'No',
    s.esgBreakdown.carbonEmissions ? 'Yes' : 'No',
    s.esgBreakdown.iso14001 ? 'Yes' : 'No',
    s.esgBreakdown.labourRights ? 'Yes' : 'No',
    s.esgBreakdown.healthSafety ? 'Yes' : 'No',
    s.esgBreakdown.antiCorruption ? 'Yes' : 'No',
    new Date(s.createdAt).toLocaleDateString(),
    new Date(s.updatedAt).toLocaleDateString(),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

// PDF Export
export function exportToPDF(suppliers: Supplier[], filename: string = 'suppliers-report') {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(20);
  doc.setTextColor(34, 47, 62);
  doc.text('ESG Supplier Risk Report', 14, 22);
  
  // Subtitle with date
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 30);
  
  // Summary stats
  const stats = {
    total: suppliers.length,
    highRisk: suppliers.filter((s) => s.riskLevel === 'High').length,
    mediumRisk: suppliers.filter((s) => s.riskLevel === 'Medium').length,
    lowRisk: suppliers.filter((s) => s.riskLevel === 'Low').length,
    avgScore: Math.round(suppliers.reduce((acc, s) => acc + s.esgScore, 0) / suppliers.length),
  };

  doc.setFontSize(12);
  doc.setTextColor(34, 47, 62);
  doc.text('Summary', 14, 45);
  
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text(`Total Suppliers: ${stats.total}`, 14, 53);
  doc.text(`Average ESG Score: ${stats.avgScore}`, 14, 59);
  doc.text(`High Risk: ${stats.highRisk}  |  Medium Risk: ${stats.mediumRisk}  |  Low Risk: ${stats.lowRisk}`, 14, 65);

  // Suppliers table
  const tableData = suppliers.map((s) => [
    s.name,
    s.country,
    s.category,
    s.esgScore.toString(),
    s.riskLevel,
  ]);

  autoTable(doc, {
    startY: 75,
    head: [['Supplier Name', 'Country', 'Category', 'ESG Score', 'Risk Level']],
    body: tableData,
    headStyles: {
      fillColor: [34, 47, 62],
      textColor: 255,
      fontStyle: 'bold',
    },
    bodyStyles: {
      textColor: 50,
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
    columnStyles: {
      0: { cellWidth: 50 },
      3: { halign: 'center' },
      4: { halign: 'center' },
    },
    didParseCell: (data) => {
      if (data.column.index === 4 && data.section === 'body') {
        const risk = data.cell.raw as string;
        if (risk === 'High') {
          data.cell.styles.textColor = [239, 68, 68];
          data.cell.styles.fontStyle = 'bold';
        } else if (risk === 'Medium') {
          data.cell.styles.textColor = [245, 158, 11];
          data.cell.styles.fontStyle = 'bold';
        } else if (risk === 'Low') {
          data.cell.styles.textColor = [34, 197, 94];
          data.cell.styles.fontStyle = 'bold';
        }
      }
    },
  });

  doc.save(`${filename}-${new Date().toISOString().split('T')[0]}.pdf`);
}

// Single supplier PDF report
export function exportSupplierReport(supplier: Supplier) {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(34, 47, 62);
  doc.text('ESG Supplier Report', 14, 22);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 30);

  // Supplier name
  doc.setFontSize(16);
  doc.setTextColor(34, 47, 62);
  doc.text(supplier.name, 14, 48);

  // Basic info
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text(`Country: ${supplier.country}`, 14, 58);
  doc.text(`Category: ${supplier.category}`, 14, 64);
  doc.text(`Last Updated: ${new Date(supplier.updatedAt).toLocaleDateString()}`, 14, 70);

  // ESG Score box
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(130, 45, 60, 30, 3, 3, 'F');
  
  doc.setFontSize(24);
  const scoreColor = supplier.riskLevel === 'Low' ? [34, 197, 94] : 
                     supplier.riskLevel === 'Medium' ? [245, 158, 11] : [239, 68, 68];
  doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  doc.text(supplier.esgScore.toString(), 160, 60, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('ESG Score', 160, 70, { align: 'center' });

  // ESG Breakdown table
  doc.setFontSize(12);
  doc.setTextColor(34, 47, 62);
  doc.text('ESG Compliance Breakdown', 14, 90);

  const breakdownData = [
    ['Environmental Policy', supplier.esgBreakdown.environmentalPolicy ? '✓ Compliant' : '✗ Non-Compliant', '+15 pts'],
    ['Carbon Emissions Tracking', supplier.esgBreakdown.carbonEmissions ? '✓ Compliant' : '✗ Non-Compliant', '+20 pts'],
    ['ISO 14001 Certification', supplier.esgBreakdown.iso14001 ? '✓ Compliant' : '✗ Non-Compliant', '+15 pts'],
    ['Labour & Human Rights', supplier.esgBreakdown.labourRights ? '✓ Compliant' : '✗ Non-Compliant', '+20 pts'],
    ['Health & Safety', supplier.esgBreakdown.healthSafety ? '✓ Compliant' : '✗ Non-Compliant', '+15 pts'],
    ['Anti-Corruption Policy', supplier.esgBreakdown.antiCorruption ? '✓ Compliant' : '✗ Non-Compliant', '+15 pts'],
  ];

  autoTable(doc, {
    startY: 95,
    head: [['Criteria', 'Status', 'Points']],
    body: breakdownData,
    headStyles: {
      fillColor: [34, 47, 62],
      textColor: 255,
    },
    columnStyles: {
      1: { halign: 'center' },
      2: { halign: 'center' },
    },
    didParseCell: (data) => {
      if (data.column.index === 1 && data.section === 'body') {
        const status = data.cell.raw as string;
        if (status.includes('✓')) {
          data.cell.styles.textColor = [34, 197, 94];
          data.cell.styles.fontStyle = 'bold';
        } else {
          data.cell.styles.textColor = [239, 68, 68];
          data.cell.styles.fontStyle = 'bold';
        }
      }
    },
  });

  // Documents section if any
  if (supplier.documents.length > 0) {
    const finalY = (doc as any).lastAutoTable.finalY || 150;
    
    doc.setFontSize(12);
    doc.setTextColor(34, 47, 62);
    doc.text('Uploaded Documents', 14, finalY + 15);

    const docData = supplier.documents.map((d) => [
      d.name,
      d.type.toUpperCase(),
      d.size,
      new Date(d.uploadedAt).toLocaleDateString(),
    ]);

    autoTable(doc, {
      startY: finalY + 20,
      head: [['Document Name', 'Type', 'Size', 'Uploaded']],
      body: docData,
      headStyles: {
        fillColor: [100, 116, 139],
        textColor: 255,
      },
    });
  }

  doc.save(`${supplier.name.replace(/\s+/g, '-').toLowerCase()}-esg-report.pdf`);
}
