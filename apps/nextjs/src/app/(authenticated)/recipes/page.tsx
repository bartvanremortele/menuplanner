"use client";

import { Suspense } from "react";
import Link from "next/link";
import {
  PageHeader,
  PageHeaderAction,
  PageHeaderActions,
} from "@/components/layouts/page-header";
import { RecipeTable } from "@/features/recipes/components/recipe-list";
import { Plus } from "lucide-react";

function RecipeTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="bg-muted h-8 w-[250px] animate-pulse rounded" />
        <div className="bg-muted h-8 w-[100px] animate-pulse rounded" />
      </div>
      <div className="rounded-md border">
        <div className="bg-muted/10 h-[400px] animate-pulse" />
      </div>
    </div>
  );
}

export default function RecipesPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-6">
      <PageHeader
        title="Recipes"
        subtitle="Manage your recipe collection"
        actions={
          <PageHeaderActions>
            <PageHeaderAction
              label="New Recipe"
              icon={<Plus className="mr-2 size-4" />}
              variant="default"
              asChild
            >
              <Link href="/recipes/new" />
            </PageHeaderAction>
          </PageHeaderActions>
        }
      />

      <Suspense fallback={<RecipeTableSkeleton />}>
        <RecipeTable />
      </Suspense>
    </div>
  );
}
