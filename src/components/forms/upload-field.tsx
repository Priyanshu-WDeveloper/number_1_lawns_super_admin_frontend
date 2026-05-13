'use client';

import { Upload, FileText, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface UploadFieldProps {
  label: string;
  value?: File | null;
  onChange?: (file: File | null) => void;
  required?: boolean;
  acceptedTypes?: string[];
}

const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'];

export function UploadField({
  label,
  value,
  onChange,
  required,
  acceptedTypes = ALLOWED_TYPES,
}: UploadFieldProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (!acceptedTypes.includes(file.type)) {
        alert('Invalid file type. Allowed: PDF, JPG, PNG, DOC, DOCX');
        return;
      }
      onChange?.(file);
    }
  };

  const handleRemove = () => {
    onChange?.(null);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium flex items-center gap-2">
        <FileText className="h-4 w-4 text-primary" />
        {label}
        {required && <span className="text-primary">*</span>}
      </label>

      {value ? (
        <div className="flex items-center gap-3 p-3 border rounded-lg bg-secondary">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{value.name}</p>
            <p className="text-xs text-muted-foreground">{(value.size / 1024).toFixed(1)} KB</p>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="p-1.5 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <label className="flex items-center justify-center gap-3 cursor-pointer px-5 py-8 border-2 border-dashed rounded-lg hover:bg-secondary/50 transition-colors group">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary group-hover:bg-primary/10 transition-colors">
            <Upload className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <div className="text-center">
            <span className="text-sm font-medium group-hover:text-primary transition-colors">
              Click to upload
            </span>
            <p className="text-xs text-muted-foreground mt-0.5">
              PDF, JPG, PNG, DOC, DOCX
            </p>
          </div>
          <Input
            type="file"
            className="hidden"
            accept={ALLOWED_EXTENSIONS.join(',')}
            onChange={handleFileChange}
          />
        </label>
      )}
    </div>
  );
}