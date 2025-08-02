import { ChartAreaInteractive } from "~/app/_components/chart-area-interactive";
import { DataTable } from "~/app/_components/data-table";
import { SectionCards } from "~/app/_components/section-cards";
import { HydrateClient, prefetch, trpc } from "~/trpc/server";

import data from "./data.json";

export default async function DashboardPage() {
  // Prefetch recipe data
  prefetch(trpc.recipe.all.queryOptions());

  return (
    <HydrateClient>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
          <SectionCards />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive />
          </div>
          <DataTable data={data} />
        </div>
      </div>
    </HydrateClient>
  );
}