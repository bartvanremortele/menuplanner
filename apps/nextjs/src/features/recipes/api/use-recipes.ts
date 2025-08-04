import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/react";
import type { RouterOutputs } from "@menuplanner/api";

export type Recipe = RouterOutputs["recipe"]["all"][number];

export function useGetRecipes() {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.recipe.all.queryOptions());
}

export function useGetRecipe(id: string) {
  const trpc = useTRPC();
  return useSuspenseQuery(
    trpc.recipe.byId.queryOptions({ id }, {
      enabled: !!id,
    })
  );
}

export function useCreateRecipe() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  
  return useMutation(
    trpc.recipe.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["recipe"] });
        toast.success("Recipe created successfully");
      },
      onError: (error) => {
        toast.error(`Failed to create recipe: ${error.message}`);
      },
    })
  );
}

export function useUpdateRecipe() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  
  return useMutation(
    trpc.recipe.update.mutationOptions({
      onSuccess: async (_, variables) => {
        await queryClient.invalidateQueries({ queryKey: ["recipe"] });
        toast.success("Recipe updated successfully");
      },
      onError: (error) => {
        toast.error(`Failed to update recipe: ${error.message}`);
      },
    })
  );
}

export function useDeleteRecipe() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  
  return useMutation(
    trpc.recipe.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["recipe"] });
        toast.success("Recipe deleted successfully");
      },
      onError: (error) => {
        toast.error(`Failed to delete recipe: ${error.message}`);
      },
    })
  );
}