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
|   +-- use-recipes.ts      # tRPC hooks for recipes
|   +-- use-recipe.ts       # tRPC hook for single recipe
|   +-- use-create-recipe.ts
|
+-- components
|   +-- recipe-list.tsx
|   +-- recipe-card.tsx
|   +-- recipe-form.tsx
|   +-- recipe-detail.tsx
|
+-- types
|   +-- index.ts           # recipe-related types
|
+-- utils
|   +-- recipe-helpers.ts  # recipe-specific utilities
```

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
            +-- recipes-page.tsx   # actual page component
            +-- recipe-detail-page.tsx
            +-- create-recipe-page.tsx
```

The page files in the app directory should be thin wrappers that import from features:

```tsx
// app/(authenticated)/recipes/page.tsx
import { RecipesPage } from '@/features/recipes/components/recipes-page';

export default function Page() {
  return <RecipesPage />;
}
```

## API Layer with tRPC

Since you're using tRPC in a monorepo, your API calls are type-safe across packages. In the features, create hooks that use the tRPC client:

```sh
src/features/recipes/api
|
+-- use-recipes.ts        # Lists recipes
+-- use-recipe.ts         # Get single recipe
+-- use-create-recipe.ts  # Create recipe mutation
+-- use-update-recipe.ts  # Update recipe mutation
+-- use-delete-recipe.ts  # Delete recipe mutation
```

Example:
```tsx
// src/features/recipes/api/use-recipes.ts
import { useTRPC } from '@/trpc/react';

export function useRecipes() {
  return useTRPC().recipe.all.useQuery();
}

export function useRecipesInfinite() {
  return useTRPC().recipe.infinite.useInfiniteQuery({
    limit: 10,
  });
}
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
+-- recipe-list.tsx          # Server Component (default)
+-- recipe-list-client.tsx   # Client Component (if needed)
+-- recipe-form.tsx          # Client Component (uses hooks)
```

Mark client components explicitly:
```tsx
'use client';

// Component that needs client-side features
```

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