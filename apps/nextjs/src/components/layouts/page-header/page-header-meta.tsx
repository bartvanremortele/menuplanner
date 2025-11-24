import type { LucideIcon } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

export interface PageHeaderMetaItemProps {
  icon: LucideIcon;
  label: string;
  className?: string;
}

export function PageHeaderMetaItem({
  icon: Icon,
  label,
  className,
}: PageHeaderMetaItemProps) {
  return (
    <div
      className={cn(
        "text-muted-foreground mt-2 flex items-center text-sm",
        className,
      )}
    >
      <Icon className="text-muted-foreground/70 mr-1.5 size-5 shrink-0" />
      {label}
    </div>
  );
}

export interface PageHeaderMetaProps {
  children: React.ReactNode;
  className?: string;
}

export function PageHeaderMeta({ children, className }: PageHeaderMetaProps) {
  return (
    <div
      className={cn(
        "mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6",
        className,
      )}
    >
      {children}
    </div>
  );
}
