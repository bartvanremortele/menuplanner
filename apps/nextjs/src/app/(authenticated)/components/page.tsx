/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { Suspense } from "react";
import {
  PageHeader,
  PageHeaderMeta,
  PageHeaderMetaItem,
} from "@/components/layouts/page-header";
import { ComponentsShowcase } from "@/features/components-showcase";
import { Calendar, Package } from "lucide-react";

export default function ComponentsPage() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-6">
      <PageHeader
        title="Components"
        subtitle="A showcase of all available components in the design system"
        meta={
          <PageHeaderMeta>
            <PageHeaderMetaItem icon={Package} label="UI Components" />
            <PageHeaderMetaItem icon={Calendar} label="Last updated: Today" />
          </PageHeaderMeta>
        }
      />

      <Suspense fallback={<ComponentsShowcaseSkeleton />}>
        <ComponentsShowcase />
      </Suspense>
    </div>
  );
}

function ComponentsShowcaseSkeleton() {
  return (
    <div className="space-y-8">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-4">
          <div className="h-8 w-48 animate-pulse rounded bg-muted" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, j) => (
              <div
                key={j}
                className="h-32 animate-pulse rounded-lg border bg-muted/10"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
