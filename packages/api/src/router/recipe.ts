import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import {
  CreateRecipeSchema,
  desc,
  eq,
  UpdateRecipeSchema,
} from "@menuplanner/db";
import { Recipe } from "@menuplanner/db/schema";

import { protectedProcedure, publicProcedure } from "../trpc";

export const recipeRouter = {
  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.Recipe.findMany({
      orderBy: desc(Recipe.createdAt),
      limit: 20,
    });
  }),

  byId: publicProcedure
    .input(z.object({ id: z.union([z.string(), z.number()]).transform(val => typeof val === 'string' ? parseInt(val, 10) : val) }))
    .query(({ ctx, input }) => {
      return ctx.db.query.Recipe.findFirst({
        where: eq(Recipe.id, input.id),
      });
    }),

  create: protectedProcedure
    .input(CreateRecipeSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(Recipe).values({
        ...input,
        createdByUserId: ctx.session.user.id,
      });
    }),

  update: protectedProcedure
    .input(UpdateRecipeSchema)
    .mutation(({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.update(Recipe).set(data).where(eq(Recipe.id, id));
    }),

  delete: protectedProcedure
    .input(z.union([z.string(), z.number()]).transform(val => typeof val === 'string' ? parseInt(val, 10) : val))
    .mutation(({ ctx, input }) => {
      return ctx.db.delete(Recipe).where(eq(Recipe.id, input));
    }),
} satisfies TRPCRouterRecord;
