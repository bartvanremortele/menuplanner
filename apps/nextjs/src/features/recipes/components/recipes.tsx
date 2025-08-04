"use client";

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

import type { RouterOutputs } from "@menuplanner/api";
import { CreateRecipeSchema } from "@menuplanner/db";

import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";

export function CreateRecipeForm() {
  const trpc = useTRPC();
  const form = useForm({
    schema: CreateRecipeSchema,
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const queryClient = useQueryClient();
  const createRecipe = useMutation(
    trpc.recipe.create.mutationOptions({
      onSuccess: async () => {
        form.reset();
        await queryClient.invalidateQueries(trpc.recipe.pathFilter());
        toast.success("Recipe created successfully!");
      },
      onError: (err) => {
        toast.error(
          err.data?.code === "UNAUTHORIZED"
            ? "You must be logged in to create a recipe"
            : "Failed to create recipe",
        );
      },
    }),
  );

  return (
    <Form {...form}>
      <form
        className="flex w-full max-w-2xl flex-col gap-4"
        onSubmit={form.handleSubmit(
          (data) => {
            console.log("Submitting recipe:", data);
            createRecipe.mutate(data);
          },
          (errors) => {
            console.error("Form validation errors:", errors);
          },
        )}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recipe Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter recipe name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Enter recipe description and instructions"
                  rows={6}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={createRecipe.isPending}>
          {createRecipe.isPending ? "Creating..." : "Create Recipe"}
        </Button>
      </form>
    </Form>
  );
}

export function RecipeList() {
  const trpc = useTRPC();
  const { data: recipes } = useSuspenseQuery(trpc.recipe.all.queryOptions());

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

export function RecipeCard(props: {
  recipe: RouterOutputs["recipe"]["all"][number];
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const deleteRecipe = useMutation(
    trpc.recipe.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.recipe.pathFilter());
        toast.success("Recipe deleted successfully");
      },
      onError: (err) => {
        toast.error(
          err.data?.code === "UNAUTHORIZED"
            ? "You must be logged in to delete a recipe"
            : "Failed to delete recipe",
        );
      },
    }),
  );

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
