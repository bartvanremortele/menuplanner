# ⚙️ Project Standards

Enforcing project standards is crucial for maintaining code quality, consistency, and scalability in a React application. By establishing and adhering to a set of best practices, developers can ensure that the codebase remains clean, organized, and easy to maintain.

## ESLint

ESLint serves as a valuable linting tool for JavaScript and TypeScript, helping developers in maintaining code quality and adhering to coding standards. By configuring rules in the `.eslintrc.js` file, ESLint helps identify and prevent common errors, ensuring code correctness and promoting consistency throughout the codebase.

### MenuPlanner ESLint Configuration

```js
// apps/nextjs/eslint.config.js
import baseConfig from "@menuplanner/eslint-config/base";
import nextjsConfig from "@menuplanner/eslint-config/nextjs";
import reactConfig from "@menuplanner/eslint-config/react";

export default [
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  {
    rules: {
      // Project-specific rules
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            // Enforce feature isolation
            {
              target: './src/features/*',
              from: './src/features/*',
              except: ['./src/features/*'],
            },
            // Enforce unidirectional flow
            {
              target: './src/features',
              from: './src/app',
            },
          ],
        },
      ],
    },
  },
];
```

## Prettier

Prettier is a powerful tool for maintaining consistent code formatting across your project. By enabling the "format on save" feature in your IDE, code is automatically formatted according to the rules set in the `.prettierrc` configuration file.

### MenuPlanner Prettier Configuration

```json
{
  "endOfLine": "lf",
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "es5",
  "importOrder": [
    "^react",
    "^next",
    "^@menuplanner/(.*)$",
    "^@/(.*)$",
    "^[./]"
  ],
  "importOrderSeparation": true,
  "importOrderSortSpecifiers": true,
  "plugins": ["@trivago/prettier-plugin-sort-imports"]
}
```

## TypeScript

TypeScript is essential for catching type-related issues early in development. MenuPlanner uses strict TypeScript configuration to ensure maximum type safety across the entire codebase.

### TypeScript Configuration

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "ES2022"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "preserve",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Type Safety Best Practices

1. **Avoid `any` types**: Use `unknown` when type is truly unknown
2. **Enable strict mode**: All strict flags should be enabled
3. **Use type inference**: Let TypeScript infer types when obvious
4. **Define explicit return types**: For public APIs and complex functions
5. **Use discriminated unions**: For complex state management

## Husky & Git Hooks

Husky is configured to run quality checks before commits and pushes, ensuring that only high-quality code makes it into the repository.

### Pre-commit Hook

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run type checking
pnpm typecheck

# Run linting
pnpm lint

# Run formatting check
pnpm format
```

### Pre-push Hook

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run tests
pnpm test

# Run build to ensure it doesn't break
pnpm build
```

## Absolute Imports

Absolute imports are configured to make imports cleaner and more maintainable. When you move files around, the imports remain intact.

### Configuration

For Next.js applications:

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/features/*": ["./src/features/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/types/*": ["./src/types/*"],
      "@/utils/*": ["./src/utils/*"]
    }
  }
}
```

### Import Examples

```typescript
// ❌ Avoid relative imports
import { Button } from '../../../components/ui/button';
import { useRecipes } from '../../../../features/recipes/hooks/use-recipes';

// ✅ Use absolute imports
import { Button } from '@/components/ui/button';
import { useRecipes } from '@/features/recipes/hooks/use-recipes';
```

## File Naming Conventions

Consistent file naming makes the codebase easier to navigate and understand.

### ESLint Rules for File Naming

```js
'check-file/filename-naming-convention': [
  'error',
  {
    '**/*.{ts,tsx}': 'KEBAB_CASE',
    '**/*.{js,jsx}': 'KEBAB_CASE',
  },
  {
    ignoreMiddleExtensions: true,
  },
],
'check-file/folder-naming-convention': [
  'error',
  {
    'src/**/!(__tests__)': 'KEBAB_CASE',
  },
],
```

### Naming Convention Guidelines

- **Components**: `recipe-card.tsx` (kebab-case)
- **Hooks**: `use-recipes.ts` (use- prefix, kebab-case)
- **Utilities**: `format-date.ts` (kebab-case)
- **Types**: `recipe.types.ts` (kebab-case with .types suffix)
- **Tests**: `recipe-card.test.tsx` (match source file with .test suffix)
- **Stories**: `recipe-card.stories.tsx` (match source file with .stories suffix)

## Code Quality Standards

### Component Standards

1. **Functional Components Only**: Use function declarations for components
2. **Props Interface**: Define explicit props interfaces
3. **Default Exports**: Avoid default exports for better refactoring

```typescript
// ❌ Avoid
export default function Component(props: any) {
  return <div>{props.children}</div>;
}

// ✅ Prefer
interface RecipeCardProps {
  recipe: Recipe;
  onSelect?: (id: string) => void;
}

export function RecipeCard({ recipe, onSelect }: RecipeCardProps) {
  return <div>{recipe.name}</div>;
}
```

### Async/Await Standards

Always use async/await over promises for better readability:

```typescript
// ❌ Avoid
function getRecipes() {
  return fetch('/api/recipes')
    .then(res => res.json())
    .then(data => data.recipes);
}

// ✅ Prefer
async function getRecipes() {
  const res = await fetch('/api/recipes');
  const data = await res.json();
  return data.recipes;
}
```

### Error Handling Standards

Always handle errors explicitly:

```typescript
// ✅ Good error handling
try {
  const recipes = await api.recipe.getAll();
  return recipes;
} catch (error) {
  console.error('Failed to fetch recipes:', error);
  throw new Error('Unable to load recipes. Please try again later.');
}
```

## Commit Message Standards

Follow the Conventional Commits specification:

```
feat(recipes): add ingredient substitution feature
fix(auth): resolve Google OAuth redirect issue
docs(readme): update deployment instructions
style(ui): format recipe cards for mobile
refactor(api): simplify recipe query logic
test(recipes): add unit tests for recipe form
chore(deps): update Next.js to v15
```

## Documentation Standards

1. **Component Documentation**: Use JSDoc for complex components
2. **Function Documentation**: Document public APIs and complex logic
3. **README Files**: Each feature should have its own README
4. **Type Documentation**: Document complex types and interfaces

```typescript
/**
 * Recipe card component that displays recipe summary information
 * @param recipe - The recipe data to display
 * @param onSelect - Optional callback when recipe is selected
 */
export function RecipeCard({ recipe, onSelect }: RecipeCardProps) {
  // Component implementation
}
```

By following these standards, the MenuPlanner codebase remains consistent, maintainable, and scalable as the team and application grow.