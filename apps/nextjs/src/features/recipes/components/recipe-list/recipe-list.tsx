"use client";

import { useGetRecipes } from "@/features/recipes/api/use-recipes";

import { RecipeCard, RecipeCardSkeleton } from "./recipe-card";

export function RecipeList() {
  const { data: recipes } = useGetRecipes();

  if (recipes.length === 0) {
    return (
      <div className="relative flex w-full flex-col gap-4">
        <RecipeCardSkeleton pulse={false} />
        <RecipeCardSkeleton pulse={false} />
        <RecipeCardSkeleton pulse={false} />

        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10">
          <p className="text-2xl font-bold text-white">No recipes yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {recipes.map((recipe) => {
        return <RecipeCard key={recipe.id} recipe={recipe} />;
      })}
    </div>
  );
}
