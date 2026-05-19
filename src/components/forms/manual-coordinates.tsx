import { Input } from '@/components/ui/input';
import { Hash } from 'lucide-react';

interface ManualCoordinatesProps {
  latitude: number;
  longitude: number;
  onChange: (lat: number, lng: number) => void;
}

export function ManualCoordinates({ latitude, longitude, onChange }: ManualCoordinatesProps) {
  const latValid = !latitude || (latitude >= -90 && latitude <= 90);
  const lngValid = !longitude || (longitude >= -180 && longitude <= 180);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#151515]">
            Latitude
            <span className="text-[#16610E]"> *</span>
          </label>
          <Input
            type="number"
            step="any"
            placeholder="e.g., 28.6139"
            value={latitude || ''}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              onChange(isNaN(val) ? 0 : val, longitude);
            }}
            className={`h-12 rounded-xl border bg-[#fafaf8] ${
              !latValid ? 'border-red-300 bg-red-50' : 'border-[#e5e5e5]'
            }`}
          />
          {!latValid && (
            <p className="text-xs text-red-500">Must be between -90 and 90</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[#151515]">
            Longitude
            <span className="text-[#16610E]"> *</span>
          </label>
          <Input
            type="number"
            step="any"
            placeholder="e.g., 77.2090"
            value={longitude || ''}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              onChange(latitude, isNaN(val) ? 0 : val);
            }}
            className={`h-12 rounded-xl border bg-[#fafaf8] ${
              !lngValid ? 'border-red-300 bg-red-50' : 'border-[#e5e5e5]'
            }`}
          />
          {!lngValid && (
            <p className="text-xs text-red-500">Must be between -180 and 180</p>
          )}
        </div>
      </div>

      <p className="text-xs text-[#777] flex items-center gap-1">
        <Hash className="h-3 w-3" />
        Enter coordinates directly. Address fields below can be filled manually.
      </p>
    </div>
  );
}
