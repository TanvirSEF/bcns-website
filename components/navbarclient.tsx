"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import {
  Menu,
  Phone,
  Mail,
  Search,
  ChevronDown,
  MapPin,
  Globe,
  User,
  Shield,
  Users,
  Calendar,
  BookOpen,
  Award,
  LogOut,
  LayoutDashboard,
  UserPlus,
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
  CustomDropdown,
  CustomDropdownItem,
  CustomDropdownSeparator,
} from "@/components/ui/custom-dropdown";

const navigationItems = [
  { name: "Home", href: "/", icon: null },
  {
    name: "About Us",
    href: "/about",
    hasDropdown: true,
    icon: Shield,
    dropdownItems: [
      { name: "Our Mission", href: "/about/mission", icon: Award },
      { name: "Our Vision", href: "/about/vision", icon: BookOpen },
    ],
  },
  {
    name: "Committee",
    href: "/committee",
    hasDropdown: true,
    icon: Users,
    dropdownItems: [
      { name: "Executive Council", href: "/committee/executive", icon: Shield },
      { name: "Board Members", href: "/committee/board", icon: Users },
      { name: "Advisory Board", href: "/committee/advisory", icon: Award },
      {
        name: "Past Presidents",
        href: "/committee/past-presidents",
        icon: Calendar,
      },
    ],
  },
  {
    name: "Activities",
    href: "/activities",
    hasDropdown: true,
    icon: Calendar,
    dropdownItems: [
      { name: "Research", href: "/activities/research", icon: BookOpen },
      { name: "Conference", href: "/activities/conference", icon: Award },
      { name: "Gallery", href: "/activities/gallery", icon: Users },
    ],
  },
  { name: "Contact us", href: "/contact", icon: Phone },
  { name: "Our Members", href: "/members", icon: Users, requiresAuth: true },
];

export function NavbarClient() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);
  const dropdownTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const { isAuthenticated, user, logout } = useAuth();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDropdownEnter = (itemName: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setOpenDropdown(itemName);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  React.useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
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
          {!isMobile && (
            <Button
              asChild
              className="w-full lg:w-auto bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Link href="/membership">
                <Shield className="mr-2 h-4 w-4" /> Membership
              </Link>
            </Button>
          )}
          <CustomDropdown
            align="end"
            trigger={
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
            }
          >
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

            <CustomDropdownItem href="/dashboard">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </CustomDropdownItem>

            <CustomDropdownItem href="/profile">
              <User className="mr-2 h-4 w-4" />
              Profile
            </CustomDropdownItem>

            {isMobile && (
              <CustomDropdownItem href="/membership">
                <Shield className="mr-2 h-4 w-4" />
                Membership
              </CustomDropdownItem>
            )}

            <CustomDropdownSeparator />

            <CustomDropdownItem onClick={logout} variant="destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </CustomDropdownItem>
          </CustomDropdown>
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
            className="w-full lg:w-auto bg-green-600 hover:bg-green-700 text-white"
          >
            <Link href="/signup">
              <UserPlus className="mr-2 h-4 w-4" />
              Sign Up
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
        <div className="bg-blue-900 text-white">
          <div className="container mx-auto px-4 py-1.5">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center space-x-4 lg:space-x-6">
                <a
                  href="tel:+8801711261736"
                  className="flex items-center space-x-1.5 hover:text-blue-200 transition-colors"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">+880 1711261736</span>
                </a>
                <a
                  href="mailto:office@bcns.org.bd"
                  className="flex items-center space-x-1.5 hover:text-blue-200 transition-colors"
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">office@bcns.org.bd</span>
                </a>
                <div className="hidden lg:flex items-center space-x-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>Dhaka, Bangladesh</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  onClick={() => setIsSearchOpen(true)}
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-blue-800 h-7 w-7"
                  aria-label="Open search"
                >
                  <Search className="h-4 w-4" />
                </Button>
                <div className="flex items-center space-x-1">
                  <Globe className="h-4 w-4" />
                  <select className="bg-transparent text-xs focus:outline-none cursor-pointer">
                    <option value="en" className="text-black">
                      EN
                    </option>
                    <option value="bn" className="text-black">
                      বাং
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={cn(
            "transition-shadow duration-300 bg-white border-b",
            isScrolled
              ? "shadow-lg border-gray-200"
              : "shadow-sm border-transparent"
          )}
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex-shrink-0">
                <Image
                  src="/images/logo.png"
                  alt="BCNS Logo"
                  width={70}
                  height={70}
                  priority
                />
              </Link>

              <nav className="hidden lg:flex items-center space-x-2">
                {visibleNavItems.map((item) => (
                  <div
                    key={item.name}
                    className="relative"
                    onMouseEnter={() =>
                      item.hasDropdown && handleDropdownEnter(item.name)
                    }
                    onMouseLeave={handleDropdownLeave}
                  >
                    {item.hasDropdown ? (
                      <>
                        <div
                          className={cn(
                            "h-12 px-4 flex items-center cursor-pointer text-gray-700 hover:text-blue-600 font-medium rounded-lg",
                            isActive(item.href!) && "text-blue-600"
                          )}
                        >
                          {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                          {item.name}
                          <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-200" />
                        </div>
                        {openDropdown === item.name && (
                          <div
                            className="absolute top-full left-0 w-64 bg-white shadow-2xl rounded-lg border border-gray-100 mt-2 p-2 animate-in fade-in-0 zoom-in-95"
                            onMouseEnter={() => handleDropdownEnter(item.name)}
                            onMouseLeave={handleDropdownLeave}
                          >
                            {item.dropdownItems?.map((dropdownItem) => (
                              <Link
                                key={dropdownItem.name}
                                href={dropdownItem.href}
                                className="w-full flex items-center text-gray-700 hover:text-blue-600 font-medium py-3 px-4 rounded-md hover:bg-blue-50"
                              >
                                {dropdownItem.icon && (
                                  <dropdownItem.icon className="mr-3 h-4 w-4 text-gray-400" />
                                )}
                                {dropdownItem.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        href={item.href!}
                        className={cn(
                          "h-12 px-4 flex items-center text-gray-700 hover:text-blue-600 font-medium rounded-lg",
                          isActive(item.href!) && "text-blue-600 bg-blue-50"
                        )}
                      >
                        {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>

              <div className="hidden lg:flex">
                <ActionButtons />
              </div>

              <div className="lg:hidden">
                <Sheet
                  open={isMobileMenuOpen}
                  onOpenChange={setIsMobileMenuOpen}
                >
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu />
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
                              <AccordionTrigger>{item.name}</AccordionTrigger>
                              <AccordionContent className="pl-4">
                                {item.dropdownItems?.map((dropdownItem) => (
                                  <Link
                                    key={dropdownItem.name}
                                    href={dropdownItem.href}
                                    className="block py-2"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                  >
                                    {dropdownItem.name}
                                  </Link>
                                ))}
                              </AccordionContent>
                            </AccordionItem>
                          ) : (
                            <Link
                              key={item.name}
                              href={item.href!}
                              className="block py-3 font-medium"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {item.name}
                            </Link>
                          )
                        )}
                      </Accordion>

                      {/* Added login and membership buttons to mobile nav */}
                      <ActionButtons isMobile />
                    </nav>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </header>

      {isSearchOpen && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-start justify-center pt-20">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl mx-4 p-4">
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
