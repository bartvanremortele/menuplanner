"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { DL } from "@/components/ui/description-list";
import { DetailHeader } from "@/components/ui/detail-header";
import { useGetRecipe } from "@/features/recipes/api/use-recipes";
import { supabase } from "@/lib/supabase";

interface RecipeViewProps {
  recipeId: string;
}

export function RecipeView({ recipeId }: RecipeViewProps) {
  const { data: recipe } = useGetRecipe(recipeId);

  if (!recipe) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">Recipe not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <DetailHeader
        title={recipe.name}
        subtitle="Recipe details and information"
      />

      {recipe.imageKey && (
        <div className="relative mt-6 h-64 w-full">
          <Image
            src={
              recipe.imageKey.startsWith("http") ||
              recipe.imageKey.startsWith("data:")
                ? recipe.imageKey
                : supabase.storage
                    .from("recipe-images")
                    .getPublicUrl(recipe.imageKey).data.publicUrl
            }
            alt={recipe.name}
            fill
            className="rounded-lg object-cover"
          />
        </div>
      )}

      <div className="mt-6 border-t">
        <DL>
          <DL.Item term="Description">
            {recipe.description || "No description provided"}
          </DL.Item>

          {recipe.labels.length > 0 && (
            <DL.Item term="Labels">
              <div className="flex flex-wrap gap-2">
                {recipe.labels.map((labelConnection) => (
                  <Badge key={labelConnection.label.id} variant="secondary">
                    {labelConnection.label.name}
                  </Badge>
                ))}
              </div>
            </DL.Item>
          )}

          <DL.Item term="Created By">User ID: {recipe.createdByUserId}</DL.Item>

          <DL.Item term="Created">
            {new Date(recipe.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            })}
          </DL.Item>

          {recipe.updatedAt && (
            <DL.Item term="Last Updated">
              {new Date(recipe.updatedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
              })}
            </DL.Item>
          )}
        </DL>
      </div>

      {/* Ingredients Section */}
      {recipe.ingredients.length > 0 && (
        <div className="mt-8 border-t pt-6">
          <h4 className="mb-4 text-sm font-medium leading-6 text-foreground">
            Ingredients
          </h4>
          <ul className="divide-y divide-border">
            {recipe.ingredients.map((item) => (
              <li
                key={item.ingredient.id}
                className="flex justify-between py-3"
              >
                <span className="text-sm">{item.ingredient.name}</span>
                <span className="text-sm text-muted-foreground">
                  {item.amount} {item.unit.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
