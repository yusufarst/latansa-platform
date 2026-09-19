import { cn } from "@/lib/utils";

interface ProductImagePlaceholderProps {
  className?: string;
  label?: string;
  iconSize?: "sm" | "md" | "lg";
}

export function ProductImagePlaceholder({
  className,
  label = "LATANSA",
  iconSize = "md",
}: ProductImagePlaceholderProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center w-full h-full bg-stone-100/80 dark:bg-stone-900/60 rounded-md select-none p-4",
        className
      )}
      aria-hidden="true"
    >
      <div className="relative flex items-center justify-center p-3 rounded-full bg-stone-200/60 dark:bg-stone-800/80 text-stone-400 dark:text-stone-500 mb-2">
        <svg
          className={cn(sizeClasses[iconSize], "text-brand/50 stroke-current")}
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      </div>
      {label && (
        <span className="text-[11px] font-medium tracking-wider text-stone-400 dark:text-stone-500 uppercase">
          {label}
        </span>
      )}
    </div>
  );
}
