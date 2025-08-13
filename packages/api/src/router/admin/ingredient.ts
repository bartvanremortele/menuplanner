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

import { adminProcedure } from "../../trpc";

export const ingredientRouter = {
  all: adminProcedure.query(({ ctx }) => {
    return ctx.db.query.Ingredient.findMany({
      orderBy: desc(Ingredient.id),
      limit: 100,
    });
  }),

  byId: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.Ingredient.findFirst({
        where: eq(Ingredient.id, input.id),
      });
    }),

  search: adminProcedure
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

  create: adminProcedure
    .input(CreateIngredientSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(Ingredient).values(input);
    }),

  update: adminProcedure
    .input(UpdateIngredientSchema)
    .mutation(({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.update(Ingredient).set(data).where(eq(Ingredient.id, id));
    }),

  delete: adminProcedure.input(z.string().uuid()).mutation(({ ctx, input }) => {
    return ctx.db.delete(Ingredient).where(eq(Ingredient.id, input));
  }),
} satisfies TRPCRouterRecord;
