"use client";

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
import { CreateRecipeInputSchema } from "@menuplanner/validators";
import { z } from "zod/v4";
import { ImageUpload } from "./image-upload";
import { MultiSelect } from "./multi-select";
import { RecipeIngredientsInput } from "./recipe-ingredients-input";
import { useGetLabels } from "@/features/recipes/api/use-recipes";

type RecipeFormData = z.infer<typeof CreateRecipeInputSchema>;

interface RecipeFormProps {
  initialData?: Partial<RecipeFormData>;
  onSubmit: (data: RecipeFormData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  recipeId?: string;
}

export function RecipeForm({ 
  initialData, 
  onSubmit, 
  onCancel,
  isSubmitting = false,
  submitLabel = "Submit",
  recipeId
}: RecipeFormProps) {
  const { data: labels } = useGetLabels();
  
  const form = useForm({
    schema: CreateRecipeInputSchema,
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      imageKey: initialData?.imageKey,
      ingredients: initialData?.ingredients ?? [],
      labelIds: initialData?.labelIds ?? [],
    },
  });

  return (
    <Form {...form}>
      <form
        className="flex w-full max-w-2xl flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
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
        
        <FormField
          control={form.control}
          name="imageKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recipe Image</FormLabel>
              <FormControl>
                <ImageUpload
                  value={field.value}
                  onChange={field.onChange}
                  recipeId={recipeId}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="labelIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Labels</FormLabel>
              <FormControl>
                <MultiSelect
                  options={labels?.map((label) => ({
                    value: label.id,
                    label: label.name,
                  })) ?? []}
                  selected={field.value ?? []}
                  onChange={field.onChange}
                  placeholder="Select labels..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <RecipeIngredientsInput />
        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : submitLabel}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}