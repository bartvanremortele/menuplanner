"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

import type { RouterOutputs } from "@menuplanner/api";
import { Button } from "~/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/ui/table";
import { Badge } from "~/ui/badge";

import { useTRPC } from "~/trpc/react";

export function RecipeTable() {
  const trpc = useTRPC();
  const { data: recipes } = useSuspenseQuery(trpc.recipe.all.queryOptions());

  if (recipes.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No recipes found.</p>
        <Button asChild className="mt-4">
          <Link href="/recipes/new">Create your first recipe</Link>
        </Button>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[400px]">Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recipes.map((recipe) => (
          <RecipeTableRow key={recipe.id} recipe={recipe} />
        ))}
      </TableBody>
    </Table>
  );
}

function RecipeTableRow({
  recipe,
}: {
  recipe: RouterOutputs["recipe"]["all"][number];
}) {
  return (
    <TableRow>
      <TableCell className="font-medium">
        <div>
          <div className="font-medium">{recipe.name}</div>
          <div className="text-sm text-muted-foreground line-clamp-1">
            {recipe.description}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline">Active</Badge>
      </TableCell>
      <TableCell>
        {new Date(recipe.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>View recipe</DropdownMenuItem>
            <DropdownMenuItem>Edit recipe</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Delete recipe
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}