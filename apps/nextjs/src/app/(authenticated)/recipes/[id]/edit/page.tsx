import Link from "next/link";
import { Suspense } from "react";
import { IconArrowLeft } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { paths } from "@/config/paths";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RecipeUpdate } from "@/features/recipes/components/recipe-update";

export default function EditRecipePage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={paths.app.recipes.detail.getHref(params.id)}>
            <IconArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold">Edit Recipe</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recipe Details</CardTitle>
          <CardDescription>
            Update your recipe information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<EditRecipeSkeleton />}>
            <RecipeUpdate recipeId={params.id} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

function EditRecipeSkeleton() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-32 w-full" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-20" />
      </div>
    </div>
  );
}