/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useTRPC } from "@/trpc/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { RouterOutputs } from "@menuplanner/api";

export type Recipe = RouterOutputs["admin"]["recipe"]["all"][number];
export type Ingredient = RouterOutputs["admin"]["ingredient"]["all"][number];
export type Label = RouterOutputs["admin"]["label"]["all"][number];
export type Unit = RouterOutputs["admin"]["unit"]["all"][number];

export function useGetRecipes() {
  const trpc = useTRPC();
  return useQuery(trpc.admin.recipe.all.queryOptions());
}

export function useGetRecipe(id: string) {
  const trpc = useTRPC();
  return useQuery(
    trpc.admin.recipe.byId.queryOptions(
      { id },
      {
        enabled: !!id,
      },
    ),
  );
}

export function useCreateRecipe() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.admin.recipe.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.admin.recipe.all.queryFilter(),
        );
        toast.success("Recipe created successfully");
      },
      onError: (error) => {
        toast.error(`Failed to create recipe: ${error.message}`);
      },
    }),
  );
}

export function useUpdateRecipe() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.admin.recipe.update.mutationOptions({
      onSuccess: async (data, variables) => {
        // Use tRPC's queryKey method - id is now a UUID string
        await queryClient.invalidateQueries({
          queryKey: trpc.admin.recipe.all.queryKey(),
        });
        await queryClient.invalidateQueries({
          queryKey: trpc.admin.recipe.byId.queryKey({ id: variables.id }),
        });
        toast.success("Recipe updated successfully");
      },
      onError: (error) => {
        toast.error(`Failed to update recipe: ${error.message}`);
      },
    }),
  );
}

export function useDeleteRecipe() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.admin.recipe.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.admin.recipe.all.queryFilter(),
        );
        toast.success("Recipe deleted successfully");
      },
      onError: (error) => {
        toast.error(`Failed to delete recipe: ${error.message}`);
      },
    }),
  );
}

// Ingredient hooks
export function useSearchIngredients(query: string) {
  const trpc = useTRPC();
  return useQuery(trpc.admin.ingredient.search.queryOptions({ query }));
}

export function useGetIngredients() {
  const trpc = useTRPC();
  return useQuery(trpc.admin.ingredient.all.queryOptions());
}

export function useGetIngredient(id: string | undefined) {
  const trpc = useTRPC();
  return useQuery(
    trpc.admin.ingredient.byId.queryOptions(
      { id: id! },
      {
        enabled: !!id,
      },
    ),
  );
}

// Label hooks
export function useGetLabels() {
  const trpc = useTRPC();
  return useQuery(trpc.admin.label.all.queryOptions());
}

export function useSearchLabels(query: string) {
  const trpc = useTRPC();
  return useQuery(
    trpc.admin.label.search.queryOptions(
      { query },
      {
        enabled: true, // query is always a string
      },
    ),
  );
}

// Unit hooks
export function useGetUnits() {
  const trpc = useTRPC();
  return useQuery(trpc.admin.unit.all.queryOptions());
}
