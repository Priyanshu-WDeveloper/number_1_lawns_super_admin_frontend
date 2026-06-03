import { useState, useRef } from 'react';
import { Upload, Loader2, Link as LinkIcon } from 'lucide-react';
import toast from 'react-hot-toast';

import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useUploadDocumentMutation } from '@/API/api';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { getErrorMessage } from '@/lib/get-error-message';

interface ImageUploadFieldProps {
  value?: string;
  onChange: (url: string) => void;
  error?: string;
  required?: boolean;
  label?: string;
}

export function ImageUploadField({
  value,
  onChange,
  error,
  required,
  label = 'Image',
}: ImageUploadFieldProps) {
  const [upload, { isLoading }] = useUploadDocumentMutation();
  const [preview, setPreview] = useState<string | null>(
    value || null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);

    try {
      const fd = new FormData();
      fd.append('file', file);
      const res: any = await upload(fd).unwrap();
      const url =
        res?.url ||
        res?.data?.url ||
        (typeof res === 'string' ? res : '');
      if (url) {
        onChange(url);
        toast.success('Image uploaded successfully');
      } else {
        toast.error('Upload succeeded but no URL returned');
      }
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to upload image'));
      setPreview(value || null);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUrlChange = (url: string) => {
    onChange(url);
    if (!url) setPreview(null);
  };

  const previewSrc = value || preview || '';

  return (
    <div className="space-y-3">
      {previewSrc && (
        <div className="overflow-hidden rounded-lg border border-border">
          <ImageWithFallback
            src={previewSrc}
            alt=""
            className="max-h-48 w-full object-contain"
          />
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-primary"> *</span>}
        </label>
        <Tabs defaultValue="url" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="url" className="flex-1 gap-2">
              <LinkIcon className="h-4 w-4" />
              URL
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex-1 gap-2">
              <Upload className="h-4 w-4" />
              Upload
            </TabsTrigger>
          </TabsList>
          <TabsContent value="url">
            <Input
              placeholder="https://example.com/image.jpg"
              value={value || ''}
              onChange={(e) => handleUrlChange(e.target.value)}
              className="h-12 rounded-xl border-border bg-background"
            />
          </TabsContent>
          <TabsContent value="upload">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-border bg-background px-4 py-8 text-sm text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="h-8 w-8" />
                  <span>Click to select an image file</span>
                </>
              )}
            </button>
          </TabsContent>
        </Tabs>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
}
