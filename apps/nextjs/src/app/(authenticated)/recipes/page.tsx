import Link from "next/link";
import { Suspense } from "react";
import { IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { RecipesTable } from "@/features/recipes/components/recipes-table";

function RecipesTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-8 w-[250px] animate-pulse rounded bg-muted" />
        <div className="h-8 w-[100px] animate-pulse rounded bg-muted" />
      </div>
      <div className="rounded-md border">
        <div className="h-[400px] animate-pulse bg-muted/10" />
      </div>
    </div>
  );
}

export default function RecipesPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Recipes</h2>
          <p className="text-muted-foreground">
            Manage your recipe collection
          </p>
        </div>
        <Button asChild>
          <Link href="/recipes/new">
            <IconPlus className="mr-2 h-4 w-4" />
            New Recipe
          </Link>
        </Button>
      </div>
      
      <Suspense fallback={<RecipesTableSkeleton />}>
        <RecipesTable />
      </Suspense>
    </div>
  );
}