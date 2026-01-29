import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
  } from "@/components/ui/sidebar";
  import {
    LayoutDashboard,
    BookOpen,
    PlusCircle,
    Building,
    MapPin,
    User,
    ChevronDown,
    Image,
  } from "lucide-react";
  import Link from "next/link";
  import { usePathname } from "next/navigation";
  import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
  import { cn } from "@/lib/utils";
  
  export default function DashboardSidebar() {
    const pathname = usePathname();
  
    const isActive = (path: string) =>
      pathname === path || pathname.startsWith(`${path}/`);
  
    const isSectionActive = (base: string) => pathname.startsWith(base);
  
    const navItems = [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
        exact: true,
      },
    ];
  
    const blogSection = {
      title: "Blog",
      icon: BookOpen,
      basePath: "/dashboard/blog",
      items: [{ title: "All Posts", href: "/dashboard/blog" }],
    };
  
    const propertiesSection = {
      title: "Properties",
      icon: PlusCircle,
      basePath: "/dashboard/property",
      items: [
        { title: "All Properties", href: "/dashboard/property" },
        { title: "Add New Property", href: "/dashboard/property/add-property" },
      ],
    };
  
    const citiesSection = {
      title: "Cities",
      icon: Building,
      basePath: "/dashboard/city",
      items: [
        { title: "All Cities", href: "/dashboard/city" },
        { title: "Add New City", href: "/dashboard/city/add-city" },
      ],
    };
  
    const areasSection = {
      title: "Areas",
      icon: MapPin,
      basePath: "/dashboard/area",
      items: [
        { title: "All Areas", href: "/dashboard/area" },
        { title: "Add New Area", href: "/dashboard/area/add-area" },
      ],
    };

    const imagesGallerySection = {
      title: "Images Gallery",
      icon: Image,
      basePath: "/dashboard/images-gallery",
    }
  
    const accountSection = {
      title: "Account",
      icon: User,
      href: "/dashboard/user-account",
    };
  
    return (
      <Sidebar collapsible="icon" className="border-r">
        <SidebarHeader className="border-b px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Building className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold tracking-tight">Rent Ghar</span>
              <span className="text-xs text-muted-foreground font-medium">
                Admin Panel
              </span>
            </div>
          </div>
        </SidebarHeader>
  
        <SidebarContent>
          {/* Overview */}
          <SidebarGroup>
            
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive(item.href)}>
                      <Link href={item.href}>
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
            {/* <SidebarGroupLabel>Overview</SidebarGroupLabel> */}
          </SidebarGroup>

          {/* Blog Category */}
          <Collapsible defaultOpen={isSectionActive("/dashboard/blog/category")}>
            <SidebarGroup>
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel className="flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md transition-colors">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5" />
                    <span>Blog Category</span>
                  </div>
                  <ChevronDown className="h-4 w-4 transition-transform duration-200 [&[data-state=open]]:rotate-180" />
                </SidebarGroupLabel>
              </CollapsibleTrigger>
  
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu className="pl-3">
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive("/dashboard/blog-category")}>
                        <Link href="/dashboard/blog-category">
                          <span>All Categories</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
  
          {/* Blog */}
          <Collapsible defaultOpen={isSectionActive(blogSection.basePath)}>
            <SidebarGroup>
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel className="flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md transition-colors">
                  <div className="flex items-center gap-3">
                    <blogSection.icon className="h-5 w-5" />
                    <span>{blogSection.title}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 transition-transform duration-200 [&[data-state=open]]:rotate-180" />
                </SidebarGroupLabel>
              </CollapsibleTrigger>
  
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu className="pl-3">
                    {blogSection.items.map((item) => (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton asChild isActive={isActive(item.href)}>
                          <Link href={item.href}>
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
  
          {/* Properties */}
          <Collapsible defaultOpen={isSectionActive(propertiesSection.basePath)}>
            <SidebarGroup>
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel className="flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md transition-colors">
                  <div className="flex items-center gap-3">
                    <propertiesSection.icon className="h-5 w-5" />
                    <span>{propertiesSection.title}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 transition-transform duration-200 [&[data-state=open]]:rotate-180" />
                </SidebarGroupLabel>
              </CollapsibleTrigger>
  
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu className="pl-3">
                    {propertiesSection.items.map((item) => (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton asChild isActive={isActive(item.href)}>
                          <Link href={item.href}>
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
  
          {/* Cities & Areas */}
          <Collapsible
            defaultOpen={
              isSectionActive(citiesSection.basePath) ||
              isSectionActive(areasSection.basePath)
            }
          >
            <SidebarGroup>
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel className="flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md transition-colors">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5" />
                    <span>Locations</span>
                  </div>
                  <ChevronDown className="h-4 w-4 transition-transform duration-200 [&[data-state=open]]:rotate-180" />
                </SidebarGroupLabel>
              </CollapsibleTrigger>
  
              <CollapsibleContent>
                <SidebarGroupContent>
                  {/* Cities */}
                  <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                    Cities
                  </div>
                  <SidebarMenu className="pl-3 mb-2">
                    {citiesSection.items.map((item) => (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton asChild isActive={isActive(item.href)}>
                          <Link href={item.href}>
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
  
                  {/* Areas */}
                  <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                    Areas
                  </div>
                  <SidebarMenu className="pl-3">
                    {areasSection.items.map((item) => (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton asChild isActive={isActive(item.href)}>
                          <Link href={item.href}>
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>

          {/* Images Gallery */}
          <Collapsible defaultOpen={isSectionActive(imagesGallerySection.basePath)}>
            <SidebarGroup>
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel className="flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md transition-colors">
                  <div className="flex items-center gap-3">
                    <imagesGallerySection.icon className="h-5 w-5" />
                    <span>{imagesGallerySection.title}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 transition-transform duration-200 [&[data-state=open]]:rotate-180" />
                </SidebarGroupLabel>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu className="pl-3">
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive("/dashboard/images-gallery")}>
                        <Link href="/dashboard/images-gallery">
                          <span>All Images</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
          </Collapsible>
  
          {/* Account (bottom) */}
          <SidebarGroup className="mt-auto">
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive(accountSection.href)}>
                    <Link href={accountSection.href}>
                      <accountSection.icon className="h-5 w-5" />
                      <span>{accountSection.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
  
        <SidebarRail />
      </Sidebar>
    );
  }