import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon = <Search className="w-10 h-10 text-stone-400 stroke-[1.5]" />,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "py-16 px-6 text-center border border-border/80 rounded-lg bg-card shadow-xs flex flex-col items-center justify-center max-w-lg mx-auto",
        className
      )}
    >
      <div className="w-14 h-14 rounded-full bg-stone-100 dark:bg-stone-800/80 flex items-center justify-center mb-4 text-muted-foreground">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-foreground tracking-tight mb-1.5">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-6 leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
