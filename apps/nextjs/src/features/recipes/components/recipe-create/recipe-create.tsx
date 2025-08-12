"use client";

import type { z } from "zod/v4";
import { useRouter } from "next/navigation";
import { paths } from "@/config/paths";
import { useCreateRecipe } from "@/features/recipes/api/use-recipes";

import type { CreateRecipeInputSchema } from "@menuplanner/validators";

import { RecipeForm } from "../recipe-form";

type RecipeFormData = z.infer<typeof CreateRecipeInputSchema>;

export function RecipeCreate() {
  const router = useRouter();
  const createRecipe = useCreateRecipe();

  const handleSubmit = (data: RecipeFormData) => {
    createRecipe.mutate(data, {
      onSuccess: (result) => {
        if (result) {
          router.push(paths.app.recipes.detail.getHref(result.id));
        }
      },
    });
  };

  const handleCancel = () => {
    router.push(paths.app.recipes.getHref());
  };

  return (
    <RecipeForm
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isSubmitting={createRecipe.isPending}
      submitLabel="Create Recipe"
    />
  );
}
