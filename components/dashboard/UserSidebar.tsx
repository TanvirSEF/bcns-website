"use client";

import * as React from "react";
import {
  User,
  Calendar,
  BookOpen,
  Users,
  Building2,
  FileText,
  FileCheck,
  Activity,
  Settings as SettingsIcon,
} from "lucide-react";
import { UserNavMain } from "./UserNavMain";
import { UserNavUser } from "./UserNavUser";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function UserSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  const [upcomingEventsCount, setUpcomingEventsCount] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    const fetchUpcomingEventsCount = async () => {
      try {
        const events = await api.events.getEvents(undefined, 100);
        const now = new Date();
        const upcomingCount = events.filter((event) => new Date(event.date) >= now).length;
        setUpcomingEventsCount(upcomingCount > 0 ? upcomingCount.toString() : undefined);
      } catch (error) {
        console.error("Failed to fetch upcoming events count:", error);
        // Don't show badge if API fails
        setUpcomingEventsCount(undefined);
      }
    };

    fetchUpcomingEventsCount();
  }, []);

  const data = {
    user: {
      name: user?.name || "Member User",
      email: user?.email || "member@bcns.org.bd",
      avatar: user?.profilePictureUrl || "/images/logo.png",
    },
    navMain: [
      {
        title: "My Profile",
        url: "/user-dashboard/profile",
        icon: User,
      },
      {
        title: "Events",
        url: "/user-dashboard/events",
        icon: Calendar,
        ...(upcomingEventsCount && { badge: upcomingEventsCount }),
      },
      {
        title: "Publications",
        url: "/user-dashboard/publications",
        icon: BookOpen,
      },
      {
        title: "Members",
        url: "/user-dashboard/members",
        icon: Users,
      },
      {
        title: "My CV",
        url: "/user-dashboard/cv",
        icon: FileCheck,
      },
      {
        title: "My Documents",
        url: "/user-dashboard/documents",
        icon: FileText,
      },
      {
        title: "My Activities",
        url: "/user-dashboard/activities",
        icon: Activity,
      },
      {
        title: "Settings",
        url: "/user-dashboard/settings",
        icon: SettingsIcon,
      },
    ],
  };
  return (
    <Sidebar collapsible="offcanvas" className="border-r bg-white shadow-sm" {...props}>
      <SidebarHeader className="border-b bg-gradient-to-r from-emerald-50 to-green-50 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-3 data-[slot=sidebar-menu-button]:hover:bg-white/50 data-[slot=sidebar-menu-button]:rounded-lg"
            >
              <a href="/user-dashboard" className="flex items-center gap-3 cursor-pointer">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-bold text-gray-900">BCNS</span>
                  <span className="text-xs text-gray-600 -mt-0.5">Member Portal</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-3 py-4">
        <UserNavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter className="border-t bg-gray-50/50 p-3">
        <UserNavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
