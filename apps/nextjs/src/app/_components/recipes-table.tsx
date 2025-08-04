"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useQueryClient, useSuspenseQuery, useMutation } from "@tanstack/react-query";

import { useTRPC } from "~/trpc/react";
import type { RouterOutputs } from "@menuplanner/api";
import {
  DataTable,
  createSelectColumn,
  createTextColumn,
  createDateColumn,
  createActionsColumn,
  createCustomColumn,
  type ColumnDef,
} from "~/app/_components/ui/data-table";
import { Badge } from "~/app/_components/ui/badge";

// Use the type from the API output
type Recipe = RouterOutputs["recipe"]["all"][number];

export function RecipesTable() {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  
  // Fetch recipes data using the same pattern as existing code
  const { data: recipes } = useSuspenseQuery(trpc.recipe.all.queryOptions());
  
  // Delete mutation
  const deleteMutation = useMutation(
    trpc.recipe.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["recipe"] });
        toast.success("Recipe deleted successfully");
      },
      onError: (error) => {
        toast.error(`Failed to delete recipe: ${error.message}`);
      },
    })
  );

  // Define columns
  const columns: ColumnDef<Recipe>[] = [
    createSelectColumn<Recipe>(),
    createTextColumn<Recipe>("name", "Name", { enableSorting: true }),
    createCustomColumn<Recipe>("labels", "Labels", (recipe) => (
      <div className="flex gap-1">
        {recipe.labels?.map((label) => (
          <Badge key={label.id} variant="secondary">
            {label.name}
          </Badge>
        )) ?? <span className="text-muted-foreground">No labels</span>}
      </div>
    )),
    createDateColumn<Recipe>("createdAt", "Created", "PP"),
    createActionsColumn<Recipe>([
      {
        label: "Edit",
        onClick: (recipe) => router.push(`/recipes/${recipe.id}/edit`),
      },
      {
        label: "Delete",
        variant: "destructive",
        onClick: (recipe) => {
          if (confirm(`Are you sure you want to delete "${recipe.name}"?`)) {
            deleteMutation.mutate(recipe.id);
          }
        },
      },
    ]),
  ];

  return (
    <DataTable
      columns={columns}
      data={recipes}
      searchKey="name"
      onRowClick={(row) => router.push(`/recipes/${row.original.id}`)}
    />
  );
}