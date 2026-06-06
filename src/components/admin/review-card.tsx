import { useState, type ReactNode } from 'react';
import { DocumentRow } from './document-row';
import { DocumentPreviewModal } from './document-preview-modal';
import { ReviewField } from './review-field';
import type { NamedDoc } from './named-document-upload';

interface ReviewFieldDef {
  icon: ReactNode;
  label: string;
  value: string | number;
  imageUrl?: string;
}

interface ReviewSection {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  image?: { src: string; alt: string };
  fields?: ReviewFieldDef[];
  documents?: NamedDoc[];
}

interface ReviewCardProps {
  sections: ReviewSection[];
}

export function ReviewCard({ sections }: ReviewCardProps) {
  const [previewFile, setPreviewFile] = useState<File | null>(null);

  const handlePreview = (doc: NamedDoc) => {
    if (doc.file) setPreviewFile(doc.file);
  };

  return (
    <div className="space-y-5">
      {sections.map((section, idx) => {
        const hasDocs =
          section.documents && section.documents.some((d) => d.file);

        return (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e7eb]">
              <div className="flex items-center gap-3.5">
                {(section.image && (
                  <img
                    src={section.image.src}
                    alt={section.image.alt}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                )) || (
                  <div className="w-[42px] h-[42px] rounded-xl bg-[#2d6a4f] flex items-center justify-center shrink-0">
                    {section.icon}
                  </div>
                )}
                <div>
                  <div className="text-sm font-semibold text-[#111827]">
                    {section.title}
                  </div>
                  {section.subtitle && (
                    <div className="text-xs text-[#6b7280] mt-0.5">
                      {section.subtitle}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {section.fields && section.fields.length > 0 && (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {section.fields.map((field, fi) => (
                    <ReviewField
                      key={fi}
                      icon={field.icon}
                      label={field.label}
                      value={field.value}
                      imageUrl={field.imageUrl}
                    />
                  ))}
                </div>
              </div>
            )}
            {hasDocs && (
              <div className="px-6 pb-6 space-y-3">
                {section
                  .documents!.filter((d) => d.file)
                  .map((doc, di) => (
                    <DocumentRow
                      key={di}
                      doc={doc}
                      onPreview={handlePreview}
                    />
                  ))}
              </div>
            )}
          </div>
        );
      })}
      <DocumentPreviewModal
        file={previewFile}
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
      />
    </div>
  );
}
