import { useState, useEffect } from 'react';
import { Plus, X, Upload, FileText, File } from 'lucide-react';

import { formatFileSize } from '../../lib/file-utils';
import { DocumentPreviewModal } from './document-preview-modal';

export interface NamedDoc {
  name: string;
  file: File | null;
}

interface NamedDocumentUploadProps {
  documents: NamedDoc[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onNameChange: (index: number, name: string) => void;
  onFileChange: (index: number, file: File | null) => void;
}

function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2).toUpperCase();
}

const EXTENSION_COLORS: Record<string, { bg: string; text: string; icon: string }> = {
  PDF: { bg: 'bg-red-50', text: 'text-red-600', icon: 'text-red-500' },
  DOC: { bg: 'bg-blue-50', text: 'text-blue-600', icon: 'text-blue-500' },
  DOCX: { bg: 'bg-blue-50', text: 'text-blue-600', icon: 'text-blue-500' },
};

export function NamedDocumentUpload({
  documents,
  onAdd,
  onRemove,
  onNameChange,
  onFileChange,
}: NamedDocumentUploadProps) {
  const [previewUrls, setPreviewUrls] = useState<Map<number, string>>(new Map());
  const [previewDoc, setPreviewDoc] = useState<{ file: File; index: number } | null>(null);

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleFileChange = (index: number, file: File | null) => {
    const existingUrl = previewUrls.get(index);
    if (existingUrl) {
      URL.revokeObjectURL(existingUrl);
    }

    if (file && isImageFile(file)) {
      const url = URL.createObjectURL(file);
      setPreviewUrls((prev) => {
        const next = new Map(prev);
        next.set(index, url);
        return next;
      });
    } else {
      setPreviewUrls((prev) => {
        const next = new Map(prev);
        next.delete(index);
        return next;
      });
    }

    onFileChange(index, file);
  };

  const handleRemove = (index: number) => {
    const existingUrl = previewUrls.get(index);
    if (existingUrl) {
      URL.revokeObjectURL(existingUrl);
    }
    setPreviewUrls((prev) => {
      const next = new Map(prev);
      next.delete(index);
      return next;
    });
    onRemove(index);
  };

  const handlePreviewClick = (index: number) => {
    const doc = documents[index];
    if (doc.file) {
      setPreviewDoc({ file: doc.file, index });
    }
  };

  return (
    <div>
      <h4 className="mb-4 text-sm font-medium uppercase tracking-wide text-[#777]">
        Upload Documents
      </h4>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {documents.map((doc, index) => {
          const previewUrl = previewUrls.get(index);
          const isImage = doc.file && isImageFile(doc.file);
          const ext = doc.file ? getFileExtension(doc.file.name) : '';
          const extColor = EXTENSION_COLORS[ext] ?? { bg: 'bg-gray-50', text: 'text-gray-600', icon: 'text-gray-500' };

          return (
            <div
              key={index}
              className="flex items-start gap-3 rounded-xl border border-[#e5e5e5] bg-[#fafaf8] p-3"
            >
              {/* Preview thumbnail */}
              <button
                type="button"
                onClick={() => handlePreviewClick(index)}
                className="flex h-24 w-24 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-[#e5e5e5] bg-white transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#16610E]"
              >
                {isImage && previewUrl ? (
                  <img
                    src={previewUrl}
                    alt={doc.name || 'Document preview'}
                    className="h-full w-full object-cover"
                  />
                ) : doc.file ? (
                  <div className={`flex flex-col items-center gap-1 ${extColor.bg} h-full w-full justify-center`}>
                    {ext === 'PDF' ? (
                      <FileText className={`h-8 w-8 ${extColor.icon}`} />
                    ) : ext === 'DOC' || ext === 'DOCX' ? (
                      <FileText className={`h-8 w-8 ${extColor.icon}`} />
                    ) : (
                      <File className={`h-8 w-8 ${extColor.icon}`} />
                    )}
                    <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${extColor.bg} ${extColor.text}`}>
                      {ext || 'FILE'}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1 text-[#777]">
                    <Upload className="h-6 w-6" />
                    <span className="text-[10px]">No file</span>
                  </div>
                )}
              </button>

              {/* File info */}
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <input
                  type="text"
                  placeholder="Document name (e.g. PAN Card, Aadhaar)"
                  value={doc.name}
                  onChange={(e) => onNameChange(index, e.target.value)}
                  className="w-full rounded-lg border border-[#e5e5e5] bg-white px-3 py-2 text-sm outline-none focus:border-[#16610E]"
                />
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer rounded-lg border border-[#e5e5e5] bg-white px-3 py-1.5 text-xs text-[#6b7280] hover:bg-[#f3f4f6]">
                    <Upload className="mr-1 inline h-3.5 w-3.5" />
                    {doc.file ? 'Change' : 'Choose'}
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                      onChange={(e) =>
                        handleFileChange(index, e.target.files?.[0] ?? null)
                      }
                    />
                  </label>
                  {doc.file && (
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-[#151515]">{doc.file.name}</p>
                      <p className="text-[11px] text-[#777]">{formatFileSize(doc.file.size)}</p>
                    </div>
                  )}
                </div>
                {doc.file && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handlePreviewClick(index)}
                      className="rounded-lg border border-[#e5e5e5] bg-white px-3 py-1.5 text-xs font-medium text-[#16610E] hover:bg-[#f0fdf4]"
                    >
                      Preview
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemove(index)}
                      className="rounded-lg border border-[#e5e5e5] bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="mt-1 shrink-0 rounded-full p-1 transition-colors hover:bg-red-100"
              >
                <X className="h-4 w-4 text-[#777] hover:text-red-500" />
              </button>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onAdd}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#e5e5e5] py-3 text-sm font-medium text-[#6b7280] transition-colors hover:border-[#16610E] hover:text-[#16610E]"
      >
        <Plus className="h-4 w-4" />
        Add Document
      </button>

      <DocumentPreviewModal
        file={previewDoc?.file ?? null}
        isOpen={previewDoc !== null}
        onClose={() => setPreviewDoc(null)}
      />
    </div>
  );
}
