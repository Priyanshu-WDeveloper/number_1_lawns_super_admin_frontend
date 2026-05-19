import { MapPin, Crosshair } from 'lucide-react';

interface LocationModeToggleProps {
  value: 'map' | 'manual';
  onChange: (mode: 'map' | 'manual') => void;
}

export function LocationModeToggle({ value, onChange }: LocationModeToggleProps) {
  return (
    <div className="inline-flex flex-col gap-2">
      <div className="relative inline-flex rounded-xl border border-[#e5e5e5] bg-[#f0f0f0] p-1.5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]">
        <div
          className={`absolute inset-y-1.5 rounded-lg bg-[#16610E] shadow-md shadow-[#16610E]/20 transition-all duration-300 ease-out ${
            value === 'map'
              ? 'left-1.5 w-[calc(50%-6px)] translate-x-0'
              : 'left-[calc(50%)] w-[calc(50%-6px)] translate-x-0'
          }`}
        />

        <button
          type="button"
          onClick={() => onChange('map')}
          className={`relative z-10 flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-medium transition-colors duration-200 ${
            value === 'map'
              ? 'text-white'
              : 'text-[#777] hover:text-[#151515]'
          }`}
        >
          <MapPin className="h-4 w-4" />
          Map
        </button>

        <button
          type="button"
          onClick={() => onChange('manual')}
          className={`relative z-10 flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-medium transition-colors duration-200 ${
            value === 'manual'
              ? 'text-white'
              : 'text-[#777] hover:text-[#151515]'
          }`}
        >
          <Crosshair className="h-4 w-4" />
          Lat/Long
        </button>
      </div>

      <p className="text-xs text-[#777] ml-1.5">
        {value === 'map'
          ? 'Click on the map to set coordinates'
          : 'Enter latitude and longitude manually'}
      </p>
    </div>
  );
}
