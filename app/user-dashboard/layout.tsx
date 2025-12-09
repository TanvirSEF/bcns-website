import { UserSidebar } from "@/components/dashboard/UserSidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
// AuthProvider removed - using the one from root layout to avoid duplicate contexts
import { ErrorBoundary } from "@/components/error-boundary"
import { UserAuthGuard } from "@/components/user-auth-guard"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import type { Metadata } from "next"

// Disable SSR for user dashboard pages
export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "BCNS User Dashboard",
  description: "User dashboard for Bangladesh Child Neurology Society members",
}

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ErrorBoundary>
      <UserAuthGuard>
        <SidebarProvider>
          <UserSidebar variant="inset" />
          <SidebarInset>
            <SiteHeader title="Member Dashboard" />
            <div className="flex flex-1 flex-col relative">
              <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-6 py-6 px-6 md:gap-8 md:py-8 md:px-8 relative">
                  {children}
                </div>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="mt-16"
        />
      </UserAuthGuard>
    </ErrorBoundary>
  )
}
