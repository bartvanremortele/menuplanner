import type { TRPCRouterRecord } from "@trpc/server";

import { desc } from "@menuplanner/db";
import { Unit } from "@menuplanner/db/schema";

import { adminProcedure } from "../../trpc";

export const unitRouter = {
  all: adminProcedure.query(({ ctx }) => {
    return ctx.db.query.Unit.findMany({
      orderBy: desc(Unit.name),
    });
  }),
} satisfies TRPCRouterRecord;
