"use client";

import { useRouter } from "next/navigation";
import { useGetRecipe, useUpdateRecipe } from "@/features/recipes/api/use-recipes";
import { RecipeForm } from "../recipe-form";
import { paths } from "@/config/paths";
import type { RouterOutputs } from "@menuplanner/api";
import { z } from "zod/v4";
import { CreateRecipeInputSchema } from "@menuplanner/validators";

type RecipeFormData = z.infer<typeof CreateRecipeInputSchema>;

interface RecipeUpdateProps {
  recipe?: RouterOutputs["recipe"]["byId"];
  recipeId?: string;
}

export function RecipeUpdate({ recipe, recipeId }: RecipeUpdateProps) {
  const router = useRouter();
  const updateRecipe = useUpdateRecipe();
  
  // If recipeId is provided, use the hook to fetch the recipe
  // This will suspend, which is fine since we're in a Suspense boundary
  const { data: fetchedRecipe } = recipeId && !recipe ? useGetRecipe(recipeId) : { data: undefined };
  
  const recipeData = recipe ?? fetchedRecipe;

  if (!recipeData) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Recipe not found</p>
      </div>
    );
  }

  const handleSubmit = (data: RecipeFormData) => {
    updateRecipe.mutate(
      {
        id: recipeData.id,
        ...data,
      },
      {
        onSuccess: (result) => {
          if (result) {
            router.push(paths.app.recipes.detail.getHref(recipeData.id));
          }
        },
      }
    );
  };

  const handleCancel = () => {
    router.push(paths.app.recipes.detail.getHref(recipeData.id));
  };

  return (
    <RecipeForm
      initialData={{
        name: recipeData.name,
        description: recipeData.description ?? "",
        imageKey: recipeData.imageKey ?? undefined,
        ingredients: recipeData.ingredients?.map(ing => ({
          ingredientId: ing.ingredient.id,
          amount: ing.amount,
          unitAbbr: ing.unit.abbr,
        })) ?? [],
        labelIds: recipeData.labels?.map(label => label.label.id) ?? [],
      }}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isSubmitting={updateRecipe.isPending}
      submitLabel="Update Recipe"
      recipeId={recipeData.id}
    />
  );
}