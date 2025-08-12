"use client";

import type { ColumnDef } from "@/components/ui/data-table";
import type { Recipe } from "@/features/recipes/api/use-recipes";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  createActionsColumn,
  createCustomColumn,
  createDateColumn,
  createSelectColumn,
  createTextColumn,
  DataTable,
} from "@/components/ui/data-table";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { paths } from "@/config/paths";
import {
  useDeleteRecipe,
  useGetRecipes,
} from "@/features/recipes/api/use-recipes";

export function RecipeTable() {
  const router = useRouter();
  const { data: recipes } = useGetRecipes();
  const deleteMutation = useDeleteRecipe();
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    recipe: Recipe | null;
  }>({ open: false, recipe: null });

  const handleDelete = () => {
    if (deleteDialog.recipe) {
      deleteMutation.mutate(deleteDialog.recipe.id, {
        onSuccess: () => {
          setDeleteDialog({ open: false, recipe: null });
        },
      });
    }
  };

  // Define columns
  const columns: ColumnDef<Recipe>[] = [
    createSelectColumn<Recipe>(),
    createTextColumn<Recipe>("name", "Name", { enableSorting: true }),
    createCustomColumn<Recipe>("labels", "Labels", (recipe) => (
      <div className="flex gap-1">
        {recipe.labels.length > 0 ? (
          recipe.labels.map((connection) => (
            <Badge key={connection.label.id} variant="secondary">
              {connection.label.name}
            </Badge>
          ))
        ) : (
          <span className="text-muted-foreground">No labels</span>
        )}
      </div>
    )),
    createDateColumn<Recipe>("createdAt", "Created", "PP"),
    createActionsColumn<Recipe>([
      {
        label: "Edit",
        onClick: (recipe) =>
          router.push(paths.app.recipes.edit.getHref(recipe.id)),
      },
      {
        label: "Delete",
        variant: "destructive",
        onClick: (recipe) => {
          setDeleteDialog({ open: true, recipe });
        },
      },
    ]),
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={recipes}
        searchKey="name"
        onRowClick={(row) =>
          router.push(paths.app.recipes.detail.getHref(row.original.id))
        }
      />

      <DeleteDialog
        open={deleteDialog.open}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteDialog({ open: false, recipe: null });
          }
        }}
        onConfirm={handleDelete}
        itemName={deleteDialog.recipe?.name}
        isDeleting={deleteMutation.isPending}
      />
    </>
  );
}
