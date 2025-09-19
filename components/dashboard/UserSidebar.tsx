"use client";

import * as React from "react";
import {
  User,
  Calendar,
  BookOpen,
  Users,
  Award,
  MessageSquare,
  Settings,
  HelpCircle,
  Heart,
  Building2,
  Activity,
  FileText,
} from "lucide-react";
import { UserNavMain } from "./UserNavMain";
import { UserNavSecondary } from "./UserNavSecondary";
import { UserNavDocuments } from "./UserNavDocuments";
import { UserNavUser } from "./UserNavUser";
import { useAuth } from "@/lib/auth-context";
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
        url: "/activities/conference",
        icon: Calendar,
        badge: "3",
      },
      {
        title: "Publications",
        url: "/activities/research",
        icon: BookOpen,
        badge: "New",
      },
      {
        title: "Members",
        url: "/members",
        icon: Users,
      },
      {
        title: "My Activities",
        url: "/user-dashboard/activities",
        icon: Activity,
      },
    ],
    navSecondary: [
      {
        title: "Settings",
        url: "/user-dashboard/settings",
        icon: Settings,
      },
      {
        title: "Help & Support",
        url: "/contact",
        icon: HelpCircle,
      },
    ],
    documents: [
      {
        name: "My Documents",
        url: "/user-dashboard/documents",
        icon: FileText,
      },
      {
        name: "Certificates",
        url: "/user-dashboard/certificates",
        icon: Award,
      },
      {
        name: "Communications",
        url: "/user-dashboard/messages",
        icon: MessageSquare,
      },
      {
        name: "Favorites",
        url: "/user-dashboard/favorites",
        icon: Heart,
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
              <a href="/user-dashboard" className="flex items-center gap-3">
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
        <div className="my-4">
          <div className="px-2 py-2">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">My Resources</h4>
          </div>
          <UserNavDocuments items={data.documents} />
        </div>
        <UserNavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter className="border-t bg-gray-50/50 p-3">
        <UserNavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
