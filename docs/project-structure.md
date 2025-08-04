# 🗄️ Project Structure

Most of the code lives in the `src` folder and looks something like this:

```sh
src
|
+-- app               # application layer containing:
|   |                 # app router pages, layouts, and routing
|   +-- (routes)      # route groups for organization
|   +-- layout.tsx    # root layout
|   +-- page.tsx      # home page
|   +-- providers.tsx # client-side providers wrapper
+-- assets            # assets folder can contain all the static files such as images, fonts, etc.
|
+-- components        # shared components used across the entire application
|
+-- config            # global configurations, exported env variables etc.
|
+-- features          # feature based modules
|
+-- hooks             # shared hooks used across the entire application
|
+-- lib               # reusable libraries preconfigured for the application
|
+-- stores            # global state stores
|
+-- testing           # test utilities and mocks
|
+-- types             # shared types used across the application
|
+-- utils             # shared utility functions
```

For easy scalability and maintenance, organize most of the code within the features folder. Each feature folder should contain code specific to that feature, keeping things neatly separated. This approach helps prevent mixing feature-related code with shared components, making it simpler to manage and maintain the codebase compared to having many files in a flat folder structure. By adopting this method, you can enhance collaboration, readability, and scalability in the application's architecture.

A feature could have the following structure:

```sh
src/features/recipes
|
+-- api         # exported API request declarations and api hooks related to recipes
|
+-- assets      # assets folder can contain all the static files for recipes
|
+-- components  # components scoped to recipes feature
|
+-- hooks       # hooks scoped to recipes feature
|
+-- stores      # state stores for recipes feature
|
+-- types       # typescript types used within the recipes feature
|
+-- utils       # utility functions for recipes feature
```

NOTE: You don't need all of these folders for every feature. Only include the ones that are necessary for the feature.

## Example Feature Structure

Here's how the recipes feature might look in practice:

```sh
src/features/recipes
|
+-- api
|   +-- use-recipes.ts      # Combined hooks for all recipe operations
|
+-- components
|   +-- recipe-list/        # List view components
|   |   +-- recipe-list.tsx
|   |   +-- recipe-card.tsx
|   |   +-- recipe-table.tsx
|   |   +-- index.ts
|   |
|   +-- recipe-view/        # Detail view components
|   |   +-- recipe-view.tsx
|   |   +-- index.ts
|   |
|   +-- recipe-form/        # Shared form components
|   |   +-- recipe-form.tsx
|   |   +-- index.ts
|   |
|   +-- recipe-create/      # Create functionality
|   |   +-- recipe-create.tsx
|   |   +-- index.ts
|   |
|   +-- recipe-update/      # Update functionality
|   |   +-- recipe-update.tsx
|   |   +-- index.ts
|   |
|   +-- index.ts           # Barrel exports for all components
|
+-- types
|   +-- index.ts           # recipe-related types
|
+-- utils
|   +-- recipe-helpers.ts  # recipe-specific utilities
```

### Component Organization Pattern

The recipe feature demonstrates our recommended component organization pattern:

1. **Grouped by Functionality**: Components are organized into folders based on their purpose (list, view, form, create, update)
2. **Clear Naming**: Components use descriptive names that indicate their purpose (e.g., `recipe-list`, `recipe-view`)
3. **Barrel Exports**: Each folder has an `index.ts` file for cleaner imports
4. **Separation of Concerns**: 
   - Pure UI components (e.g., `recipe-form`) are separated from business logic
   - Wrapper components (e.g., `recipe-create`, `recipe-update`) handle data fetching and mutations

## Adapting to Next.js App Router

With Next.js App Router, your routes live in the `app` directory, but you should still keep your feature logic separate:

```sh
src
+-- app
|   +-- (authenticated)
|       +-- recipes
|           +-- page.tsx          # thin page component
|           +-- [id]
|               +-- page.tsx      # thin page component
|           +-- new
|               +-- page.tsx      # thin page component
|
+-- features
    +-- recipes
        +-- components
            +-- recipe-list/
                +-- recipe-table.tsx   # used in the list page
            +-- recipe-view/
                +-- recipe-view.tsx    # used in the detail page
            +-- recipe-create/
                +-- recipe-create.tsx  # used in the new page
            +-- recipe-update/
                +-- recipe-update.tsx  # used in the edit page
```

The page files in the app directory should be thin wrappers that import from features:

```tsx
// app/(authenticated)/recipes/page.tsx
import { RecipeTable } from '@/features/recipes/components/recipe-list';

export default function Page() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-6">
      <RecipeTable />
    </div>
  );
}

// app/(authenticated)/recipes/[id]/page.tsx
import { RecipeView } from '@/features/recipes/components/recipe-view';

export default function Page({ params }: { params: { id: string } }) {
  return <RecipeView recipeId={params.id} />;
}
```

## API Layer with tRPC

Since you're using tRPC in a monorepo, your API calls are type-safe across packages. In the features, we recommend consolidating related hooks in a single file for better maintainability:

