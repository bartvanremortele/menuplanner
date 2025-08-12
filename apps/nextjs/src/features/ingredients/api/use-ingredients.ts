import { useTRPC } from "@/trpc/react";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";

import type { RouterOutputs } from "@menuplanner/api";

export type Ingredient = RouterOutputs["ingredient"]["all"][number];

export function useGetIngredients() {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.ingredient.all.queryOptions());
}

export function useGetIngredient(id: string) {
  const trpc = useTRPC();
  return useSuspenseQuery(
    trpc.ingredient.byId.queryOptions(
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
    trpc.ingredient.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["ingredient"] });
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
    trpc.ingredient.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["ingredient"] });
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
    trpc.ingredient.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["ingredient"] });
        toast.success("Ingredient deleted successfully");
      },
      onError: (error) => {
        toast.error(`Failed to delete ingredient: ${error.message}`);
      },
    }),
  );
}
