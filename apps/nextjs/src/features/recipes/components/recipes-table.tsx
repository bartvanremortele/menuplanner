"use client";

import { useRouter } from "next/navigation";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import {
  DataTable,
  createSelectColumn,
  createTextColumn,
  createDateColumn,
  createActionsColumn,
  createCustomColumn,
  type ColumnDef,
} from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { useGetRecipes, useDeleteRecipe, type Recipe } from "@/features/recipes/api/use-recipes";
import { paths } from "@/config/paths";

export function RecipesTable() {
  const router = useRouter();
  const { data: recipes } = useGetRecipes();
  const deleteMutation = useDeleteRecipe();

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
        onClick: (recipe) => router.push(paths.app.recipes.edit.getHref(recipe.id)),
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
      onRowClick={(row) => router.push(paths.app.recipes.detail.getHref(row.original.id))}
    />
  );
}