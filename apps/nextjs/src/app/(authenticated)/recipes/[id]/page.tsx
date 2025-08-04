import Link from "next/link";
import { Suspense } from "react";
import { Edit } from "lucide-react";
import { RecipeView } from "@/features/recipes/components/recipe-view";
import { Skeleton } from "@/components/ui/skeleton";
import { paths } from "@/config/paths";
import { 
  PageHeader, 
  PageHeaderActions, 
  PageHeaderAction 
} from "@/components/layouts/page-header";

export default function RecipeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="p-4 lg:p-6">
        <PageHeader
          title="Recipe Details"
          subtitle="View and manage recipe information"
          backButton={{
            href: paths.app.recipes.getHref(),
            label: "Back to recipes"
          }}
          actions={
            <PageHeaderActions>
              <PageHeaderAction 
                label="Edit Recipe" 
                icon={<Edit className="mr-2 size-4" />}
                asChild
              >
                <Link href={paths.app.recipes.edit.getHref(params.id)} />
              </PageHeaderAction>
            </PageHeaderActions>
          }
        />
      </div>

      <div className="flex-1 p-4 lg:p-6">
        <Suspense fallback={<RecipeDetailSkeleton />}>
          <RecipeView recipeId={params.id} />
        </Suspense>
      </div>
    </div>
  );
}

function RecipeDetailSkeleton() {
  return (
    <div className="max-w-4xl">
      <div className="px-4 sm:px-0">
        <Skeleton className="h-7 w-64" />
        <Skeleton className="mt-1 h-5 w-96" />
      </div>
      <div className="mt-6 border-t">
        <dl className="divide-y">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt>
                <Skeleton className="h-5 w-32" />
              </dt>
              <dd className="mt-1 sm:col-span-2 sm:mt-0">
                <Skeleton className="h-5 w-full max-w-md" />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}