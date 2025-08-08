"use client";

import { useGetRecipe } from "@/features/recipes/api/use-recipes";
import { Skeleton } from "@/components/ui/skeleton";
import { DetailHeader } from "@/components/ui/detail-header";
import { DL } from "@/components/ui/description-list";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";

interface RecipeViewProps {
  recipeId: string;
}

export function RecipeView({ recipeId }: RecipeViewProps) {
  const { data: recipe, isLoading } = useGetRecipe(recipeId);

  if (isLoading) {
    return <RecipeViewSkeleton />;
  }

  if (!recipe) {
    return (
      <div className="text-center py-12">
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
        <div className="mt-6">
          <img 
            src={
              recipe.imageKey.startsWith('http') || recipe.imageKey.startsWith('data:')
                ? recipe.imageKey
                : supabase.storage.from('recipe-images').getPublicUrl(recipe.imageKey).data.publicUrl
            }
            alt={recipe.name}
            className="w-full h-64 object-cover rounded-lg"
          />
        </div>
      )}

      <div className="mt-6 border-t">
        <DL>
          <DL.Item term="Description">
            {recipe.description || "No description provided"}
          </DL.Item>

          {recipe.labels && recipe.labels.length > 0 && (
            <DL.Item term="Labels">
              <div className="flex gap-2 flex-wrap">
                {recipe.labels.map((labelConnection) => (
                  <Badge key={labelConnection.label.id} variant="secondary">
                    {labelConnection.label.name}
                  </Badge>
                ))}
              </div>
            </DL.Item>
          )}

          <DL.Item term="Created By">
            User ID: {recipe.createdByUserId}
          </DL.Item>

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
      {recipe.ingredients && recipe.ingredients.length > 0 && (
        <div className="mt-8 border-t pt-6">
          <h4 className="text-sm font-medium leading-6 text-foreground mb-4">
            Ingredients
          </h4>
          <ul className="divide-y divide-border">
            {recipe.ingredients.map((item) => (
              <li key={item.ingredient.id} className="py-3 flex justify-between">
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

function RecipeViewSkeleton() {
  return (
    <div className="max-w-4xl">
      <div className="px-4 sm:px-0">
        <Skeleton className="h-7 w-64" />
        <Skeleton className="mt-1 h-5 w-96" />
      </div>
      <div className="mt-6 border-t">
        <DL>
          {[...Array(5)].map((_, i) => (
            <DL.Item key={i} term={<Skeleton className="h-5 w-32" />}>
              <Skeleton className="h-5 w-full max-w-md" />
            </DL.Item>
          ))}
        </DL>
      </div>
    </div>
  );
}