import { useTRPC } from "@/trpc/react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreateRecipeImageUrl() {
  const trpc = useTRPC();

  return useMutation(
    trpc.admin.upload.createRecipeImageUrl.mutationOptions({
      onError: (error) => {
        toast.error(`Failed to create upload URL: ${error.message}`);
      },
    }),
  );
}
