import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { ErrorBoundary } from "@/components/error-boundary";
import { cn } from "@/lib/utils";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BCNS - Bangladesh Child Neurology Society",
  description:
    "Official website of the Bangladesh Child Neurology Society (BCNS).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(geistSans.variable, "antialiased min-h-screen")}>
        <ErrorBoundary>
          <AuthProvider>
            {children}
            <ToastContainer
              position="top-right"
              newestOnTop
              closeOnClick
              pauseOnHover={false}
            />
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
