import * as React from 'react';
import { Button } from '@/components/ui/button';

/* -------------------------- */
/* Reusable Action Button */
/* -------------------------- */
interface ActionButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
  variant?: 'outline' | 'default';
  className?: string;
}

export function ActionButton({
  icon,
  onClick,
  variant = 'outline',
  className = '',
}: ActionButtonProps) {
  return (
    <Button
      variant={variant}
      size="sm"
      className={`gap-2 rounded-xl ${className}`}
      onClick={onClick}
    >
      {icon}
    </Button>
  );
}

/* -------------------------- */
/* Reusable Pagination Button */
/* -------------------------- */
interface PaginationButtonProps {
  label?: string;
  icon?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

export function PaginationButton({
  label,
  icon,
  active,
  onClick,
}: PaginationButtonProps) {
  return (
    <Button
      variant={active ? 'default' : 'outline'}
      size="icon"
      className={`h-9 w-9 rounded-lg ${active ? '' : 'bg-white'}`}
      onClick={onClick}
    >
      {icon || label}
    </Button>
  );
}
