"use client"

import { type LucideIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
  }[]
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            // Exact match only - no nested route support for better UX
            // Special case for dashboard: only active on exact /admin path
            const isActive = pathname === item.url
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={isActive}
                  className={cn(
                    "min-w-0 cursor-pointer transition-colors duration-200",
                    isActive &&
                      "[&[data-active=true]]:!bg-gray-900 [&[data-active=true]]:!text-white [&[data-active=true]]:hover:!bg-gray-800 [&[data-active=true]]:hover:!text-white"
                  )}
                  style={
                    isActive
                      ? {
                          backgroundColor: "#111827", // gray-900
                          color: "#ffffff", // white
                        }
                      : undefined
                  }
                >
                  <a
                    href={item.url}
                    className={cn(
                      "flex items-center gap-2 w-full",
                      isActive && "text-white"
                    )}
                    style={
                      isActive
                        ? {
                            color: "#ffffff",
                          }
                        : undefined
                    }
                  >
                    {item.icon && (
                      <item.icon
                        className={cn(
                          "shrink-0 size-4",
                          isActive ? "text-white" : "text-muted-foreground"
                        )}
                        style={
                          isActive
                            ? {
                                color: "#ffffff",
                              }
                            : undefined
                        }
                      />
                    )}
                    <span className="truncate text-sm">{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
