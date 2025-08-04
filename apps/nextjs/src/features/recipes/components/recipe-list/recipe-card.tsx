"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useDeleteRecipe, type Recipe } from "@/features/recipes/api/use-recipes";

export function RecipeCard(props: {
  recipe: Recipe;
}) {
  const deleteRecipe = useDeleteRecipe();

  // Format the description to show line breaks
  const formatDescription = (text: string) => {
    return text.split("\n").map((line, i) => (
      <span key={i}>
        {line}
        {i < text.split("\n").length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className="bg-muted flex flex-col gap-4 rounded-lg p-6">
      <div className="flex flex-row items-start justify-between">
        <div className="flex-grow">
          <h2 className="text-primary text-2xl font-bold">
            {props.recipe.name}
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Created{" "}
            {new Date(props.recipe.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:bg-destructive/10 text-sm font-bold uppercase"
          onClick={() => deleteRecipe.mutate(props.recipe.id)}
        >
          Delete
        </Button>
      </div>
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {formatDescription(props.recipe.description)}
        </p>
      </div>
    </div>
  );
}

export function RecipeCardSkeleton(props: { pulse?: boolean }) {
  const { pulse = true } = props;
  return (
    <div className="bg-muted flex flex-col gap-4 rounded-lg p-6">
      <div className="flex flex-row items-start justify-between">
        <div className="flex-grow">
          <h2
            className={cn(
              "bg-primary w-1/3 rounded text-2xl font-bold",
              pulse && "animate-pulse",
            )}
          >
            &nbsp;
          </h2>
          <p
            className={cn(
              "bg-muted-foreground mt-1 w-1/4 rounded text-sm",
              pulse && "animate-pulse",
            )}
          >
            &nbsp;
          </p>
        </div>
      </div>
      <div className="space-y-2">
        <p
          className={cn(
            "h-4 w-full rounded bg-current text-sm",
            pulse && "animate-pulse",
          )}
        >
          &nbsp;
        </p>
        <p
          className={cn(
            "h-4 w-3/4 rounded bg-current text-sm",
            pulse && "animate-pulse",
          )}
        >
          &nbsp;
        </p>
      </div>
    </div>
  );
}