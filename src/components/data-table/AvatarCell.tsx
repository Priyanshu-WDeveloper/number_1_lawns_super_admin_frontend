interface AvatarCellProps {
  name: string;
  email?: string;
  size?: 'sm' | 'md';
  fallbackChar?: string;
}

export function AvatarCell({
  name,
  email,
  size = 'sm',
  fallbackChar = '?',
}: AvatarCellProps) {
  const initial = name ? name.charAt(0).toUpperCase() : fallbackChar;
  const hue = name ? (name.charCodeAt(0) * 137.5) % 360 : 0;
  const bgColor = `hsl(${hue}, 60%, 90%)`;
  const textColor = `hsl(${hue}, 60%, 35%)`;
  const sizeClasses = size === 'sm' ? 'h-7 w-7 text-xs' : 'h-9 w-9 text-sm';

  return (
    <div className="flex items-center gap-3">
      <div
        className={`${sizeClasses} flex items-center justify-center rounded-full font-semibold`}
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        {initial}
      </div>
      <div>
        <span className="font-medium text-[#151515]">{name || '-'}</span>
        {email && <p className="text-xs text-[#6b7280]">{email}</p>}
      </div>
    </div>
  );
}
