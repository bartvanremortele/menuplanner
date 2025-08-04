import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { paths } from "@/config/paths";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RecipeCreate } from "@/features/recipes/components/recipe-create";

export default function NewRecipePage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={paths.app.recipes.getHref()}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h2 className="text-3xl font-bold tracking-tight">Create New Recipe</h2>
          <p className="text-muted-foreground">
            Add a new recipe to your collection
          </p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recipe Details</CardTitle>
          <CardDescription>
            Enter the details for your new recipe below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RecipeCreate />
        </CardContent>
      </Card>
    </div>
  );
}