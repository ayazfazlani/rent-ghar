"use client";

import { ChevronDown, Home, LayoutDashboard, MapPin, PlusCircle, Building, User, Building2Icon, House, Book } from "lucide-react";
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
import DashboardSidebar from "../layout/components/dashboard/sidebar";

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
          <DashboardSidebar />

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