"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { IconDotsVertical } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "./column-header";

// Helper function to create a selection column
export function createSelectColumn<T>(): ColumnDef<T> {
  return {
    id: "select",
    header: ({ table }) => (
      <label
        className="flex h-full w-full items-center justify-center cursor-pointer"
        onClick={(e) => e.stopPropagation()}
      >
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      </label>
    ),
    cell: ({ row }) => (
      <label
        className="flex h-full w-full items-center justify-center cursor-pointer py-2"
        onClick={(e) => e.stopPropagation()}
      >
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      </label>
    ),
    enableSorting: false,
    enableHiding: false,
  };
}

// Helper function to create an actions column
interface ActionItem<T> {
  label: string;
  onClick: (row: T) => void;
  variant?: "default" | "destructive";
}

export function createActionsColumn<T>(
  actions: ActionItem<T>[]
): ColumnDef<T> {
  return {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const data = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="sr-only">Open menu</span>
              <IconDotsVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {actions.map((action, index) => (
              <DropdownMenuItem
                key={index}
                onClick={() => action.onClick(data)}
                className={
                  action.variant === "destructive"
                    ? "text-destructive focus:text-destructive"
                    : undefined
                }
              >
                {action.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  };
}

// Helper function to create a text column with sorting
export function createTextColumn<T>(
  accessorKey: keyof T,
  title: string,
  options?: {
    enableSorting?: boolean;
    enableHiding?: boolean;
  }
): ColumnDef<T> {
  return {
    accessorKey: accessorKey as string,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={title} />
    ),
    enableSorting: options?.enableSorting ?? true,
    enableHiding: options?.enableHiding ?? true,
  };
}

// Helper function to create a date column
export function createDateColumn<T>(
  accessorKey: keyof T,
  title: string,
  dateFormat: string = "PPP"
): ColumnDef<T> {
  return {
    accessorKey: accessorKey as string,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={title} />
    ),
    cell: ({ row }) => {
      const date = row.getValue(accessorKey as string) as Date;
      return date ? format(date, dateFormat) : "-";
    },
  };
}

// Helper function to create a custom cell column
export function createCustomColumn<T>(
  id: string,
  title: string,
  cell: (row: T) => React.ReactNode
): ColumnDef<T> {
  return {
    id,
    header: title,
    cell: ({ row }) => cell(row.original),
  };
}