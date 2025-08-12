# Reusable Data Table Component

A flexible and type-safe table component built on top of Tanstack Table v8, designed to work with any data model in your application.

## Features

- 🎯 Type-safe column definitions
- 🔍 Built-in search/filtering
- 📊 Sorting with visual indicators
- 📄 Pagination with customizable page sizes
- 👁️ Column visibility toggle
- ✅ Row selection
- 🎨 Consistent styling with shadcn/ui
- 📱 Responsive design

## Basic Usage

```tsx
import {
  createActionsColumn,
  createTextColumn,
  DataTable,
} from "~/app/_components/ui/data-table";

// Define your data type
type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

// Define columns
const columns = [
  createTextColumn<User>("name", "Name"),
  createTextColumn<User>("email", "Email"),
  createTextColumn<User>("role", "Role"),
  createActionsColumn<User>([
    { label: "Edit", onClick: (user) => console.log("Edit", user) },
    {
      label: "Delete",
      onClick: (user) => console.log("Delete", user),
      variant: "destructive",
    },
  ]),
];

// Use the table
export function UsersTable({ users }: { users: User[] }) {
  return (
    <DataTable
      columns={columns}
      data={users}
      searchKey="name" // Enable search on the name column
    />
  );
}
```

## Column Helpers

### createSelectColumn

Adds a checkbox column for row selection.

```tsx
const columns = [
  createSelectColumn<User>(),
  // ... other columns
];
```

### createTextColumn

Creates a text column with optional sorting and hiding.

```tsx
createTextColumn<User>("name", "Name", {
  enableSorting: true, // default: true
  enableHiding: true, // default: true
});
```

### createDateColumn

Creates a date column with automatic formatting.

```tsx
createDateColumn<User>("createdAt", "Created", "PP"); // Format: Jan 1, 2024
createDateColumn<User>("updatedAt", "Updated", "PPP"); // Format: January 1st, 2024
```

### createCustomColumn

Creates a column with custom cell rendering.

```tsx
createCustomColumn<User>("status", "Status", (user) => (
  <Badge variant={user.isActive ? "default" : "secondary"}>
    {user.isActive ? "Active" : "Inactive"}
  </Badge>
));
```

### createActionsColumn

Creates an actions dropdown menu column.

```tsx
createActionsColumn<User>([
  {
    label: "View Profile",
    onClick: (user) => router.push(`/users/${user.id}`),
  },
  {
    label: "Send Email",
    onClick: (user) => (window.location.href = `mailto:${user.email}`),
  },
  {
    label: "Delete",
    variant: "destructive",
    onClick: async (user) => {
      if (confirm("Are you sure?")) {
        await deleteUser(user.id);
      }
    },
  },
]);
```

## Advanced Usage

### Custom Column Definition

For more control, you can define columns manually:

```tsx
import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "~/app/_components/ui/data-table";

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return <div className="font-medium">{name}</div>;
    },
  },
];
```

### Row Click Handler

Make rows clickable for navigation or actions:

```tsx
<DataTable
  columns={columns}
  data={users}
  onRowClick={(row) => {
    router.push(`/users/${row.original.id}`);
  }}
/>
```

### Custom Page Size

```tsx
<DataTable
  columns={columns}
  data={users}
  defaultPageSize={20} // Default: 10
/>
```

## Complete Example: Recipe Table

```tsx
"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { ColumnDef } from "~/app/_components/ui/data-table";
import { Badge } from "~/app/_components/ui/badge";
import {
  createActionsColumn,
  createCustomColumn,
  createDateColumn,
  createSelectColumn,
  createTextColumn,
  DataTable,
} from "~/app/_components/ui/data-table";
import { useTRPC } from "~/trpc/react";

type Recipe = {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  labels?: { id: number; name: string }[];
};

export function RecipesTable() {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: recipes = [], isLoading } = trpc.recipe.all.useQuery();

  const deleteMutation = trpc.recipe.delete.useMutation({
    onSuccess: async () => {
      toast.success("Recipe deleted");
      await queryClient.invalidateQueries({ queryKey: ["recipe"] });
    },
  });

  const columns: ColumnDef<Recipe>[] = [
    createSelectColumn<Recipe>(),
    createTextColumn<Recipe>("name", "Name"),
    createTextColumn<Recipe>("description", "Description"),
    createCustomColumn<Recipe>("labels", "Labels", (recipe) => (
      <div className="flex gap-1">
        {recipe.labels?.map((label) => (
          <Badge key={label.id} variant="secondary">
            {label.name}
          </Badge>
        ))}
      </div>
    )),
    createDateColumn<Recipe>("createdAt", "Created", "PP"),
    createActionsColumn<Recipe>([
      {
        label: "Edit",
        onClick: (recipe) => router.push(`/recipes/${recipe.id}/edit`),
      },
      {
        label: "Delete",
        variant: "destructive",
        onClick: (recipe) => {
          if (confirm(`Delete "${recipe.name}"?`)) {
            deleteMutation.mutate({ id: recipe.id });
          }
        },
      },
    ]),
  ];

  if (isLoading) return <div>Loading...</div>;

  return (
    <DataTable
      columns={columns}
      data={recipes}
      searchKey="name"
      onRowClick={(row) => router.push(`/recipes/${row.original.id}`)}
    />
  );
}
```

## Styling

The table uses your app's theme and shadcn/ui components. To customize:

1. Modify the table components in `~/app/_components/ui/table`
2. Update the button, dropdown, and other UI components used
3. Apply custom classes to column definitions

## Tips

1. **Performance**: For large datasets, implement server-side pagination and filtering
2. **Loading States**: Show skeletons or loading indicators while fetching data
3. **Empty States**: Customize the "No results" message for better UX
4. **Accessibility**: The table includes proper ARIA labels and keyboard navigation
5. **Mobile**: Consider hiding less important columns on small screens using `enableHiding`
