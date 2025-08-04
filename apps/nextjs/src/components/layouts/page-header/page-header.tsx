import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  meta?: React.ReactNode;
  actions?: React.ReactNode;
  backButton?: {
    href: string;
    label?: string;
  };
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  meta,
  actions,
  backButton,
  className,
}: PageHeaderProps) {
  const content = (
    <>
      <div className="min-w-0 flex-1">
        <h2 className="text-2xl/7 font-bold text-foreground sm:truncate sm:text-3xl sm:tracking-tight">
          {title}
        </h2>
        {(subtitle || meta) && (
          <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
            {meta}
          </div>
        )}
      </div>
      {actions && (
        <div className="mt-5 flex lg:mt-0 lg:ml-4">
          {actions}
        </div>
      )}
    </>
  );

  if (backButton) {
    return (
      <div className={cn("flex items-center gap-4", className)}>
        <Button variant="ghost" size="icon" asChild>
          <Link href={backButton.href}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">{backButton.label || "Go back"}</span>
          </Link>
        </Button>
        <div className="flex-1 lg:flex lg:items-center lg:justify-between">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("lg:flex lg:items-center lg:justify-between", className)}>
      {content}
    </div>
  );
}