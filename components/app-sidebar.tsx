"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Users,
  UserCheck,
  FileText,
  Calendar,
  BarChart3,
  Search,
  Building2,
  Image,
  BookOpen,
  Video,
  Activity,
  Mail,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
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
    avatar: "/images/logov2.jpg",
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
      title: "Events",
      url: "/admin/events",
      icon: Calendar,
    },
    {
      title: "Documents",
      url: "/admin/documents",
      icon: FileText,
    },
    {
      title: "Gallery",
      url: "/admin/gallery",
      icon: Image,
    },
    {
      title: "Publications",
      url: "/admin/publications",
      icon: BookOpen,
    },
    {
      title: "Polls",
      url: "/admin/polls",
      icon: BarChart3,
    },
    {
      title: "Promotional Emails",
      url: "/admin/promotional-emails",
      icon: Mail,
    },
    {
      title: "Zoom Meetings",
      url: "/admin/zoom",
      icon: Video,
    },
    {
      title: "Activity Logs",
      url: "/admin/logs",
      icon: Activity,
    },
    {
      title: "Search & Analytics",
      url: "/admin/search",
      icon: Search,
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
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}

