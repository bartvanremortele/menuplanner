import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import {
  desc,
  eq,
} from "@menuplanner/db";
import { Recipe, RecipeIngredient, RecipeLabelConnection } from "@menuplanner/db/schema";
import { CreateRecipeInputSchema, UpdateRecipeInputSchema } from "@menuplanner/validators";

import { protectedProcedure } from "../trpc";

export const recipeRouter = {
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.Recipe.findMany({
      orderBy: desc(Recipe.createdAt),
      limit: 20,
      with: {
        labels: {
          with: {
            label: true,
          },
        },
        ingredients: {
          with: {
            ingredient: true,
            unit: true,
          },
        },
      },
    });
  }),

  byId: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.Recipe.findFirst({
        where: eq(Recipe.id, input.id),
        with: {
          labels: {
            with: {
              label: true,
            },
          },
          ingredients: {
            with: {
              ingredient: true,
              unit: true,
            },
          },
        },
      });
    }),

  create: protectedProcedure
    .input(CreateRecipeInputSchema)
    .mutation(async ({ ctx, input }) => {
      const { ingredients, labelIds, ...recipeData } = input;
      
      // Create the recipe first
      const [recipe] = await ctx.db.insert(Recipe).values({
        ...recipeData,
        createdByUserId: ctx.session.user.id,
      }).returning();
      
      if (!recipe) {
        throw new Error("Failed to create recipe");
      }
      
      // Add ingredients if provided
      if (ingredients && ingredients.length > 0) {
        await ctx.db.insert(RecipeIngredient).values(
          ingredients.map(ing => ({
            recipeId: recipe.id,
            ingredientId: ing.ingredientId,
            amount: ing.amount,
            unitAbbr: ing.unitAbbr,
          }))
        );
      }
      
      // Add labels if provided
      if (labelIds && labelIds.length > 0) {
        await ctx.db.insert(RecipeLabelConnection).values(
          labelIds.map(labelId => ({
            recipeId: recipe.id,
            labelId,
            assignedByUserId: ctx.session.user.id,
          }))
        );
      }
      
      // Return the recipe with its relationships
      return ctx.db.query.Recipe.findFirst({
        where: eq(Recipe.id, recipe.id),
        with: {
          labels: {
            with: {
              label: true,
            },
          },
          ingredients: {
            with: {
              ingredient: true,
              unit: true,
            },
          },
        },
      });
    }),

  update: protectedProcedure
    .input(UpdateRecipeInputSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ingredients, labelIds, ...recipeData } = input;
      
      // Update the recipe
      await ctx.db
        .update(Recipe)
        .set({
          ...recipeData,
          updatedAt: new Date(),
        })
        .where(eq(Recipe.id, id));
      
      // Update ingredients if provided
      if (ingredients !== undefined) {
        // Remove existing ingredients
        await ctx.db.delete(RecipeIngredient).where(eq(RecipeIngredient.recipeId, id));
        
        // Add new ingredients
        if (ingredients.length > 0) {
          await ctx.db.insert(RecipeIngredient).values(
            ingredients.map(ing => ({
              recipeId: id,
              ingredientId: ing.ingredientId,
              amount: ing.amount,
              unitAbbr: ing.unitAbbr,
            }))
          );
        }
      }
      
      // Update labels if provided
      if (labelIds !== undefined) {
        // Remove existing labels
        await ctx.db.delete(RecipeLabelConnection).where(eq(RecipeLabelConnection.recipeId, id));
        
        // Add new labels
        if (labelIds.length > 0) {
          await ctx.db.insert(RecipeLabelConnection).values(
            labelIds.map(labelId => ({
              recipeId: id,
              labelId,
              assignedByUserId: ctx.session.user.id,
            }))
          );
        }
      }
      
      // Return the updated recipe with its relationships
      return ctx.db.query.Recipe.findFirst({
        where: eq(Recipe.id, id),
        with: {
          labels: {
            with: {
              label: true,
            },
          },
          ingredients: {
            with: {
              ingredient: true,
              unit: true,
            },
          },
        },
      });
    }),

  delete: protectedProcedure
    .input(z.string().uuid())
    .mutation(({ ctx, input }) => {
      return ctx.db.delete(Recipe).where(eq(Recipe.id, input));
    }),
} satisfies TRPCRouterRecord;
