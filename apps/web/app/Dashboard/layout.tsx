"use client";

import { ChevronDown, Home, LayoutDashboard, MapPin, PlusCircle, Building, User, Building2Icon, House } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { TooltipProvider } from "@/components/ui/tooltip";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(`${path}/`);

  // Helper: check if any child route is active → keep parent expanded/highlighted
  const isSectionActive = (basePath: string) => pathname.startsWith(basePath);

  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={true}>
        <div className="group flex h-dvh w-full">
          <Sidebar collapsible="icon" className="border-r">
            <SidebarHeader className="border-b px-4 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Home className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold leading-none">Rent Ghar</span>
                  <span className="text-xs text-muted-foreground">Admin Dashboard</span>
                </div>
              </div>
            </SidebarHeader>

            <SidebarContent>
              {/* Main Navigation */}
              <SidebarGroup>
                <SidebarGroupLabel>Overview</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive("/dashboard")}>
                        <Link href="/dashboard">
                          <LayoutDashboard className="h-5 w-5" />
                          <span>Dashboard</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              {/* Properties Section with Submenu */}
              <Collapsible defaultOpen={isSectionActive("/dashboard/property")}>
                <SidebarGroup>
                  <SidebarGroupLabel asChild>
                    <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-2 text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <PlusCircle className="h-5 w-5" />
                        <span>Properties</span>
                      </div>
                      <ChevronDown className="h-4 w-4 transition-transform duration-200 [&[data-state=open]]:rotate-180" />
                    </CollapsibleTrigger>
                  </SidebarGroupLabel>

                  <CollapsibleContent>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        <SidebarMenuItem>
                          <SidebarMenuButton asChild isActive={isActive("/dashboard/property/add-property")}>
                            <Link href="/dashboard/property/add-property">
                              <span className="ml-7">Add New Property</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                          <SidebarMenuButton asChild isActive={isActive("/dashboard/property")}>
                            <Link href="/dashboard/property">
                              <span className="ml-7">All Properties</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>

                        {/* You can add more: Pending Approval, Featured, etc. */}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </CollapsibleContent>
                </SidebarGroup>
              </Collapsible>

              {/* Cities Section with Submenu */}
              <Collapsible defaultOpen={isSectionActive("/dashboard/city")}>
                <SidebarGroup>
                  <SidebarGroupLabel asChild>
                    <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-2 text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <House className="h-5 w-5" />
                        <span>Cities</span>
                      </div>
                      <ChevronDown className="h-4 w-4 transition-transform duration-200 [&[data-state=open]]:rotate-180" />
                    </CollapsibleTrigger>
                  </SidebarGroupLabel>
                  <CollapsibleContent>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        <SidebarMenuItem>
                          <SidebarMenuButton asChild isActive={isActive("/dashboard/city/add-city")}>
                            <Link href="/dashboard/city">
                              <span className="ml-7">Cities</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                          <SidebarMenuButton asChild isActive={isActive("/dashboard/area/add-area")}>
                            <Link href="/dashboard/city/add-city">
                              <span className="ml-7">Add city</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </CollapsibleContent>
                </SidebarGroup>
              </Collapsible>


              {/* Locations (Cities + Areas) with Submenu */}
              <Collapsible defaultOpen={isSectionActive("/dashboard/city") || isSectionActive("/dashboard/area")}>
                <SidebarGroup>
                  <SidebarGroupLabel asChild>
                    <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-2 text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        <span>Areas</span>
                      </div>
                      <ChevronDown className="h-4 w-4 transition-transform duration-200 [&[data-state=open]]:rotate-180" />
                    </CollapsibleTrigger>
                  </SidebarGroupLabel>

                  <CollapsibleContent>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        <SidebarMenuItem>
                          <SidebarMenuButton asChild isActive={isActive("/dashboard/city/add-city")}>
                            <Link href="/dashboard/area">
                              <span className="ml-7">Areas</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                          <SidebarMenuButton asChild isActive={isActive("/dashboard/area/add-area")}>
                            <Link href="/dashboard/area/add-area">
                              <span className="ml-7">Add Area</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </CollapsibleContent>
                </SidebarGroup>
              </Collapsible>

              {/* User Section at bottom */}
              <SidebarGroup className="mt-auto">
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive("/dashboard/user-account")}>
                        <Link href="/dashboard/user-account">
                          <User className="h-5 w-5" />
                          <span>User Account</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarRail />
          </Sidebar>

          {/* Main Content */}
          <SidebarInset className="flex flex-1 flex-col overflow-hidden">
            <header className="flex h-14 shrink-0 items-center gap-4 border-b bg-background px-6">
              <SidebarTrigger />
              {/* Add breadcrumb, search, user menu here later */}
            </header>

            <main className="flex-1 overflow-y-auto overflow-x-hidden p-6">{children}</main>

        </SidebarInset>
        </div>
      </SidebarProvider>
     
    </TooltipProvider>
  );
}