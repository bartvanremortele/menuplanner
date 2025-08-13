import { useTRPC } from "@/trpc/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { RouterOutputs } from "@menuplanner/api";

export type Ingredient = RouterOutputs["admin"]["ingredient"]["all"][number];

export function useGetIngredients() {
  const trpc = useTRPC();
  return useQuery(trpc.admin.ingredient.all.queryOptions());
}

export function useGetIngredient(id: string) {
  const trpc = useTRPC();
  return useQuery(
    trpc.admin.ingredient.byId.queryOptions(
      { id },
      {
        enabled: !!id,
      },
    ),
  );
}

export function useCreateIngredient() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.admin.ingredient.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ["admin", "ingredient"],
        });
        toast.success("Ingredient created successfully");
      },
      onError: (error) => {
        toast.error(`Failed to create ingredient: ${error.message}`);
      },
    }),
  );
}

export function useUpdateIngredient() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.admin.ingredient.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ["admin", "ingredient"],
        });
        toast.success("Ingredient updated successfully");
      },
      onError: (error) => {
        toast.error(`Failed to update ingredient: ${error.message}`);
      },
    }),
  );
}

export function useDeleteIngredient() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.admin.ingredient.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ["admin", "ingredient"],
        });
        toast.success("Ingredient deleted successfully");
      },
      onError: (error) => {
        toast.error(`Failed to delete ingredient: ${error.message}`);
      },
    }),
  );
}
