import { Button } from "@/components/ui/button";
import { IngredientsTable } from "@/features/ingredients/components/ingredients-table";
import { IconPlus } from "@tabler/icons-react";

export default function IngredientsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Ingredients</h2>
          <p className="text-muted-foreground">
            Manage your ingredient database
          </p>
        </div>
        <Button>
          <IconPlus className="mr-2 h-4 w-4" />
          New Ingredient
        </Button>
      </div>

      <IngredientsTable />
    </div>
  );
}
