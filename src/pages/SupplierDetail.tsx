import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, FileText, Download, Calendar, MapPin, Tag, Upload } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { RiskBadge } from '@/components/RiskBadge';
import { ESGScoreCircle } from '@/components/ESGScoreCircle';
import { ESGBreakdown } from '@/components/ESGBreakdown';
import { DocumentUpload } from '@/components/DocumentUpload';
import { mockSuppliers } from '@/data/mockData';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function SupplierDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const supplier = mockSuppliers.find(s => s.id === id);

  if (!supplier) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
            <FileText className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Supplier Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The supplier you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </Layout>
    );
  }

  const getFileIcon = (type: string) => {
    return <FileText className="w-5 h-5 text-muted-foreground" />;
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mt-1">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold">{supplier.name}</h1>
                <RiskBadge level={supplier.riskLevel} size="lg" />
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {supplier.country}
                </span>
                <span className="flex items-center gap-1.5">
                  <Tag className="w-4 h-4" />
                  {supplier.category}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  Updated {new Date(supplier.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate(`/supplier/edit/${supplier.id}`)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Supplier
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ESG Score Card */}
          <div className="card-elevated p-6 flex flex-col items-center justify-center">
            <h2 className="text-lg font-semibold mb-6">ESG Score</h2>
            <ESGScoreCircle score={supplier.esgScore} size="xl" />
            <p className="text-sm text-muted-foreground mt-4 text-center max-w-[200px]">
              Based on environmental, social, and governance criteria
            </p>
          </div>

          {/* ESG Breakdown */}
          <div className="lg:col-span-2 card-elevated p-6">
            <h2 className="text-lg font-semibold mb-4">ESG Compliance Breakdown</h2>
            <ESGBreakdown breakdown={supplier.esgBreakdown} showPoints />
          </div>
        </div>

        {/* Documents Section */}
        <div className="card-elevated p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold">Documents</h2>
              <p className="text-sm text-muted-foreground">
                {supplier.documents.length} document{supplier.documents.length !== 1 ? 's' : ''} uploaded
              </p>
            </div>
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Document
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Upload Documents</DialogTitle>
                </DialogHeader>
                <DocumentUpload
                  onUploadComplete={(files) => {
                    console.log('Uploaded files:', files);
                    setUploadDialogOpen(false);
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>

          {supplier.documents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-border rounded-lg">
              <FileText className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="font-medium mb-1">No documents yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Upload ESG reports, certifications, and compliance documents
              </p>
              <Button variant="outline" onClick={() => setUploadDialogOpen(true)}>
                <Upload className="w-4 h-4 mr-2" />
                Upload First Document
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {supplier.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors group"
                >
                  {getFileIcon(doc.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {doc.size} • {new Date(doc.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
