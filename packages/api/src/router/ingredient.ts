import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import {
  CreateIngredientSchema,
  desc,
  eq,
  UpdateIngredientSchema,
} from "@menuplanner/db";
import { Ingredient } from "@menuplanner/db/schema";

import { protectedProcedure, publicProcedure } from "../trpc";

export const ingredientRouter = {
  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.Ingredient.findMany({
      orderBy: desc(Ingredient.id),
      limit: 100,
    });
  }),

  byId: publicProcedure
    .input(z.object({ id: z.union([z.string(), z.number()]).transform(val => typeof val === 'string' ? parseInt(val, 10) : val) }))
    .query(({ ctx, input }) => {
      return ctx.db.query.Ingredient.findFirst({
        where: eq(Ingredient.id, input.id),
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
    .input(z.union([z.string(), z.number()]).transform(val => typeof val === 'string' ? parseInt(val, 10) : val))
    .mutation(({ ctx, input }) => {
      return ctx.db.delete(Ingredient).where(eq(Ingredient.id, input));
    }),
} satisfies TRPCRouterRecord;