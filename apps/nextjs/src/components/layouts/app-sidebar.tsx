"use client";

import * as React from "react";
import { NavAction } from "@/components/layouts/nav-action";
import { NavCollapsible } from "@/components/layouts/nav-collapsible";
import { NavMain } from "@/components/layouts/nav-main";
import { NavSecondary } from "@/components/layouts/nav-secondary";
import { NavUser } from "@/components/layouts/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  IconCarrot,
  IconChefHat,
  IconDashboard,
  IconDatabase,
  IconInnerShadowTop,
  IconSettings,
} from "@tabler/icons-react";

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
