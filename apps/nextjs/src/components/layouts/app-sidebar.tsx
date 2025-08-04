"use client";

import * as React from "react";
import {
  IconDashboard,
  IconDatabase,
  IconInnerShadowTop,
  IconSettings,
  IconChefHat,
  IconCarrot,
} from "@tabler/icons-react";

import { NavMain } from "@/components/layouts/nav-main";
import { NavSecondary } from "@/components/layouts/nav-secondary";
import { NavUser } from "@/components/layouts/nav-user";
import { NavCollapsible } from "@/components/layouts/nav-collapsible";
import { NavAction } from "@/components/layouts/nav-action";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
  ],
  masterData: [
    {
      title: "Recipes",
      url: "/recipes",
      icon: IconChefHat,
    },
    {
      title: "Ingredients",
      url: "/ingredients",
      icon: IconCarrot,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: IconSettings,
    },
  ],
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  session: {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
    };
  };
}

export function AppSidebar({ session, ...props }: AppSidebarProps) {
  const user = {
    name: session.user.name ?? "User",
    email: session.user.email,
    avatar: session.user.image ?? "/avatars/shadcn.jpg",
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Menuplanner</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <NavCollapsible 
                title="Master Data" 
                items={data.masterData}
                icon={IconDatabase}
                defaultOpen={true}
              />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <NavSecondary items={data.navSecondary} />
        <div className="mt-auto">
          <NavAction />
        </div>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
