import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import {
  CreateIngredientSchema,
  desc,
  eq,
  ilike,
  UpdateIngredientSchema,
} from "@menuplanner/db";
import { Ingredient } from "@menuplanner/db/schema";

import { protectedProcedure } from "../trpc";

export const ingredientRouter = {
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.Ingredient.findMany({
      orderBy: desc(Ingredient.id),
      limit: 100,
    });
  }),

  byId: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.Ingredient.findFirst({
        where: eq(Ingredient.id, input.id),
      });
    }),

  byIds: protectedProcedure
    .input(z.object({ ids: z.array(z.string().uuid()) }))
    .query(({ ctx, input }) => {
      if (input.ids.length === 0) {
        return [];
      }
      return ctx.db.query.Ingredient.findMany({
        where: (ingredient, { inArray }) => inArray(ingredient.id, input.ids),
      });
    }),

  search: protectedProcedure
    .input(z.object({ query: z.string() }))
    .query(({ ctx, input }) => {
      if (!input.query) {
        return ctx.db.query.Ingredient.findMany({
          limit: 50,
          orderBy: desc(Ingredient.id),
        });
      }
      
      return ctx.db.query.Ingredient.findMany({
        where: ilike(Ingredient.name, `%${input.query}%`),
        limit: 50,
      });
    }),

  create: protectedProcedure
    .input(CreateIngredientSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(Ingredient).values(input);
    }),

  update: protectedProcedure
    .input(UpdateIngredientSchema)
    .mutation(({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.update(Ingredient).set(data).where(eq(Ingredient.id, id));
    }),

  delete: protectedProcedure
    .input(z.string().uuid())
    .mutation(({ ctx, input }) => {
      return ctx.db.delete(Ingredient).where(eq(Ingredient.id, input));
    }),
} satisfies TRPCRouterRecord;