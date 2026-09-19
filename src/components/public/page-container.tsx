import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  size?: "default" | "narrow" | "wide";
}

export function PageContainer({
  children,
  className,
  size = "default",
}: PageContainerProps) {
  const sizeClasses = {
    narrow: "max-w-4xl",
    default: "max-w-7xl",
    wide: "max-w-(--breakpoint-2xl)",
  };

  return (
    <div
      className={cn(
        "container mx-auto px-4 md:px-8",
        sizeClasses[size],
        className
      )}
    >
      {children}
    </div>
  );
}
