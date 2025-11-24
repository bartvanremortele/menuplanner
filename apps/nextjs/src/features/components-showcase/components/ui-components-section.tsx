"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertCircle,
  Bold,
  ChevronDown,
  Italic,
  Underline,
} from "lucide-react";

import { ComponentExample } from "./component-example";

export function UIComponentsSection() {
  return (
    <div className="space-y-8">
      {/* Buttons */}
      <ComponentExample
        title="Button"
        description="Displays a button or a component that looks like a button."
      >
        <div className="flex flex-wrap gap-4">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button disabled>Disabled</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
          <Button size="icon">
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </ComponentExample>

      {/* Badges */}
      <ComponentExample
        title="Badge"
        description="Displays a badge or a component that looks like a badge."
      >
        <div className="flex flex-wrap gap-4">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </ComponentExample>

      {/* Cards */}
      <ComponentExample
        title="Card"
        description="Displays a card with header, content, and footer."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card description goes here.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                This is the card content. You can put any content here.
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Action</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Simple Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                A simpler card without footer.
              </p>
            </CardContent>
          </Card>
        </div>
      </ComponentExample>

      {/* Avatar */}
      <ComponentExample
        title="Avatar"
        description="An image element with a fallback for representing the user."
      >
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
        </div>
      </ComponentExample>

      {/* Progress */}
      <ComponentExample
        title="Progress"
        description="Displays an indicator showing the completion progress of a task."
      >
        <div className="space-y-4">
          <Progress value={33} className="w-full" />
          <Progress value={66} className="w-full" />
          <Progress value={100} className="w-full" />
        </div>
      </ComponentExample>

      {/* Separator */}
      <ComponentExample
        title="Separator"
        description="Visually or semantically separates content."
      >
        <div className="space-y-4">
          <div>
            <p className="text-muted-foreground text-sm">
              Content above separator
            </p>
            <Separator className="my-4" />
            <p className="text-muted-foreground text-sm">
              Content below separator
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm">Item 1</span>
            <Separator orientation="vertical" className="h-4" />
            <span className="text-sm">Item 2</span>
            <Separator orientation="vertical" className="h-4" />
            <span className="text-sm">Item 3</span>
          </div>
        </div>
      </ComponentExample>

      {/* Skeleton */}
      <ComponentExample
        title="Skeleton"
        description="Use to show a placeholder while content is loading."
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      </ComponentExample>

      {/* Toggle */}
      <ComponentExample
        title="Toggle"
        description="A two-state button that can be either on or off."
      >
        <div className="flex items-center gap-4">
          <Toggle aria-label="Toggle italic">
            <Italic className="h-4 w-4" />
          </Toggle>
          <Toggle aria-label="Toggle bold" pressed>
            <Bold className="h-4 w-4" />
          </Toggle>
          <Toggle aria-label="Toggle underline" disabled>
            <Underline className="h-4 w-4" />
          </Toggle>
        </div>
      </ComponentExample>

      {/* Toggle Group */}
      <ComponentExample
        title="Toggle Group"
        description="A set of two-state buttons that can be toggled on or off."
      >
        <ToggleGroup type="single" defaultValue="bold">
          <ToggleGroupItem value="bold" aria-label="Toggle bold">
            <Bold className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Toggle italic">
            <Italic className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Toggle underline">
            <Underline className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </ComponentExample>

      {/* Dropdown Menu */}
      <ComponentExample
        title="Dropdown Menu"
        description="Displays a menu to the user — such as a set of actions or functions."
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Open Menu
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ComponentExample>

      {/* Tooltip */}
      <ComponentExample
        title="Tooltip"
        description="A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it."
      >
        <TooltipProvider>
          <div className="flex items-center gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Hover me</Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>This is a tooltip</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <AlertCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Icon with tooltip</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </ComponentExample>
    </div>
  );
}
