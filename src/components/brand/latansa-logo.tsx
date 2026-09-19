import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LatansaLogoProps {
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function LatansaLogo({ className, width = 120, height = 40, priority = true }: LatansaLogoProps) {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <Image
        src="/brand/latansa-logo-original.jpeg"
        alt="LATANSA Platform Logo"
        width={width}
        height={height}
        className="object-contain"
        priority={priority}
      />
    </div>
  );
}
