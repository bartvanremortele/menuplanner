"use client";

import type { Recipe } from "@/features/recipes/api/use-recipes";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDeleteRecipe } from "@/features/recipes/api/use-recipes";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export function RecipeCard(props: { recipe: Recipe }) {
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
    <div className="flex flex-col gap-4 overflow-hidden rounded-lg bg-muted p-6">
      {props.recipe.imageKey && (
        <div className="-m-6 mb-0">
          <Image
            src={
              props.recipe.imageKey.startsWith("http") ||
              props.recipe.imageKey.startsWith("data:")
                ? props.recipe.imageKey
                : supabase.storage
                    .from("recipe-images")
                    .getPublicUrl(props.recipe.imageKey).data.publicUrl
            }
            alt={props.recipe.name}
            width={800}
            height={192}
            className="h-48 w-full object-cover"
          />
        </div>
      )}
      <div className="flex flex-row items-start justify-between">
        <div className="flex-grow">
          <h2 className="text-2xl font-bold text-primary">
            {props.recipe.name}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Created{" "}
            {new Date(props.recipe.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          {props.recipe.labels.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {props.recipe.labels.map((labelConnection) => (
                <Badge
                  key={labelConnection.label.id}
                  variant="secondary"
                  className="text-xs"
                >
                  {labelConnection.label.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-sm font-bold uppercase text-destructive hover:bg-destructive/10"
          onClick={() => deleteRecipe.mutate(props.recipe.id)}
        >
          Delete
        </Button>
      </div>
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <p className="whitespace-pre-wrap text-sm leading-relaxed">
          {formatDescription(props.recipe.description)}
        </p>
      </div>
      {props.recipe.ingredients.length > 0 && (
        <div className="text-sm text-muted-foreground">
          {props.recipe.ingredients.length} ingredient
          {props.recipe.ingredients.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}

export function RecipeCardSkeleton(props: { pulse?: boolean }) {
  const { pulse = true } = props;
  return (
    <div className="flex flex-col gap-4 rounded-lg bg-muted p-6">
      <div className="flex flex-row items-start justify-between">
        <div className="flex-grow">
          <h2
            className={cn(
              "w-1/3 rounded bg-primary text-2xl font-bold",
              pulse && "animate-pulse",
            )}
          >
            &nbsp;
          </h2>
          <p
            className={cn(
              "mt-1 w-1/4 rounded bg-muted-foreground text-sm",
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
