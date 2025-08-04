import Link from "next/link";
import { Suspense } from "react";
import { IconArrowLeft, IconEdit } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { RecipeDetail } from "@/features/recipes/components/recipe-detail";
import { Skeleton } from "@/components/ui/skeleton";
import { paths } from "@/config/paths";

export default function RecipeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between p-4 lg:p-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={paths.app.recipes.getHref()}>
              <IconArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to recipes</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Recipe Details</h1>
            <p className="text-sm text-muted-foreground">
              View and manage recipe information
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href={paths.app.recipes.edit.getHref(params.id)}>
            <IconEdit className="mr-2 h-4 w-4" />
            Edit Recipe
          </Link>
        </Button>
      </div>

      <div className="flex-1 p-4 lg:p-6">
        <Suspense fallback={<RecipeDetailSkeleton />}>
          <RecipeDetail recipeId={params.id} />
        </Suspense>
      </div>
    </div>
  );
}

function RecipeDetailSkeleton() {
  return (
    <div className="max-w-4xl">
      <div className="px-4 sm:px-0">
        <Skeleton className="h-7 w-64" />
        <Skeleton className="mt-1 h-5 w-96" />
      </div>
      <div className="mt-6 border-t">
        <dl className="divide-y">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt>
                <Skeleton className="h-5 w-32" />
              </dt>
              <dd className="mt-1 sm:col-span-2 sm:mt-0">
                <Skeleton className="h-5 w-full max-w-md" />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}