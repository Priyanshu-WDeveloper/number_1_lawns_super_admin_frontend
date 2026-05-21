import { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Map,
  Hash,
  Globe,
} from 'lucide-react';

import { DetailRow } from './detail-row';
import { DocumentRow } from './document-row';
import { DocumentPreviewModal } from './document-preview-modal';
import type { NamedDoc } from './named-document-upload';

interface AdminReviewCardProps {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  profileImage?: string;
  documents?: NamedDoc[];
}

export function AdminReviewCard({
  firstName,
  lastName,
  email,
  countryCode,
  phoneNumber,
  address,
  city,
  state,
  postalCode,
  country,
  latitude,
  longitude,
  profileImage,
  documents = [],
}: AdminReviewCardProps) {
  const [previewFile, setPreviewFile] = useState<File | null>(null);

  const handlePreview = (doc: NamedDoc) => {
    if (doc.file) setPreviewFile(doc.file);
  };

  const hasDocuments = documents.some((d) => d.file);

  return (
    <div className="bg-[#efefed80] rounded-2xl p-20 px-40">
      {/* Employee Information Card */}
      <div className="bg-white rounded-2xl p-6 mb-4">
        <h4 className="text-sm font-medium uppercase tracking-wide text-[#777] mb-4">
          Employee Information
        </h4>

        {profileImage && (
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#e5e5e5]">
            <img
              src={profileImage}
              alt={`${firstName} ${lastName}`}
              className="h-12 w-12 rounded-full object-cover"
            />
            <span className="text-sm font-medium text-[#151515]">
              {firstName} {lastName}
            </span>
          </div>
        )}

        <div className="space-y-3">
          <DetailRow
            icon={<User className="h-4 w-4" />}
            label="First Name"
            value={firstName}
          />
          <DetailRow
            icon={<User className="h-4 w-4" />}
            label="Last Name"
            value={lastName}
          />
          <DetailRow
            icon={<Mail className="h-4 w-4" />}
            label="Email"
            value={email}
          />
          <DetailRow
            icon={<Phone className="h-4 w-4" />}
            label="Phone Number"
            value={`${countryCode} ${phoneNumber}`}
          />
          <DetailRow
            icon={<MapPin className="h-4 w-4" />}
            label="Address"
            value={address}
          />
          <DetailRow
            icon={<Building2 className="h-4 w-4" />}
            label="City"
            value={city}
          />
          <DetailRow
            icon={<Map className="h-4 w-4" />}
            label="State"
            value={state}
          />
          <DetailRow
            icon={<Hash className="h-4 w-4" />}
            label="Postal Code"
            value={postalCode}
          />
          <DetailRow
            icon={<Globe className="h-4 w-4" />}
            label="Country"
            value={country}
          />
          {latitude !== undefined && longitude !== undefined && (
            <>
              <DetailRow
                icon={<Map className="h-4 w-4" />}
                label="Latitude"
                value={String(latitude)}
              />
              <DetailRow
                icon={<Map className="h-4 w-4" />}
                label="Longitude"
                value={String(longitude)}
              />
            </>
          )}
        </div>
      </div>

      {/* Documents Card */}
      {hasDocuments && (
        <div className="bg-white rounded-2xl p-6">
          <h4 className="text-sm font-medium uppercase tracking-wide text-[#777] mb-4">
            Documents
          </h4>

          <div className="space-y-3">
            {documents
              .filter((d) => d.file)
              .map((doc, index) => (
                <DocumentRow
                  key={index}
                  doc={doc}
                  onPreview={handlePreview}
                />
              ))}
          </div>
        </div>
      )}

      <DocumentPreviewModal
        file={previewFile}
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
      />
    </div>
  );
}
