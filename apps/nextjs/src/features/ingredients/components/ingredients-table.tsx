"use client";

import type { ColumnDef } from "@/components/ui/data-table";
import type { Ingredient } from "@/features/ingredients/api/use-ingredients";
import { useRouter } from "next/navigation";
import {
  createActionsColumn,
  createCustomColumn,
  createSelectColumn,
  createTextColumn,
  DataTable,
} from "@/components/ui/data-table";
import { Progress } from "@/components/ui/progress";
import { paths } from "@/config/paths";
import {
  useDeleteIngredient,
  useGetIngredients,
} from "@/features/ingredients/api/use-ingredients";

export function IngredientsTable() {
  const router = useRouter();
  const { data: ingredients } = useGetIngredients();
  const deleteMutation = useDeleteIngredient();
  // Define columns
  const columns: ColumnDef<Ingredient>[] = [
    createSelectColumn<Ingredient>(),
    createTextColumn<Ingredient>("name", "Name", { enableSorting: true }),
    createCustomColumn<Ingredient>(
      "nutrition",
      "Nutrition (per 100g)",
      (ingredient) => (
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-16 text-muted-foreground">Calories:</span>
            <span className="font-medium">{ingredient.kcal ?? "-"} kcal</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-16 text-muted-foreground">Protein:</span>
            <span>{ingredient.eiwit ?? "-"}g</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-16 text-muted-foreground">Carbs:</span>
            <span>{ingredient.koolhydraten ?? "-"}g</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-16 text-muted-foreground">Fat:</span>
            <span>{ingredient.vet ?? "-"}g</span>
          </div>
        </div>
      ),
    ),
    createCustomColumn<Ingredient>("scores", "Scores", (ingredient) => (
      <div className="w-32 space-y-2">
        {ingredient.gevoel !== null && (
          <div>
            <div className="mb-1 flex justify-between text-xs">
              <span>Feeling</span>
              <span>{ingredient.gevoel}/10</span>
            </div>
            <Progress value={ingredient.gevoel * 10} className="h-2" />
          </div>
        )}
        {ingredient.gezondheid !== null && (
          <div>
            <div className="mb-1 flex justify-between text-xs">
              <span>Health</span>
              <span>{ingredient.gezondheid}/10</span>
            </div>
            <Progress value={ingredient.gezondheid * 10} className="h-2" />
          </div>
        )}
      </div>
    )),
    createActionsColumn<Ingredient>([
      {
        label: "Edit",
        onClick: (ingredient) =>
          router.push(paths.app.ingredients.edit.getHref(ingredient.id)),
      },
      {
        label: "View Details",
        onClick: (ingredient) =>
          router.push(paths.app.ingredients.detail.getHref(ingredient.id)),
      },
      {
        label: "Delete",
        variant: "destructive",
        onClick: (ingredient) => {
          if (
            confirm(`Are you sure you want to delete "${ingredient.name}"?`)
          ) {
            deleteMutation.mutate(ingredient.id);
          }
        },
      },
    ]),
  ];

  return (
    <DataTable
      columns={columns}
      data={ingredients}
      searchKey="name"
      defaultPageSize={20}
      onRowClick={(row) =>
        router.push(paths.app.ingredients.detail.getHref(row.original.id))
      }
    />
  );
}
