interface StatusConfig {
  color: string;
  label: string;
}

interface StatusBadgeProps {
  status: string;
  config: Record<string, StatusConfig>;
  fallback?: StatusConfig;
}

export function StatusBadge({
  status,
  config,
  fallback = { color: '#6b7280', label: 'Unknown' },
}: StatusBadgeProps) {
  const cfg = config[status] || fallback;

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium">
      <span
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: cfg.color }}
      />
      <span style={{ color: cfg.color }}>{cfg.label}</span>
    </span>
  );
}
