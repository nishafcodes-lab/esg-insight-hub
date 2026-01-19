export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface ESGBreakdown {
  environmentalPolicy: boolean;
  carbonEmissions: boolean;
  iso14001: boolean;
  labourRights: boolean;
  healthSafety: boolean;
  antiCorruption: boolean;
}

export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'docx';
  uploadedAt: string;
  size: string;
}

export interface Supplier {
  id: string;
  name: string;
  country: string;
  category: string;
  esgScore: number;
  riskLevel: RiskLevel;
  esgBreakdown: ESGBreakdown;
  documents: Document[];
  createdAt: string;
  updatedAt: string;
}

export interface SupplierFormData {
  name: string;
  country: string;
  category: string;
}

export interface DashboardStats {
  totalSuppliers: number;
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
}
