import { Check } from 'lucide-react';

interface AdminReviewCardProps {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  address: string;
}

export function AdminReviewCard({
  firstName,
  lastName,
  email,
  countryCode,
  phoneNumber,
  address,
}: AdminReviewCardProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-dashed border-[#e5e5e5] bg-[#fafaf8] p-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#edf8e7]">
            <Check className="h-6 w-6 text-[#16610E]" />
          </div>
          <h5 className="mb-2 text-lg font-semibold text-[#151515]">
            Review Admin Information
          </h5>
          <div className="mt-6 space-y-2 rounded-lg bg-white p-4 text-left text-sm">
            <p>
              <span className="text-[#777]">Name:</span>{' '}
              <span className="font-medium">
                {firstName} {lastName}
              </span>
            </p>
            <p>
              <span className="text-[#777]">Email:</span>{' '}
              <span className="font-medium">{email}</span>
            </p>
            <p>
              <span className="text-[#777]">Phone:</span>{' '}
              <span className="font-medium">
                {countryCode} {phoneNumber}
              </span>
            </p>
            <p>
              <span className="text-[#777]">Address:</span>{' '}
              <span className="font-medium">{address}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
