"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { FormSection } from "@/components/ui/form-section";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetUnits } from "@/features/recipes/api/use-recipes";
import { Plus, X } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { IngredientSelect } from "./ingredient-select";

export function RecipeIngredientsInput() {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  });

  const { data: units } = useGetUnits();

  const handleAddIngredient = () => {
    append({ ingredientId: undefined, amount: 1, unitAbbr: "g" });
  };

  const handleAddMultiple = () => {
    append({ ingredientId: undefined, amount: 1, unitAbbr: "g" });
    append({ ingredientId: undefined, amount: 1, unitAbbr: "g" });
    append({ ingredientId: undefined, amount: 1, unitAbbr: "g" });
  };

  return (
    <FormSection
      title="Ingredients"
      description="Add ingredients with their amounts and units"
      actions={
        <>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddIngredient}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Ingredient
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddMultiple}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add 3
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-start gap-2">
            <FormField
              control={control}
              name={`ingredients.${index}.ingredientId`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <IngredientSelect
                      value={field.value as string}
                      onChange={field.onChange}
                      placeholder="Select ingredient..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`ingredients.${index}.amount`}
              render={({ field }) => (
                <FormItem className="w-24">
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="Amount"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`ingredients.${index}.unitAbbr`}
              render={({ field }) => (
                <FormItem className="w-32">
                  <Select
                    value={field.value as string}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {units?.map((unit) => (
                        <SelectItem key={unit.abbr} value={unit.abbr}>
                          {unit.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {fields.length === 0 && (
        <div className="text-muted-foreground py-6 text-center">
          No ingredients added yet. Click "Add Ingredient" to start.
        </div>
      )}
    </FormSection>
  );
}
