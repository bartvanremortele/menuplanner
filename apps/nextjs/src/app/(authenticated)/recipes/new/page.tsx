import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { getSession } from "~/auth/server";
import { Button } from "~/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/ui/card";
import { CreateRecipeForm } from "../../../_components/recipes";

export default async function NewRecipePage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard">
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
          <CreateRecipeForm />
        </CardContent>
      </Card>
    </div>
  );
}