```sh
src/features/recipes/api
|
+-- use-recipes.ts        # All recipe-related hooks in one file
```

Example:
```tsx
// src/features/recipes/api/use-recipes.ts
import { useTRPC } from '@/trpc/react';
import { useSuspenseQuery } from '@tanstack/react-query';

// Query hooks
export function useGetRecipes() {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.recipe.all.queryOptions());
}

export function useGetRecipe(id: string) {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.recipe.byId.queryOptions({ id: parseInt(id) }));
}

// Mutation hooks
export function useCreateRecipe() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  
  return useMutation(
    trpc.recipe.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.recipe.pathFilter());
        toast.success("Recipe created successfully");
      },
    }),
  );
}

export function useUpdateRecipe() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  
  return useMutation(
    trpc.recipe.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.recipe.pathFilter());
        toast.success("Recipe updated successfully");
      },
    }),
  );
}

export function useDeleteRecipe() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  
  return useMutation(
    trpc.recipe.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.recipe.pathFilter());
        toast.success("Recipe deleted successfully");
      },
    }),
  );
}

// Export types for convenience
export type Recipe = RouterOutputs['recipe']['all'][number];
export type RecipeDetail = RouterOutputs['recipe']['byId'];
```

## Import Path Configuration

Configure your `tsconfig.json` to use clean import paths:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/features/*": ["./src/features/*"],
      "@/components/*": ["./src/components/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/utils/*": ["./src/utils/*"],
      "@/types/*": ["./src/types/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/stores/*": ["./src/stores/*"]
    }
  }
}
```

## Cross-Feature Import Restrictions

It might not be a good idea to import across the features. Instead, compose different features at the application level. This way, you can ensure that each feature is independent which makes the codebase less convoluted.

To forbid cross-feature imports, you can use ESLint:

```js
'import/no-restricted-paths': [
    'error',
    {
        zones: [
            // disables cross-feature imports:
            // eg. src/features/recipes should not import from src/features/ingredients, etc.
            {
                target: './src/features/recipes',
                from: './src/features',
                except: ['./recipes'],
            },
            {
                target: './src/features/ingredients',
                from: './src/features',
                except: ['./ingredients'],
            },
            {
                target: './src/features/menus',
                from: './src/features',
                except: ['./menus'],
            },
            {
                target: './src/features/shopping-lists',
                from: './src/features',
                except: ['./shopping-lists'],
            },
            // More restrictions...
        ],
    },
],
```

## Unidirectional Codebase Architecture

You might also want to enforce unidirectional codebase architecture. This means that the code should flow in one direction, from shared parts of the code to the application (shared -> features -> app). This is a good practice to follow as it makes the codebase more predictable and easier to understand.

![Unidirectional Codebase](./assets/unidirectional-codebase.png)

To enforce this, you can use ESLint:

```js
'import/no-restricted-paths': [
    'error',
    {
    zones: [
        // Previous restrictions...

        // enforce unidirectional codebase:
        // e.g. src/app can import from src/features but not the other way around
        {
            target: './src/features',
            from: './src/app',
        },

        // e.g src/features and src/app can import from these shared modules but not the other way around
        {
            target: [
                './src/components',
                './src/hooks',
                './src/lib',
                './src/types',
                './src/utils',
            ],
            from: ['./src/features', './src/app'],
        },
    ],
    },
],
```

## Server Components and Client Components

With Next.js App Router, be mindful of the server/client boundary:

```sh
src/features/recipes/components
|
+-- recipe-list/
|   +-- recipe-list.tsx      # Client Component (uses suspense)
|   +-- recipe-card.tsx      # Client Component (uses hooks)
|   +-- recipe-table.tsx     # Client Component (interactive)
|
+-- recipe-view/
|   +-- recipe-view.tsx      # Client Component (uses hooks)
|
+-- recipe-form/
|   +-- recipe-form.tsx      # Client Component (form state)
|
+-- recipe-create/
|   +-- recipe-create.tsx    # Client Component (mutations)
|
+-- recipe-update/
|   +-- recipe-update.tsx    # Client Component (mutations)
```

Mark client components explicitly:
```tsx
'use client';

// Component that needs client-side features
```

### Key Patterns:

1. **Data Fetching**: Use hooks with suspense boundaries in page components
2. **Forms**: Always client components due to state management
3. **Interactive Elements**: Tables with sorting/filtering are client components
4. **Pure Display**: Can be server components if no interactivity is needed

## Shared Components

The `components` folder should only contain truly generic, reusable components:

```sh
src/components
|
+-- ui               # UI primitives from shadcn/ui
|   +-- button.tsx
|   +-- card.tsx
|   +-- dialog.tsx
|
+-- layouts          # Layout components
|   +-- dashboard-layout.tsx
|   +-- auth-layout.tsx
|
+-- common           # Common components
    +-- error-boundary.tsx
    +-- loading-spinner.tsx
```

By following these practices, you can ensure that your codebase is well-organized, scalable, and maintainable. This will help you and your team to work more efficiently and effectively on the project.