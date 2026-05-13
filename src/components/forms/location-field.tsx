'use client';

import { MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface LocationFieldProps {
  label: string;
  value?: { latitude?: string; longitude?: string };
  onChange?: (value: { latitude: string; longitude: string }) => void;
  required?: boolean;
}

export function LocationField({
  label,
  value,
  onChange,
  required,
}: LocationFieldProps) {
  const handleLatitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.({
      latitude: e.target.value,
      longitude: value?.longitude || '',
    });
  };

  const handleLongitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.({
      latitude: value?.latitude || '',
      longitude: e.target.value,
    });
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium flex items-center gap-2">
        <MapPin className="h-4 w-4 text-primary" />
        {label}
        {required && <span className="text-primary">*</span>}
      </label>
      <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
        <div className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Latitude</span>
          <Input
            placeholder="e.g., 40.7128"
            value={value?.latitude || ''}
            onChange={handleLatitudeChange}
          />
        </div>
        <div className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Longitude</span>
          <Input
            placeholder="e.g., -74.0060"
            value={value?.longitude || ''}
            onChange={handleLongitudeChange}
          />
        </div>
      </div>
    </div>
  );
}