import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

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
    <div className={cn("mt-2 flex items-center text-sm text-muted-foreground", className)}>
      <Icon className="mr-1.5 size-5 shrink-0 text-muted-foreground/70" />
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
    <div className={cn("mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6", className)}>
      {children}
    </div>
  );
}