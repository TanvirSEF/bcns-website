"use client"

import * as React from "react"
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
  Search,
  Database,
  FileBarChart,
  Building2,
} from "lucide-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

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
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: Users,
    },
    {
      title: "Content",
      url: "/admin/content",
      icon: FileText,
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
      title: "Get Help",
      url: "/admin/help",
      icon: HelpCircle,
    },
    {
      title: "Search",
      url: "/admin/search",
      icon: Search,
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
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/admin">
                <Building2 className="!size-5" />
                <span className="text-base font-semibold">BCNS Admin</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
