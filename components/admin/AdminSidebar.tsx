"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  FileText,
  Calendar,
  CreditCard,
  MessageSquare,
  BarChart3,
  Settings,
  HelpCircle,
  Database,
  FileBarChart,
  Building2,
} from "lucide-react";
import { NavMain } from "./NavMain";
import { NavSecondary } from "./NavSecondary";
import { NavDocuments } from "./NavDocuments";
import { NavUser } from "./NavUser";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "Admin User",
    email: "admin@bcns.org.bd",
    avatar: "/images/logo.png",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Members",
      url: "/admin/members",
      icon: UserCheck,
      badge: "5",
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: Users,
      badge: "12",
    },
    {
      title: "Content",
      url: "/admin/content",
      icon: FileText,
      badge: "8",
    },
    {
      title: "Events",
      url: "/admin/events",
      icon: Calendar,
    },
    {
      title: "Analytics",
      url: "/admin/analytics",
      icon: BarChart3,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/admin/settings",
      icon: Settings,
    },
    {
      title: "Help",
      url: "/admin/help",
      icon: HelpCircle,
    },
  ],
  documents: [
    {
      name: "Database",
      url: "/admin/database",
      icon: Database,
    },
    {
      name: "Reports",
      url: "/admin/reports",
      icon: FileBarChart,
    },
    {
      name: "Communications",
      url: "/admin/communications",
      icon: MessageSquare,
    },
    {
      name: "Payments",
      url: "/admin/payments",
      icon: CreditCard,
    },
  ],
};

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" className="border-r bg-white shadow-sm" {...props}>
      <SidebarHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-3 data-[slot=sidebar-menu-button]:hover:bg-white/50 data-[slot=sidebar-menu-button]:rounded-lg"
            >
              <a href="/admin" className="flex items-center gap-3 cursor-pointer">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-bold text-gray-900">BCNS</span>
                  <span className="text-xs text-gray-600 -mt-0.5">Admin Panel</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-3 py-4">
        <NavMain items={data.navMain} />
        <div className="my-4">
          <div className="px-2 py-2">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Management</h4>
          </div>
          <NavDocuments items={data.documents} />
        </div>
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter className="border-t bg-gray-50/50 p-3">
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}