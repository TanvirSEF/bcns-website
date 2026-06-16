"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { UserRole } from "@/types/api";
import {
  Menu,
  ChevronDown,
  User,
  Shield,
  Users,
  Calendar,
  BookOpen,
  Award,
  LogOut,
  LayoutDashboard,
  Phone,
  BellRing,
  Home,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navigationItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "About Us", href: "/about", icon: Shield },
  {
    name: "Committee",
    href: "/committee",
    hasDropdown: true,
    icon: Users,
    dropdownItems: [
      { name: "Executive Committee", href: "/committee/executive", icon: Shield },
      { name: "Convening Committee", href: "/committee/convening", icon: Users },
      { name: "BCNS Member", href: "/committee/member", icon: User },
    ],
  },
  {
    name: "Activities",
    href: "/activities",
    hasDropdown: true,
    icon: Calendar,
    dropdownItems: [
      { name: "Research", href: "/research", icon: BookOpen },
      { name: "Conference", href: "/conference", icon: Award },
      { name: "Gallery", href: "/gallery", icon: Users },
    ],
  },
  { name: "Contact us", href: "/contact", icon: Phone },
  { name: "Notice", href: "/notice-board", icon: BellRing },
  { name: "Our Members", href: "/members", icon: Users, requiresAuth: true },
];

