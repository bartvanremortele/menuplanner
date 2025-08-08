import { z } from "zod/v4";

// Define the base recipe schemas
const BaseRecipeSchema = z.object({
  name: z.string().max(256),
  description: z.string(),
  imageKey: z.string().optional(),
});

// Create recipe input schema
export const CreateRecipeInputSchema = BaseRecipeSchema.extend({
  ingredients: z.array(z.object({
    ingredientId: z.string().uuid(),
    amount: z.number().positive(),
    unitAbbr: z.string().max(10),
  })).optional(),
  labelIds: z.array(z.string().uuid()).optional(),
});

// Update recipe input schema
export const UpdateRecipeInputSchema = BaseRecipeSchema.extend({
  id: z.string().uuid(),
  ingredients: z.array(z.object({
    ingredientId: z.string().uuid(),
    amount: z.number().positive(),
    unitAbbr: z.string().max(10),
  })).optional(),
  labelIds: z.array(z.string().uuid()).optional(),
});

export type CreateRecipeInput = z.infer<typeof CreateRecipeInputSchema>;
export type UpdateRecipeInput = z.infer<typeof UpdateRecipeInputSchema>;