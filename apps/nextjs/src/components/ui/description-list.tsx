import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DescriptionListProps {
  children: ReactNode;
  className?: string;
}

export function DescriptionList({ children, className }: DescriptionListProps) {
  return <dl className={cn("divide-y", className)}>{children}</dl>;
}

interface DescriptionTermProps {
  children: ReactNode;
  className?: string;
}

export function DescriptionTerm({ children, className }: DescriptionTermProps) {
  return (
    <dt
      className={cn("text-foreground text-sm leading-6 font-medium", className)}
    >
      {children}
    </dt>
  );
}

interface DescriptionDetailsProps {
  children: ReactNode;
  className?: string;
}

export function DescriptionDetails({
  children,
  className,
}: DescriptionDetailsProps) {
  return (
    <dd
      className={cn(
        "text-muted-foreground mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0",
        className,
      )}
    >
      {children}
    </dd>
  );
}

interface DescriptionItemProps {
  term: ReactNode;
  children: ReactNode;
  className?: string;
}

export function DescriptionItem({
  term,
  children,
  className,
}: DescriptionItemProps) {
  return (
    <div
      className={cn(
        "px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0",
        className,
      )}
    >
      <DescriptionTerm>{term}</DescriptionTerm>
      <DescriptionDetails>{children}</DescriptionDetails>
    </div>
  );
}

// Compound component approach
export const DL = Object.assign(DescriptionList, {
  Item: DescriptionItem,
  Term: DescriptionTerm,
  Details: DescriptionDetails,
});
