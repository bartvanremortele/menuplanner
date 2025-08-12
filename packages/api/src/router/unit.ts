import type { TRPCRouterRecord } from "@trpc/server";

import { desc } from "@menuplanner/db";
import { Unit } from "@menuplanner/db/schema";

import { protectedProcedure } from "../trpc";

export const unitRouter = {
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.Unit.findMany({
      orderBy: desc(Unit.name),
    });
  }),
} satisfies TRPCRouterRecord;