export function NavbarClient() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const dashboardHref = user?.role === UserRole.ADMIN ? "/admin" : "/user-dashboard";

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);



  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const ActionButtons = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div
      className={cn(
        "flex items-center gap-3",
        isMobile && "flex-col w-full pt-6 border-t border-gray-200 mt-6"
      )}
    >
      {isAuthenticated ? (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "h-8 w-8 rounded-full border-2 border-blue-600 p-0 overflow-hidden",
                  isMobile && "w-full h-10 rounded-md justify-start p-2"
                )}
              >
                {isMobile ? (
                  <>
                    {user?.profilePictureUrl || user?.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={
                          (user?.profilePictureUrl as string) ||
                          (user?.avatar as string)
                        }
                        alt="Avatar"
                        className="mr-2 h-6 w-6 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <User className="mr-2 h-4 w-4 flex-shrink-0" />
                    )}
                    {user?.name || "User Menu"}
                  </>
                ) : (
                  <>
                    {user?.profilePictureUrl || user?.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={
                          (user?.profilePictureUrl as string) ||
                          (user?.avatar as string)
                        }
                        alt="Avatar"
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 rounded-lg"
              side="bottom"
              align="end"
              sideOffset={8}
              alignOffset={-10}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center justify-start gap-2 p-3 border-b border-gray-200">
                  <div className="flex-shrink-0">
                    {user?.profilePictureUrl || user?.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={
                          (user?.profilePictureUrl as string) ||
                          (user?.avatar as string)
                        }
                        alt="Profile"
                        className="h-10 w-10 rounded-full object-cover border-2 border-blue-200"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-200">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col space-y-1 leading-none min-w-0 flex-1">
                    <p className="font-medium truncate">{user?.name}</p>
                    <p className="truncate text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href={dashboardHref} className="flex items-center">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
              {user?.role !== UserRole.ADMIN && (
                <DropdownMenuItem asChild>
                  <Link href="/user-dashboard/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <>
          <Button
            asChild
            className="w-full lg:w-auto bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Link href="/login">
              <User className="mr-2 h-4 w-4" />
              Login
            </Link>
          </Button>

          <Button
            asChild
            className="w-full lg:w-auto bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Link href="/membership">
              <Shield className="mr-2 h-4 w-4" /> Membership
            </Link>
          </Button>
        </>
      )}
    </div>
  );

  const visibleNavItems = navigationItems.filter(
    (item) => !item.requiresAuth || isAuthenticated
  );

  return (
    <>
      <header className="sticky top-0 z-50 w-full">
        <div
          className={cn(
            "transition-all duration-300 bg-white border-b",
            isScrolled
              ? "shadow-lg border-gray-200"
              : "shadow-md border-gray-200"
          )}
        >
          <div className="container mx-auto px-3 sm:px-4 md:px-6">
            <div className="flex items-center justify-between h-14 sm:h-16">
              <nav className="hidden lg:flex items-center space-x-1">
                {visibleNavItems.map((item) => (
                  <div key={item.name} className="relative">
                    {item.hasDropdown ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className={cn(
                              "h-12 px-6 flex items-center cursor-pointer text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium rounded-lg transition-all duration-200 border-0 bg-transparent",
                              isActive(item.href!) && "text-blue-600 bg-blue-50"
                            )}
                          >
                            {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                            {item.name}
                            <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-200" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          className="w-64 rounded-lg"
                          side="bottom"
                          align="start"
                          sideOffset={4}
                        >
                          {item.dropdownItems?.map((dropdownItem) => (
                            <DropdownMenuItem key={dropdownItem.name} asChild>
                              <Link
                                href={dropdownItem.href}
                                className="flex items-center w-full cursor-pointer"
                              >
                                {dropdownItem.icon && (
                                  <dropdownItem.icon className="mr-3 h-4 w-4 text-gray-400" />
                                )}
                                {dropdownItem.name}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <Link
                        href={item.href!}
                        className={cn(
                          "h-12 px-6 flex items-center text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium rounded-lg transition-all duration-200 relative cursor-pointer",
                          isActive(item.href!) && "text-blue-600 bg-blue-50",
                          item.name === "Notice" && "text-red-500 hover:text-red-600"
                        )}
                      >
                        {item.icon && (
                          <item.icon className={cn(
                            "mr-2 h-4 w-4",
                            item.name === "Notice" && "animate-pulse text-red-500 fill-red-500"
                          )} />
                        )}
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>

              <div className="hidden lg:flex items-center gap-3 xl:gap-4">
                {/* Search Button */}
                <Button
                  onClick={() => setIsSearchOpen(true)}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 xl:h-9 xl:w-9 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200"
                  aria-label="Open search"
                >
                  <Search className="h-3 w-3 xl:h-4 xl:w-4" />
                </Button>

                {/* Login and Membership Buttons - Only show when not authenticated */}
                {!isAuthenticated && (
                  <>
                    <Button
                      asChild
                      className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <Link href="/login">
                        <User className="mr-2 h-4 w-4" />
                        Login
                      </Link>
                    </Button>

                    <Button
                      asChild
                      variant="outline"
                      className="border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200"
                    >
                      <Link href="/membership">
                        <Shield className="mr-2 h-4 w-4" />
                        Membership
                      </Link>
                    </Button>
                  </>
                )}

                {/* User Profile - Only show when authenticated */}
                {isAuthenticated && <ActionButtons />}
              </div>

              <div className="lg:hidden flex items-center justify-between w-full">
                {/* Left side - Hamburger Menu */}
                <Sheet
                  open={isMobileMenuOpen}
                  onOpenChange={setIsMobileMenuOpen}
                >
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
                      <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader className="p-4 border-b">
                      <SheetTitle>Menu</SheetTitle>
                    </SheetHeader>
                    <nav className="p-4">
                      <Accordion type="single" collapsible className="w-full">
                        {visibleNavItems.map((item) =>
                          item.hasDropdown ? (
                            <AccordionItem value={item.name} key={item.name}>
                              <AccordionTrigger className="py-3 text-base font-medium">
                                <div className="flex items-center">
                                  {item.icon && (
                                    <item.icon className={cn(
                                      "mr-2 h-4 w-4",
                                      item.name === "Notice" && "animate-pulse text-red-500 fill-red-500"
                                    )} />
                                  )}
                                  {item.name}
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="pl-4">
                                {item.dropdownItems?.map((dropdownItem) => (
                                  <Link
                                    key={dropdownItem.name}
                                    href={dropdownItem.href}
                                    className="block py-2 text-base font-medium flex items-center"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                  >
                                    {dropdownItem.icon && (
                                      <dropdownItem.icon className="mr-2 h-4 w-4 text-gray-400" />
                                    )}
                                    {dropdownItem.name}
                                  </Link>
                                ))}
                              </AccordionContent>
                            </AccordionItem>
                          ) : (
                            <Link
                              key={item.name}
                              href={item.href!}
                              className={cn(
                                "block py-3 text-base font-medium flex items-center cursor-pointer",
                                isActive(item.href!) && "text-blue-600 font-semibold",
                                item.name === "Notice" && "text-red-500"
                              )}
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {item.icon && (
                                <item.icon className={cn(
                                  "mr-2 h-4 w-4",
                                  item.name === "Notice" && "animate-pulse text-red-500 fill-red-500"
                                )} />
                              )}
                              {item.name}
                            </Link>
                          )
                        )}
                      </Accordion>

                      {/* Mobile action buttons - only show for non-authenticated users */}
                      {!isAuthenticated && (
                        <div className="flex flex-col w-full pt-6 border-t border-gray-200 mt-6 gap-3">
                          <Button
                            asChild
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <Link
                              href="/login"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <User className="mr-2 h-4 w-4" />
                              Login
                            </Link>
                          </Button>

                          <Button
                            asChild
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                          >
                            <Link
                              href="/membership"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <Shield className="mr-2 h-4 w-4" />
                              Membership
                            </Link>
                          </Button>
                        </div>
                      )}
                    </nav>
                  </SheetContent>
                </Sheet>

                {/* Right side - Login and Membership Buttons */}
                <div className="flex items-center gap-2">
                  {/* Mobile Login and Membership Buttons - Only show when not authenticated */}
                  {!isAuthenticated && (
                    <>
                      {/* Login Button */}
                      <Button
                        asChild
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm h-9 px-4 text-sm font-medium"
                      >
                        <Link href="/login">
                          <User className="mr-1.5 h-4 w-4" />
                          Login
                        </Link>
                      </Button>

                      {/* Membership Button */}
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 h-9 px-4 text-sm font-medium"
                      >
                        <Link href="/membership">
                          <Shield className="mr-1.5 h-4 w-4" />
                          Membership
                        </Link>
                      </Button>
                    </>
                  )}

                  {/* Mobile user profile */}
                  {isAuthenticated && user && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-7 w-7 sm:h-8 sm:w-8 rounded-full border-2 border-blue-600 p-0 overflow-hidden"
                        >
                          {user?.profilePictureUrl || user?.avatar ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={
                                (user?.profilePictureUrl as string) ||
                                (user?.avatar as string)
                              }
                              alt="Avatar"
                              className="h-full w-full rounded-full object-cover"
                            />
                          ) : (
                            <User className="h-4 w-4" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="w-56 rounded-lg"
                        side="bottom"
                        align="end"
                        sideOffset={8}
                        alignOffset={-10}
                      >
                        <DropdownMenuLabel className="p-0 font-normal">
                          <div className="flex items-center justify-start gap-2 p-3 border-b border-gray-200">
                            <div className="flex-shrink-0">
                              {user?.profilePictureUrl || user?.avatar ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={
                                    (user?.profilePictureUrl as string) ||
                                    (user?.avatar as string)
                                  }
                                  alt="Profile"
                                  className="h-10 w-10 rounded-full object-cover border-2 border-blue-200"
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-200">
                                  <User className="h-5 w-5 text-blue-600" />
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col space-y-1 leading-none min-w-0 flex-1">
                              <p className="font-medium truncate">{user?.name}</p>
                              <p className="truncate text-sm text-gray-500">
                                {user?.email}
                              </p>
                            </div>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={dashboardHref} className="flex items-center">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Dashboard
                          </Link>
                        </DropdownMenuItem>
                        {user?.role !== UserRole.ADMIN && (
                          <DropdownMenuItem asChild>
                            <Link href="/user-dashboard/profile" className="flex items-center">
                              <User className="mr-2 h-4 w-4" />
                              Profile
                            </Link>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logout} className="text-red-600">
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign Out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {isSearchOpen && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-start justify-center pt-16 sm:pt-20">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl mx-3 sm:mx-4 p-3 sm:p-4">
            <form onSubmit={handleSearchSubmit}>
              <h3 className="text-lg font-semibold">Search Website</h3>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full mt-2 p-2 border rounded-md"
                autoFocus
              />
              <div className="flex justify-end mt-4 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsSearchOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Search
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
