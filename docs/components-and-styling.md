# 🧱 Components And Styling

MenuPlanner uses a modern approach to components and styling that leverages shadcn/ui for high-quality components and Tailwind CSS for utility-first styling. This combination provides a flexible, maintainable, and performant styling solution.

## Component Library Strategy

Instead of installing a large component library, MenuPlanner uses shadcn/ui's approach of copying component source code directly into the project. This provides several benefits:

- **Full control** over component behavior and styling
- **No dependency bloat** - only include what you use
- **Easy customization** without fighting library defaults
- **Type safety** with full TypeScript support

### Adding New Components

Use the UI add script to add new shadcn/ui components:

```bash
pnpm ui-add button
pnpm ui-add card dialog
```

Components are added to `src/components/ui/` and can be customized to match your design system.

## Component Organization

### Shared Components (`src/components`)

Generic, reusable components that are used across features:

```sh
src/components/
├── ui/                    # shadcn/ui components
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   └── form.tsx
├── layouts/              # Layout components
│   ├── dashboard-layout.tsx
│   └── auth-layout.tsx
└── common/               # Other shared components
    ├── error-boundary.tsx
    ├── loading-spinner.tsx
    └── data-table/
        ├── data-table.tsx
        └── columns.tsx
```

### Feature Components (`src/features/*/components`)

Components specific to a feature that shouldn't be used outside that feature:

```sh
src/features/recipes/components/
├── recipe-card.tsx
├── recipe-form.tsx
├── recipe-list.tsx
└── ingredient-selector.tsx
```

## Styling Approach

### Tailwind CSS Configuration

MenuPlanner uses Tailwind CSS v4 with a custom configuration that extends the default theme:

```js
// tailwind.config.ts
import type { Config } from "tailwindcss";
import baseConfig from "@menuplanner/tailwind-config/web";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  presets: [baseConfig],
  theme: {
    extend: {
      // Add custom colors, fonts, etc. as needed
    },
  },
} satisfies Config;
```

### Component Styling Patterns

#### Using cn() Utility

The `cn()` utility (class names) combines Tailwind classes with proper precedence:

```tsx
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline";
  size?: "sm" | "md" | "lg";
}

export function Button({ 
  className, 
  variant = "default", 
  size = "md",
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(
        // Base styles
        "inline-flex items-center justify-center rounded-md font-medium",
        // Variant styles
        variant === "default" && "bg-primary text-primary-foreground hover:bg-primary/90",
        variant === "destructive" && "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        // Size styles
        size === "sm" && "h-8 px-3 text-sm",
        size === "md" && "h-10 px-4",
        size === "lg" && "h-12 px-6 text-lg",
        // Allow custom classes to override
        className
      )}
      {...props}
    />
  );
}
```

## Component Best Practices

### 1. Composition Over Configuration

Build complex components by composing simpler ones:

```tsx
// ✅ Good: Composable components
<Card>
  <CardHeader>
    <CardTitle>Recipe Name</CardTitle>
    <CardDescription>Recipe description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Recipe details */}
  </CardContent>
  <CardFooter>
    <Button>Cook Now</Button>
  </CardFooter>
</Card>

// ❌ Avoid: Over-configured components
<RecipeCard
  title="Recipe Name"
  description="Recipe description"
  showFooter={true}
  footerButtons={[{ text: "Cook Now", onClick: handleCook }]}
/>
```

### 2. Prop Interfaces

Always define explicit prop interfaces:

```tsx
interface RecipeFormProps {
  recipe?: Recipe;
  onSubmit: (data: RecipeInput) => Promise<void>;
  onCancel: () => void;
}

export function RecipeForm({ recipe, onSubmit, onCancel }: RecipeFormProps) {
  // Component implementation
}
```

### 3. Accessibility

Ensure all interactive components are accessible:

```tsx
export function RecipeCard({ recipe, onSelect }: RecipeCardProps) {
  return (
    <article aria-label={`Recipe: ${recipe.name}`}>
      <button
        onClick={() => onSelect?.(recipe.id)}
        aria-label={`View details for ${recipe.name}`}
      >
        {/* Card content */}
      </button>
    </article>
  );
}
```

## Responsive Design

Use Tailwind's responsive utilities for mobile-first design:

```tsx
export function RecipeGrid({ recipes }: RecipeGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}
```

## Dark Mode Support

Components should support both light and dark modes using CSS variables and Tailwind's dark mode utilities:

```css
/* globals.css */
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  /* ... other variables */
}

.dark {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  /* ... other variables */
}
```

```tsx
// Components automatically adapt using CSS variables
<div className="bg-background text-foreground">
  Content adapts to light/dark mode
</div>
```

## Forms

For forms, use react-hook-form with zod validation:

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const recipeSchema = z.object({
  name: z.string().min(1, "Recipe name is required"),
  description: z.string().optional(),
  servings: z.number().min(1).max(100),
});

type RecipeFormData = z.infer<typeof recipeSchema>;

export function RecipeForm({ onSubmit }: RecipeFormProps) {
  const form = useForm<RecipeFormData>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      servings: 4,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recipe Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Other fields */}
        <Button type="submit">Save Recipe</Button>
      </form>
    </Form>
  );
}
```

## Loading States

Use consistent loading patterns:

```tsx
export function RecipeList() {
  const { data: recipes, isLoading } = useRecipes();

  if (isLoading) {
    return <RecipeListSkeleton />;
  }

  return (
    <div className="space-y-4">
      {recipes?.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}

// Skeleton component
export function RecipeListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-24 bg-muted animate-pulse rounded-md" />
      ))}
    </div>
  );
}
```

## Error States

Handle errors gracefully:

```tsx
export function RecipeList() {
  const { data: recipes, isLoading, error } = useRecipes();

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Failed to load recipes</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  // Rest of component
}
```

By following these patterns and practices, you'll create a consistent and maintainable component system for MenuPlanner.