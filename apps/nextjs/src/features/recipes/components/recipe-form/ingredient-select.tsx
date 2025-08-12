"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  useGetIngredient,
  useSearchIngredients,
} from "@/features/recipes/api/use-recipes";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";

interface IngredientSelectProps {
  value?: string;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function IngredientSelect({
  value,
  onChange,
  placeholder = "Select ingredient...",
  className,
  disabled,
}: IngredientSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  // Fetch the selected ingredient by ID
  const { data: selectedIngredient } = useGetIngredient(value);

  // Fetch search results when searching
  const { data: searchResults } = useSearchIngredients(search);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled}
        >
          <span className="truncate">
            {selectedIngredient ? selectedIngredient.name : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search ingredients..."
            className="h-9"
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>No ingredient found.</CommandEmpty>
            <CommandGroup>
              {searchResults?.map((ingredient) => (
                <CommandItem
                  key={ingredient.id}
                  value={ingredient.name}
                  onSelect={() => {
                    onChange(
                      ingredient.id === value ? undefined : ingredient.id,
                    );
                    setOpen(false);
                  }}
                >
                  {ingredient.name}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === ingredient.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
