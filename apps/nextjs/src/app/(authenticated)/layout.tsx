import { redirect } from "next/navigation";
import { getSession } from "~/auth/server";
import { AppSidebar } from "~/app/_components/app-sidebar";
import { SiteHeader } from "~/app/_components/site-header";
import {
  SidebarInset,
  SidebarProvider,
} from "~/app/_components/ui/sidebar";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "16rem",
          "--sidebar-width-icon": "3rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar session={session} />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}