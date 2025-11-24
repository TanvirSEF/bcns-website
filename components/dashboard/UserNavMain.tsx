"use client";

import { LayoutDashboard, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

export function UserNavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    badge?: string;
  }[];
}) {
  const pathname = usePathname();
  const isDashboardActive = pathname === "/user-dashboard";

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Dashboard"
              asChild
              isActive={isDashboardActive}
              className={`${
                isDashboardActive
                  ? "bg-emerald-600 text-white hover:bg-emerald-700 hover:text-white"
                  : "hover:bg-gray-100"
              } duration-200 ease-linear cursor-pointer`}
            >
              <a href="/user-dashboard" className="flex items-center gap-2 w-full">
                <LayoutDashboard />
                <span>Dashboard</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = pathname === item.url || pathname?.startsWith(item.url + "/");
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  tooltip={item.title} 
                  asChild
                  isActive={isActive}
                  className="cursor-pointer"
                >
                  <a href={item.url} className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </div>
                    {item.badge && (
                      <Badge 
                        variant={item.badge === "New" ? "default" : "secondary"} 
                        className={`ml-auto text-xs ${
                          item.badge === "New" 
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200" 
                            : ""
                        }`}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
