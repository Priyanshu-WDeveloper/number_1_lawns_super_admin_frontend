import { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

interface ImageWithFallbackProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'onError'> {
  fallback?: React.ReactNode;
}

export function ImageWithFallback({
  src,
  alt = '',
  className,
  fallback,
  ...props
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    if (fallback) return <>{fallback}</>;

    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-green-100 gap-0.5',
          className,
        )}
      >
        <ImageIcon className="text-green-300" size={20} />
        <span className="text-[10px] font-medium text-green-400 leading-tight">
          No image
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      {...props}
    />
  );
}
