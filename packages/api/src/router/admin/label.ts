import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { CreateLabelSchema, desc, eq, ilike } from "@menuplanner/db";
import { Label } from "@menuplanner/db/schema";

import { adminProcedure } from "../../trpc";

export const labelRouter = {
  all: adminProcedure.query(({ ctx }) => {
    return ctx.db.query.Label.findMany({
      orderBy: desc(Label.id),
    });
  }),

  byId: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.Label.findFirst({
        where: eq(Label.id, input.id),
      });
    }),

  search: adminProcedure
    .input(z.object({ query: z.string() }))
    .query(({ ctx, input }) => {
      if (!input.query) {
        return ctx.db.query.Label.findMany({
          limit: 10,
          orderBy: desc(Label.id),
        });
      }

      return ctx.db.query.Label.findMany({
        where: ilike(Label.name, `%${input.query}%`),
        limit: 10,
      });
    }),

  create: adminProcedure.input(CreateLabelSchema).mutation(({ ctx, input }) => {
    return ctx.db.insert(Label).values(input).returning();
  }),

  update: adminProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().max(256),
      }),
    )
    .mutation(({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.update(Label).set(data).where(eq(Label.id, id)).returning();
    }),

  delete: adminProcedure.input(z.string().uuid()).mutation(({ ctx, input }) => {
    return ctx.db.delete(Label).where(eq(Label.id, input));
  }),
} satisfies TRPCRouterRecord;
