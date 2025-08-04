"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  Phone,
  Mail,
  Search,
  ChevronDown,
  X,
  MapPin,
  Clock,
  Globe,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isTopBarVisible, setIsTopBarVisible] = React.useState(true);
  const [lastScrollY, setLastScrollY] = React.useState(0);

  const navigationItems = [
    { name: "Home", href: "/" },
    {
      name: "About Us",
      href: "/about",
      hasDropdown: true,
      dropdownItems: [
        { name: "Our Mission", href: "/about/mission" },
        { name: "Our Vision", href: "/about/vision" },
        { name: "History", href: "/about/history" },
        { name: "Leadership", href: "/about/leadership" },
      ],
    },
    {
      name: "Committee",
      href: "/committee",
      hasDropdown: true,
      dropdownItems: [
        { name: "Executive Council", href: "/committee/executive" },
        { name: "Board Members", href: "/committee/board" },
        { name: "Advisory Board", href: "/committee/advisory" },
        { name: "Past Presidents", href: "/committee/past-presidents" },
      ],
    },
    {
      name: "Activities",
      href: "/activities",
      hasDropdown: true,
      dropdownItems: [
        { name: "Research", href: "/activities/research" },
        { name: "Conference", href: "/activities/conference" },
        { name: "Gallery", href: "/activities/gallery" },
      ],
    },
    { name: "Contact us", href: "/contact" },
    { name: "Our Members", href: "/members" },
  ];

  // Function to check if a navigation item is active
  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  // Handle scroll behavior
  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show top bar when at the very top
      if (currentScrollY <= 50) {
        setIsTopBarVisible(true);
        setLastScrollY(currentScrollY);
        return;
      }

      // Hide top bar when scrolling down (after 100px)
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsTopBarVisible(false);
      }
      // Show top bar when scrolling up
      else if (currentScrollY < lastScrollY) {
        setIsTopBarVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search functionality here
    console.log("Searching for:", searchQuery);
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const handlePhoneClick = () => {
    window.location.href = "tel:+8801711261736";
  };

  const handleEmailClick = () => {
    window.location.href = "mailto:office@bcns.org.bd";
  };

  return (
    <div className="w-full overflow-hidden">
      {/* Modern Top Bar - Contact Information & Search */}
      <div
        className={`bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white transition-all duration-300 ${isTopBarVisible
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform -translate-y-full"
          }`}
      >
        <div className="container mx-auto px-4 py-1.5 sm:py-2">
          <div className="flex items-center justify-between h-8 sm:h-10">
            {isSearchOpen ? (
              // If search is open, render ONLY the full-width form
              <form
                onSubmit={handleSearch}
                className="flex items-center space-x-2 animate-in slide-in-from-top-2 duration-300 w-full"
              >
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search BCNS website..."
                    className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-1 sm:py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-xs sm:text-sm"
                    autoFocus
                  />
                </div>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full transition-all duration-300 text-xs"
                >
                  Search
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="text-white hover:bg-white/10 p-1 sm:p-1.5 rounded-full transition-all duration-300"
                >
                  <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              </form>
            ) : (
              // If search is closed, render the original layout
              <>
                {/* Contact Information */}
                <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 lg:space-x-6 overflow-hidden">
                  {/* Phone */}
                  <button
                    onClick={handlePhoneClick}
                    className="flex items-center space-x-1 sm:space-x-1.5 text-blue-100 hover:text-white transition-all duration-300 group flex-shrink-0"
                  >
                    <div className="p-0.5 sm:p-1 bg-blue-600/20 rounded-full group-hover:bg-blue-500/30 transition-all duration-300">
                      <Phone className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    </div>
                    <span className="text-xs font-medium hidden sm:inline">+880 1711261736</span>
                    <span className="text-xs font-medium sm:hidden">+880 1711261736</span>
                  </button>

                  {/* Email */}
                  <button
                    onClick={handleEmailClick}
                    className="flex items-center space-x-1 sm:space-x-1.5 text-blue-100 hover:text-white transition-all duration-300 group flex-shrink-0"
                  >
                    <div className="p-0.5 sm:p-1 bg-blue-600/20 rounded-full group-hover:bg-blue-500/30 transition-all duration-300">
                      <Mail className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    </div>
                    <span className="text-xs font-medium hidden lg:inline">office@bcns.org.bd</span>
                    <span className="text-xs font-medium lg:hidden">office@bcns.org.bd</span>
                  </button>

                  {/* Location - Hidden on small screens */}
                  <div className="hidden md:flex items-center space-x-2 text-blue-100 flex-shrink-0">
                    <div className="p-1 bg-blue-600/20 rounded-full">
                      <MapPin className="h-3 w-3" />
                    </div>
                    <span className="text-xs font-medium">Dhaka, Bangladesh</span>
                  </div>

                  {/* Working Hours - Hidden on medium screens */}
                  <div className="hidden lg:flex items-center space-x-2 text-blue-100 flex-shrink-0">
                    <div className="p-1 bg-blue-600/20 rounded-full">
                      <Clock className="h-3 w-3" />
                    </div>
                    <span className="text-xs font-medium">Mon-Fri: 9AM-5PM</span>
                  </div>
                </div>

                {/* Right side items: Search Icon + Language */}
                <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                  <Button
                    onClick={() => setIsSearchOpen(true)}
                    variant="ghost"
                    size="sm"
                    className="text-blue-100 hover:text-white hover:bg-white/10 p-1 sm:p-1.5 rounded-full transition-all duration-300"
                  >
                    <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Button>

                  <div className="hidden sm:flex items-center space-x-2 text-blue-100">
                    <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <select className="bg-transparent text-xs font-medium focus:outline-none cursor-pointer">
                      <option value="en" className="bg-slate-800 text-white">
                        EN
                      </option>
                      <option value="bn" className="bg-slate-800 text-white">
                        বাং
                      </option>
                    </select>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div
        className={`bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50 w-full transition-all duration-300 ${!isTopBarVisible ? "shadow-lg" : "shadow-sm"
          }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo Section */}
            <Link
              href="/"
              className="flex items-center space-x-2 sm:space-x-4 group flex-shrink-0"
            >
              <Image
                src="/images/logo.png"
                alt="BCNS Logo"
                width={80}
                height={80}
                className="group-hover:scale-105 transition-transform duration-300"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1 overflow-hidden">
              {navigationItems.map((item) => (
                <div key={item.name} className="relative flex-shrink-0">
                  {item.hasDropdown ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className={`h-10 px-3 lg:px-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all duration-200 text-sm lg:text-base ${isActive(item.href) ? "text-blue-600 bg-blue-50" : ""
                            }`}
                        >
                          {item.name}
                          <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-200" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="start"
                        className="w-56 mt-2 border-0 shadow-xl rounded-xl bg-white/95 backdrop-blur-sm"
                      >
                        {item.dropdownItems?.map((dropdownItem) => (
                          <DropdownMenuItem
                            key={dropdownItem.name}
                            className="py-3"
                          >
                            <Link
                              href={dropdownItem.href}
                              className="w-full text-gray-700 hover:text-blue-600 font-medium"
                            >
                              {dropdownItem.name}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Link
                      href={item.href}
                      className={`h-10 px-3 lg:px-4 flex items-center text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all duration-200 rounded-md text-sm lg:text-base ${isActive(item.href) ? "text-blue-600 bg-blue-50" : ""
                        }`}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}

              {/* Action Buttons */}
              <div className="ml-4 lg:ml-6 flex items-center space-x-2 lg:space-x-3 flex-shrink-0">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 lg:px-4 xl:px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-300 transform text-xs lg:text-sm">
                  Login
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 lg:px-3 xl:px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-300 transform text-xs lg:text-sm">
                  Membership
                </Button>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden p-2 hover:bg-gray-100 flex-shrink-0"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[320px] sm:w-[400px] bg-white/95 backdrop-blur-sm"
              >
                <SheetHeader className="border-b border-gray-200 pb-6">
                  <SheetTitle className="text-left">
                    <div className="flex items-center space-x-4">
                      <Image
                        src="/images/logo.png"
                        alt="BCNS Logo"
                        width={50}
                        height={50}
                      />
                      <div>
                        <div className="text-lg font-bold text-gray-900">
                          BCNS
                        </div>
                        <div className="text-xs text-gray-600 font-medium">
                          Bangladesh Child Neurology Society
                        </div>
                      </div>
                    </div>
                  </SheetTitle>
                </SheetHeader>

                <div className="mt-8 space-y-2">
                  {navigationItems.map((item) => (
                    <div key={item.name}>
                      {item.hasDropdown ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="w-full justify-between text-left font-medium h-12 px-4 hover:bg-blue-50"
                            >
                              {item.name}
                              <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="start"
                            className="w-full mt-1"
                          >
                            {item.dropdownItems?.map((dropdownItem) => (
                              <DropdownMenuItem
                                key={dropdownItem.name}
                                className="py-3"
                              >
                                <Link
                                  href={dropdownItem.href}
                                  className="w-full text-gray-700 hover:text-blue-600 font-medium"
                                  onClick={() => setIsOpen(false)}
                                >
                                  {dropdownItem.name}
                                </Link>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <Link
                          href={item.href}
                          className={`block w-full text-left px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md font-medium transition-colors ${isActive(item.href) ? "text-blue-600 bg-blue-50" : ""
                            }`}
                          onClick={() => setIsOpen(false)}
                        >
                          {item.name}
                        </Link>
                      )}
                    </div>
                  ))}

                  {/* Mobile Action Buttons */}
                  <div className="pt-6 border-t border-gray-200">
                    <div className="space-y-3">
                      <Button type="button" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 shadow-lg">
                        Login
                      </Button>
                      <Button type="button" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 shadow-lg">
                        Membership
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  );
}