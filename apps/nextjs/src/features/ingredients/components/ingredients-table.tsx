"use client";

import { useRouter } from "next/navigation";
import {
  DataTable,
  createSelectColumn,
  createTextColumn,
  createCustomColumn,
  createActionsColumn,
  type ColumnDef,
} from "@/components/ui/data-table";
import { Progress } from "@/components/ui/progress";
import { useGetIngredients, useDeleteIngredient, type Ingredient } from "@/features/ingredients/api/use-ingredients";
import { paths } from "@/config/paths";

export function IngredientsTable() {
  const router = useRouter();
  const { data: ingredients } = useGetIngredients();
  const deleteMutation = useDeleteIngredient();
  // Define columns
  const columns: ColumnDef<Ingredient>[] = [
    createSelectColumn<Ingredient>(),
    createTextColumn<Ingredient>("name", "Name", { enableSorting: true }),
    createCustomColumn<Ingredient>("nutrition", "Nutrition (per 100g)", (ingredient) => (
      <div className="space-y-1 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground w-16">Calories:</span>
          <span className="font-medium">{ingredient.kcal || "-"} kcal</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground w-16">Protein:</span>
          <span>{ingredient.eiwit || "-"}g</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground w-16">Carbs:</span>
          <span>{ingredient.koolhydraten || "-"}g</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground w-16">Fat:</span>
          <span>{ingredient.vet || "-"}g</span>
        </div>
      </div>
    )),
    createCustomColumn<Ingredient>("scores", "Scores", (ingredient) => (
      <div className="space-y-2 w-32">
        {ingredient.gevoel !== null && (
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Feeling</span>
              <span>{ingredient.gevoel}/10</span>
            </div>
            <Progress value={ingredient.gevoel * 10} className="h-2" />
          </div>
        )}
        {ingredient.gezondheid !== null && (
          <div>
            <div className="flex justify-between text-xs mb-1">
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
        onClick: (ingredient) => router.push(paths.app.ingredients.edit.getHref(ingredient.id)),
      },
      {
        label: "View Details",
        onClick: (ingredient) => router.push(paths.app.ingredients.detail.getHref(ingredient.id)),
      },
      {
        label: "Delete",
        variant: "destructive",
        onClick: (ingredient) => {
          if (confirm(`Are you sure you want to delete "${ingredient.name}"?`)) {
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
      onRowClick={(row) => router.push(paths.app.ingredients.detail.getHref(row.original.id))}
    />
  );
}