import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DetailHeaderProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
}

export function DetailHeader({
  title,
  subtitle,
  children,
  className,
}: DetailHeaderProps) {
  return (
    <div className={cn("px-4 sm:px-0", className)}>
      <h3 className="text-foreground text-base leading-7 font-semibold">
        {title}
      </h3>
      {subtitle && (
        <p className="text-muted-foreground mt-1 max-w-2xl text-sm leading-6">
          {subtitle}
        </p>
      )}
      {children}
    </div>
  );
}
