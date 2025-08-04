# 📡 API Layer

### tRPC - End-to-End Type Safety

MenuPlanner uses tRPC for creating type-safe APIs. This means that your frontend and backend share types automatically, eliminating the need for code generation or manual type definitions.

The API is defined in the `packages/api` package and consumed by both the Next.js and Expo applications.

### API Structure

Your tRPC API is organized as follows:

```
packages/api/
├── src/
│   ├── root.ts        # Root router that combines all sub-routers
│   ├── trpc.ts        # tRPC setup with context, middleware
│   └── router/        # Individual routers for each domain
│       ├── auth.ts
│       ├── recipe.ts
│       ├── ingredient.ts
│       └── post.ts
```

### Define and Export Routers

Each feature has its own router file that exports procedures (queries and mutations):

[Router Definition Example Code]

### Using tRPC in the Application

The application uses `@tanstack/react-query` under the hood for:
- **Caching**: Automatic caching of server responses
- **Synchronization**: Background refetching to keep data fresh
- **Optimistic Updates**: Update UI before server confirmation
- **Query Invalidation**: Smart cache invalidation after mutations

[tRPC React Setup Example Code]

### Type Safety Benefits

With tRPC, you get:
- **Auto-completion**: Full IntelliSense support in your IDE
- **Type errors at compile time**: Catch errors before runtime
- **Refactoring confidence**: Change API signatures and see all affected code
- **No code generation**: Types are inferred automatically

[Type-Safe API Usage Example Code]

### Best Practices

1. **Organize by Feature**: Keep related procedures in the same router
2. **Use Middleware**: Implement authentication and validation in middleware
3. **Input Validation**: Always validate inputs using Zod schemas
4. **Error Handling**: Use tRPC's error handling for consistent error responses
5. **Optimistic Updates**: Implement optimistic updates for better UX

[Best Practices Example Code]