"use client";

import type { z } from "zod/v4";
import { useRouter } from "next/navigation";
import { paths } from "@/config/paths";
import {
  useGetRecipe,
  useUpdateRecipe,
} from "@/features/recipes/api/use-recipes";

import type { RouterOutputs } from "@menuplanner/api";
import type { CreateRecipeInputSchema } from "@menuplanner/validators";

import { RecipeForm } from "../recipe-form";

type RecipeFormData = z.infer<typeof CreateRecipeInputSchema>;

interface RecipeUpdateProps {
  recipe?: RouterOutputs["admin"]["recipe"]["byId"];
  recipeId?: string;
}

export function RecipeUpdate({ recipe, recipeId }: RecipeUpdateProps) {
  const router = useRouter();
  const updateRecipe = useUpdateRecipe();

  // Always call the hook - it won't fetch if recipeId is falsy
  const { data: fetchedRecipe } = useGetRecipe(recipeId ?? "");

  const recipeData = recipe ?? fetchedRecipe;

  if (!recipeData) {
    return (
      <div className="py-12 text-center">
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
      },
    );
  };

  const handleCancel = () => {
    router.push(paths.app.recipes.detail.getHref(recipeData.id));
  };

  return (
    <RecipeForm
      initialData={{
        name: recipeData.name,
        description: recipeData.description,
        imageKey: recipeData.imageKey ?? undefined,
        ingredients: recipeData.ingredients.map((ing) => ({
          ingredientId: ing.ingredient.id,
          amount: ing.amount,
          unitAbbr: ing.unit.abbr,
        })),
        labelIds: recipeData.labels.map((label) => label.label.id),
      }}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isSubmitting={updateRecipe.isPending}
      submitLabel="Update Recipe"
      recipeId={recipeData.id}
    />
  );
}
