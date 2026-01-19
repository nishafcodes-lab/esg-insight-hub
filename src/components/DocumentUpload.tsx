import { useState, useCallback } from 'react';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  status: 'uploading' | 'success' | 'error';
  progress: number;
}

interface DocumentUploadProps {
  onUploadComplete?: (files: File[]) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
}

const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const allowedExtensions = ['.pdf', '.docx'];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export function DocumentUpload({ onUploadComplete, maxFiles = 5 }: DocumentUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const validateFile = (file: File): boolean => {
    const isValidType = allowedTypes.includes(file.type) || 
      allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
    
    if (!isValidType) {
      toast({
        title: 'Invalid file type',
        description: `${file.name} is not a valid file. Only PDF and DOCX files are allowed.`,
        variant: 'destructive',
      });
      return false;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: 'File too large',
        description: `${file.name} exceeds the 10MB size limit.`,
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const simulateUpload = (file: UploadedFile) => {
    const interval = setInterval(() => {
      setFiles(prev => prev.map(f => {
        if (f.id === file.id && f.status === 'uploading') {
          const newProgress = Math.min(f.progress + Math.random() * 30, 100);
          if (newProgress >= 100) {
            clearInterval(interval);
            return { ...f, progress: 100, status: 'success' as const };
          }
          return { ...f, progress: newProgress };
        }
        return f;
      }));
    }, 200);
  };

  const handleFiles = useCallback((fileList: FileList) => {
    const validFiles = Array.from(fileList).filter(validateFile);
    
    if (files.length + validFiles.length > maxFiles) {
      toast({
        title: 'Too many files',
        description: `You can only upload up to ${maxFiles} files at a time.`,
        variant: 'destructive',
      });
      return;
    }

    const newFiles: UploadedFile[] = validFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: formatFileSize(file.size),
      status: 'uploading' as const,
      progress: 0,
    }));

    setFiles(prev => [...prev, ...newFiles]);
    newFiles.forEach(simulateUpload);
    
    if (validFiles.length > 0) {
      onUploadComplete?.(validFiles);
    }
  }, [files.length, maxFiles, onUploadComplete]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="space-y-4">
      <div
        className={cn('upload-zone cursor-pointer', dragOver && 'dragover')}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          className="hidden"
          multiple
          accept=".pdf,.docx"
          onChange={handleInputChange}
        />
        <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-lg font-medium mb-1">Drop files here or click to upload</p>
        <p className="text-sm text-muted-foreground">
          Supports PDF and DOCX files up to 10MB
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map(file => (
            <div
              key={file.id}
              className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card"
            >
              <File className="w-8 h-8 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <span className="text-xs text-muted-foreground ml-2">{file.size}</span>
                </div>
                {file.status === 'uploading' && (
                  <Progress value={file.progress} className="h-1.5" />
                )}
              </div>
              <div className="flex items-center gap-2">
                {file.status === 'success' && (
                  <CheckCircle className="w-5 h-5 text-risk-low" />
                )}
                {file.status === 'error' && (
                  <AlertCircle className="w-5 h-5 text-risk-high" />
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => removeFile(file.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
