"use client";

import { useRouter } from "next/navigation";
import { useCreateRecipe } from "@/features/recipes/api/use-recipes";
import { RecipeForm } from "../recipe-form";
import { paths } from "@/config/paths";
import { z } from "zod/v4";
import { CreateRecipeInputSchema } from "@menuplanner/validators";

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