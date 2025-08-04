import { 
  PageHeader, 
  PageHeaderMeta, 
  PageHeaderMetaItem,
  PageHeaderActions,
  PageHeaderAction 
} from "./";
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Calendar,
  Edit,
  Link2,
  Check,
  Plus
} from "lucide-react";
import Link from "next/link";

// Example 1: Job listing header (like the original example)
export function JobListingHeaderExample() {
  return (
    <PageHeader
      title="Back End Developer"
      meta={
        <PageHeaderMeta>
          <PageHeaderMetaItem icon={Briefcase} label="Full-time" />
          <PageHeaderMetaItem icon={MapPin} label="Remote" />
          <PageHeaderMetaItem icon={DollarSign} label="$120k – $140k" />
          <PageHeaderMetaItem icon={Calendar} label="Closing on January 9, 2020" />
        </PageHeaderMeta>
      }
      actions={
        <PageHeaderActions>
          <PageHeaderAction 
            label="Edit" 
            icon={<Edit className="mr-2 size-5" />}
            onClick={() => console.log("Edit clicked")}
          />
          <PageHeaderAction 
            label="View" 
            icon={<Link2 className="mr-2 size-5" />}
            href="/view"
          />
          <PageHeaderAction 
            label="Publish" 
            icon={<Check className="mr-2 size-5" />}
            variant="default"
            onClick={() => console.log("Publish clicked")}
          />
        </PageHeaderActions>
      }
    />
  );
}

// Example 2: Recipe list page header
export function RecipeListHeaderExample() {
  return (
    <PageHeader
      title="Recipes"
      subtitle="Manage your recipe collection"
      actions={
        <PageHeaderActions>
          <PageHeaderAction 
            label="New Recipe" 
            icon={<Plus className="mr-2 size-4" />}
            variant="default"
            asChild
          >
            <Link href="/recipes/new" />
          </PageHeaderAction>
        </PageHeaderActions>
      }
    />
  );
}

// Example 3: Recipe detail page header
export function RecipeDetailHeaderExample() {
  return (
    <PageHeader
      title="Chocolate Chip Cookies"
      meta={
        <PageHeaderMeta>
          <PageHeaderMetaItem icon={Calendar} label="Created on Dec 15, 2023" />
          <PageHeaderMetaItem icon={Briefcase} label="Dessert" />
        </PageHeaderMeta>
      }
      actions={
        <PageHeaderActions>
          <PageHeaderAction 
            label="Edit Recipe" 
            icon={<Edit className="mr-2 size-4" />}
            href="/recipes/123/edit"
          />
          <PageHeaderAction 
            label="Delete" 
            variant="destructive"
            onClick={() => console.log("Delete clicked")}
          />
        </PageHeaderActions>
      }
    />
  );
}

// Example 4: Simple header with just title and subtitle
export function SimpleHeaderExample() {
  return (
    <PageHeader
      title="Dashboard"
      subtitle="Welcome back! Here's what's happening with your recipes today."
    />
  );
}