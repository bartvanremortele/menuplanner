"use client";

import {
  DataTable,
  createSelectColumn,
  createTextColumn,
  createCustomColumn,
  createActionsColumn,
  type ColumnDef,
} from "~/app/_components/ui/data-table";
import { Progress } from "~/app/_components/ui/progress";

// Define the Ingredient type based on your schema
type Ingredient = {
  id: number;
  name: string;
  url: string | null;
  kj: number | null;
  kcal: number | null;
  water: number | null;
  eiwit: number | null;
  koolhydraten: number | null;
  suikers: number | null;
  vet: number | null;
  verzadigdVet: number | null;
  enkelvoudigOnverzadigdVet: number | null;
  meervoudigOnverzadigdVet: number | null;
  cholesterol: number | null;
  voedingsvezel: number | null;
  gevoel: number | null;
  gezondheid: number | null;
};

// Mock data for demonstration - replace with actual API call
const mockIngredients: Ingredient[] = [
  {
    id: 1,
    name: "Tomato",
    url: "https://example.com/tomato",
    kj: 74,
    kcal: 18,
    water: 94.5,
    eiwit: 0.9,
    koolhydraten: 3.9,
    suikers: 2.6,
    vet: 0.2,
    verzadigdVet: 0.0,
    enkelvoudigOnverzadigdVet: 0.0,
    meervoudigOnverzadigdVet: 0.1,
    cholesterol: 0,
    voedingsvezel: 1.2,
    gevoel: 8,
    gezondheid: 9,
  },
  {
    id: 2,
    name: "Chicken Breast",
    url: null,
    kj: 690,
    kcal: 165,
    water: 74.0,
    eiwit: 31.0,
    koolhydraten: 0,
    suikers: 0,
    vet: 3.6,
    verzadigdVet: 1.0,
    enkelvoudigOnverzadigdVet: 1.2,
    meervoudigOnverzadigdVet: 0.8,
    cholesterol: 85,
    voedingsvezel: 0,
    gevoel: 9,
    gezondheid: 8,
  },
];

export function IngredientsTable() {
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
        onClick: (ingredient) => console.log("Edit", ingredient),
      },
      {
        label: "View Details",
        onClick: (ingredient) => console.log("View", ingredient),
      },
      {
        label: "Delete",
        variant: "destructive",
        onClick: (ingredient) => console.log("Delete", ingredient),
      },
    ]),
  ];

  return (
    <DataTable
      columns={columns}
      data={mockIngredients}
      searchKey="name"
      defaultPageSize={20}
    />
  );
}