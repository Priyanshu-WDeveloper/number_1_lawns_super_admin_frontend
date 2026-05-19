import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { COUNTRY_CODES } from '@/lib/country-codes';
import { Input } from '@/components/ui/input';
import 'flag-icons/css/flag-icons.min.css';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  countryCode: string;
  onCountryCodeChange: (code: string) => void;
  error?: string;
  placeholder?: string;
}

export function PhoneInput({
  value,
  onChange,
  countryCode,
  onCountryCodeChange,
  error,
  placeholder = 'Enter phone number',
}: PhoneInputProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');
  const ref = useRef<HTMLDivElement>(null);

  const selected =
    COUNTRY_CODES.find((c) => c.code === countryCode) ??
    COUNTRY_CODES.find((c) => c.code === '+1')!;

  const filtered = search
    ? COUNTRY_CODES.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.code.includes(search) ||
          c.isoCode.toLowerCase().includes(search.toLowerCase()) ||
          c.flag.includes(search),
      )
    : COUNTRY_CODES;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (!open || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const dropdownHeight = 320;
    setDropdownPosition(spaceBelow >= dropdownHeight ? 'bottom' : 'top');
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <div className="flex h-12 items-center rounded-xl border border-[#e5e5e5] bg-[#fafaf8] px-3 transition-colors focus-within:border-[#16610E] focus-within:ring-1 focus-within:ring-[#16610E]/20">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 shrink-0 pr-3"
        >
          <span className="relative inline-flex items-center justify-center w-6 h-4 rounded-sm overflow-hidden shrink-0 bg-[#f0f0f0]">
            <span className={`fi fi-${selected.isoCode.toLowerCase()} absolute inset-0`} />
          </span>
          <span className="text-sm font-medium text-[#151515] ml-1.5">
            {selected.code}
          </span>
          <ChevronDown className="h-4 w-4 text-[#9ca3af]" />
        </button>

        <div className="h-6 w-px bg-[#e5e5e5]" />

        <input
          type="tel"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, ''))}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-[#151515] outline-none placeholder:text-muted-foreground ml-3"
        />
      </div>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}

      {open && (
        <div className={`absolute left-0 z-50 w-72 rounded-xl border border-[#e5e5e5] bg-white shadow-xl max-h-80 overflow-hidden ${
          dropdownPosition === 'bottom' ? 'top-full mt-1' : 'bottom-full mb-1'
        }`}>
          <div className="p-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search country..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-10 rounded-lg border border-[#e5e5e5] bg-[#fafaf8] focus:border-[#e5e5e5] focus:ring-0 focus:bg-white"
                autoFocus
              />
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {filtered.map((country) => (
              <button
                key={country.isoCode + country.code}
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition"
                onClick={() => {
                  onCountryCodeChange(country.code);
                  setOpen(false);
                  setSearch('');
                }}
              >
                <span className="relative inline-flex items-center justify-center w-6 h-4 rounded-sm overflow-hidden shrink-0 bg-[#f0f0f0]">
                  <span className={`fi fi-${country.isoCode.toLowerCase()} absolute inset-0`} />
                </span>
                <span className="flex-1 text-left">{country.name}</span>
                <span className="text-muted-foreground text-xs">
                  {country.code}
                </span>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="px-3 py-4 text-sm text-muted-foreground text-center">
                No results
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
