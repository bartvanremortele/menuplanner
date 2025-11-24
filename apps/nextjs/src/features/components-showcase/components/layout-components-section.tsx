"use client";

import { useState } from "react";
import {
  PageHeader,
  PageHeaderAction,
  PageHeaderActions,
  PageHeaderMeta,
  PageHeaderMetaItem,
} from "@/components/layouts/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Briefcase,
  Calendar,
  Check,
  ChevronDown,
  DollarSign,
  Edit,
  Link2,
  MapPin,
  Plus,
} from "lucide-react";

import { ComponentExample } from "./component-example";

export function LayoutComponentsSection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <ComponentExample
        title="Page Header"
        description="A flexible page header component with title, subtitle, metadata, and actions."
      >
        <div className="space-y-6">
          {/* Simple Header */}
          <Card>
            <CardContent className="p-6">
              <h4 className="mb-4 text-sm font-medium">Simple Header</h4>
              <PageHeader
                title="Dashboard"
                subtitle="Welcome back! Here's what's happening with your recipes today."
              />
            </CardContent>
          </Card>

          {/* Header with Actions */}
          <Card>
            <CardContent className="p-6">
              <h4 className="mb-4 text-sm font-medium">Header with Actions</h4>
              <PageHeader
                title="Recipes"
                subtitle="Manage your recipe collection"
                actions={
                  <PageHeaderActions>
                    <PageHeaderAction
                      label="New Recipe"
                      icon={<Plus className="mr-2 size-4" />}
                      variant="default"
                      onClick={() => console.log("New recipe")}
                    />
                  </PageHeaderActions>
                }
              />
            </CardContent>
          </Card>

          {/* Header with Metadata */}
          <Card>
            <CardContent className="p-6">
              <h4 className="mb-4 text-sm font-medium">Header with Metadata</h4>
              <PageHeader
                title="Back End Developer"
                meta={
                  <PageHeaderMeta>
                    <PageHeaderMetaItem icon={Briefcase} label="Full-time" />
                    <PageHeaderMetaItem icon={MapPin} label="Remote" />
                    <PageHeaderMetaItem
                      icon={DollarSign}
                      label="$120k – $140k"
                    />
                    <PageHeaderMetaItem
                      icon={Calendar}
                      label="Closing on January 9, 2024"
                    />
                  </PageHeaderMeta>
                }
                actions={
                  <PageHeaderActions>
                    <PageHeaderAction
                      label="Edit"
                      icon={<Edit className="mr-2 size-5" />}
                      onClick={() => console.log("Edit")}
                    />
                    <PageHeaderAction
                      label="View"
                      icon={<Link2 className="mr-2 size-5" />}
                      onClick={() => console.log("View")}
                    />
                    <PageHeaderAction
                      label="Publish"
                      icon={<Check className="mr-2 size-5" />}
                      variant="default"
                      onClick={() => console.log("Publish")}
                    />
                  </PageHeaderActions>
                }
              />
            </CardContent>
          </Card>

          {/* Header with Back Button */}
          <Card>
            <CardContent className="p-6">
              <h4 className="mb-4 text-sm font-medium">
                Header with Back Button
              </h4>
              <PageHeader
                title="Recipe Details"
                subtitle="View and manage recipe information"
                backButton={{
                  href: "#",
                  label: "Back to recipes",
                }}
                actions={
                  <PageHeaderActions>
                    <PageHeaderAction
                      label="Edit Recipe"
                      icon={<Edit className="mr-2 size-4" />}
                      onClick={() => console.log("Edit recipe")}
                    />
                  </PageHeaderActions>
                }
              />
            </CardContent>
          </Card>
        </div>
      </ComponentExample>

      {/* Sheet */}
      <ComponentExample
        title="Sheet"
        description="Extends the Dialog component to display content that complements the main content of the screen."
      >
        <div className="flex gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Open Sheet (Right)</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Edit profile</SheetTitle>
                <SheetDescription>
                  Make changes to your profile here. Click save when you're
                  done.
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <p className="text-muted-foreground text-sm">
                  Sheet content goes here...
                </p>
              </div>
            </SheetContent>
          </Sheet>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Open Sheet (Left)</Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
                <SheetDescription>
                  Browse through the application
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <p className="text-muted-foreground text-sm">
                  Navigation items would go here...
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </ComponentExample>

      {/* Drawer */}
      <ComponentExample
        title="Drawer"
        description="A drawer component that slides in from the bottom of the screen."
      >
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline">Open Drawer</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Are you sure?</DrawerTitle>
              <DrawerDescription>
                This action cannot be undone.
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4">
              <p className="text-muted-foreground text-sm">
                Drawer content goes here. Perfect for mobile-first interactions.
              </p>
            </div>
            <DrawerFooter>
              <Button>Submit</Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </ComponentExample>

      {/* Collapsible */}
      <ComponentExample
        title="Collapsible"
        description="An interactive component which expands/collapses a panel."
      >
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="w-full space-y-2"
        >
          <div className="flex items-center justify-between space-x-4">
            <h4 className="text-sm font-semibold">
              @peduarte starred 3 repositories
            </h4>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-9 p-0">
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <div className="rounded-md border px-4 py-3 font-mono text-sm">
            @radix-ui/primitives
          </div>
          <CollapsibleContent className="space-y-2">
            <div className="rounded-md border px-4 py-3 font-mono text-sm">
              @radix-ui/colors
            </div>
            <div className="rounded-md border px-4 py-3 font-mono text-sm">
              @stitches/react
            </div>
          </CollapsibleContent>
        </Collapsible>
      </ComponentExample>
    </div>
  );
}
