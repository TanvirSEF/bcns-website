import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { AuthProvider } from "@/lib/auth-context"
import { ErrorBoundary } from "@/components/error-boundary"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import type { Metadata } from "next"

// Disable SSR for admin pages
export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "BCNS Admin Dashboard",
  description: "Admin dashboard for Bangladesh Child Neurology Society",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <SidebarProvider>
          <AppSidebar variant="inset" />
          <SidebarInset>
            <SiteHeader />
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
      </AuthProvider>
    </ErrorBoundary>
  )
}