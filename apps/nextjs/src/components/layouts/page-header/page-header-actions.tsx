"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export interface PageHeaderActionProps {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link";
  asChild?: boolean;
  children?: React.ReactNode;
}

export function PageHeaderAction({
  label,
  icon,
  onClick,
  href,
  variant = "outline",
  asChild,
  children,
}: PageHeaderActionProps) {
  const content = (
    <>
      {icon}
      {label}
    </>
  );

  if (asChild && children) {
    const childElement = React.Children.only(children) as React.ReactElement;
    return (
      <Button variant={variant} asChild>
        {React.cloneElement(childElement, {
          children: content
        })}
      </Button>
    );
  }

  if (href) {
    return (
      <Button variant={variant} asChild>
        <a href={href}>{content}</a>
      </Button>
    );
  }

  return (
    <Button variant={variant} onClick={onClick}>
      {content}
    </Button>
  );
}

export interface PageHeaderActionsProps {
  children: React.ReactNode;
  className?: string;
  mobileDropdownLabel?: string;
}

export function PageHeaderActions({ 
  children, 
  className,
  mobileDropdownLabel = "More",
}: PageHeaderActionsProps) {
  const childrenArray = React.Children.toArray(children);
  
  // Desktop: show all actions
  const desktopActions = childrenArray.map((child, index) => (
    <span key={index} className={cn(index > 0 && "ml-3", "hidden sm:block")}>
      {child}
    </span>
  ));

  // Mobile: show primary action + dropdown for rest
  const primaryAction = childrenArray[0];
  const secondaryActions = childrenArray.slice(1);

  return (
    <div className={cn("mt-5 flex lg:mt-0 lg:ml-4", className)}>
      {desktopActions}
      
      {/* Mobile primary action */}
      {primaryAction && (
        <span className="sm:hidden">
          {primaryAction}
        </span>
      )}

      {/* Mobile dropdown for secondary actions */}
      {secondaryActions.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-3 sm:hidden">
              {mobileDropdownLabel}
              <ChevronDown className="-mr-1 ml-1.5 size-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {secondaryActions.map((action, index) => {
              // Extract props from the action element if it's a PageHeaderAction
              const actionElement = action as React.ReactElement<PageHeaderActionProps>;
              if (actionElement && actionElement.props) {
                const { label, onClick, href } = actionElement.props;
                return (
                  <DropdownMenuItem
                    key={index}
                    onClick={onClick}
                    asChild={!!href}
                  >
                    {href ? <a href={href}>{label}</a> : <span>{label}</span>}
                  </DropdownMenuItem>
                );
              }
              return null;
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}