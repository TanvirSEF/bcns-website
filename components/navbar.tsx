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
  User,
  Shield,
  Users,
  Calendar,
  BookOpen,
  Award,
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
  const [isScrolled, setIsScrolled] = React.useState(false);

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
        { name: "History", href: "/about/history", icon: Calendar },
        { name: "Leadership", href: "/about/leadership", icon: Users },
      ],
    },
    {
      name: "Committee",
      href: "/committee",
      hasDropdown: true,
      icon: Users,
      dropdownItems: [
        {
          name: "Executive Council",
          href: "/committee/executive",
          icon: Shield,
        },
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
    { name: "Our Members", href: "/members", icon: Users },
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
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
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
    <div className="w-full">
      {/* Top Information Bar */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center space-x-4 lg:space-x-6">
              <button
                onClick={handlePhoneClick}
                className="flex items-center space-x-1 hover:text-blue-200 transition-colors"
              >
                <Phone className="h-3 w-3" />
                <span className="hidden sm:inline">+880 1711261736</span>
              </button>
              <button
                onClick={handleEmailClick}
                className="flex items-center space-x-1 hover:text-blue-200 transition-colors"
              >
                <Mail className="h-3 w-3" />
                <span className="hidden md:inline">office@bcns.org.bd</span>
              </button>
              <div className="hidden lg:flex items-center space-x-1">
                <MapPin className="h-3 w-3" />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setIsSearchOpen(true)}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10 h-6 px-2"
              >
                <Search className="h-3 w-3" />
              </Button>
              <div className="flex items-center space-x-1">
                <Globe className="h-3 w-3" />
                <select className="bg-transparent text-xs focus:outline-none cursor-pointer">
                  <option value="en">EN</option>
                  <option value="bn">বাং</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200"
            : "bg-white shadow-sm"
        }`}
        style={{ top: isScrolled ? "0" : "40px" }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <Image
                  src="/images/logo.png"
                  alt="BCNS Logo"
                  width={isScrolled ? 80 : 80}
                  height={isScrolled ? 80 : 80}
                  className="transition-all duration-300 group-hover:scale-105"
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <div key={item.name} className="relative">
                  {item.hasDropdown ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className={`h-12 px-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 font-medium transition-all duration-200 rounded-lg ${
                            isActive(item.href)
                              ? "text-blue-600 bg-blue-50"
                              : ""
                          }`}
                        >
                          {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                          {item.name}
                          <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-200" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="start"
                        sideOffset={8}
                        className="w-64 border-0 shadow-2xl rounded-xl bg-white/95 backdrop-blur-sm z-[60]"
                      >
                        {item.dropdownItems?.map((dropdownItem) => (
                          <DropdownMenuItem
                            key={dropdownItem.name}
                            className="py-3 px-4 hover:bg-blue-50"
                          >
                            <Link
                              href={dropdownItem.href}
                              className="w-full flex items-center text-gray-700 hover:text-blue-600 font-medium"
                            >
                              {dropdownItem.icon && (
                                <dropdownItem.icon className="mr-3 h-4 w-4 text-gray-500" />
                              )}
                              {dropdownItem.name}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Link
                      href={item.href}
                      className={`h-12 px-4 flex items-center text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 font-medium transition-all duration-200 rounded-lg ${
                        isActive(item.href) ? "text-blue-600 bg-blue-50" : ""
                      }`}
                    >
                      {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Action Buttons */}
            <div className="hidden lg:flex items-center space-x-3">
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-6 py-2.5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-lg">
                <User className="mr-2 h-4 w-4" />
                Login
              </Button>
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-6 py-2.5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-lg">
                <Shield className="mr-2 h-4 w-4" />
                Membership
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[320px] sm:w-[400px] bg-white/95 backdrop-blur-sm border-l border-gray-200"
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
                              className="w-full justify-between text-left font-medium h-12 px-4 hover:bg-blue-50 rounded-lg"
                            >
                              <div className="flex items-center">
                                {item.icon && (
                                  <item.icon className="mr-3 h-4 w-4" />
                                )}
                                {item.name}
                              </div>
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
                                className="py-3 px-4 hover:bg-blue-50"
                              >
                                <Link
                                  href={dropdownItem.href}
                                  className="w-full flex items-center text-gray-700 hover:text-blue-600 font-medium"
                                  onClick={() => setIsOpen(false)}
                                >
                                  {dropdownItem.icon && (
                                    <dropdownItem.icon className="mr-3 h-4 w-4 text-gray-500" />
                                  )}
                                  {dropdownItem.name}
                                </Link>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <Link
                          href={item.href}
                          className={`w-full text-left px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors flex items-center ${
                            isActive(item.href)
                              ? "text-blue-600 bg-blue-50"
                              : ""
                          }`}
                          onClick={() => setIsOpen(false)}
                        >
                          {item.icon && <item.icon className="mr-3 h-4 w-4" />}
                          {item.name}
                        </Link>
                      )}
                    </div>
                  ))}

                  {/* Mobile Action Buttons */}
                  <div className="pt-6 border-t border-gray-200 mt-6">
                    <div className="space-y-3">
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 shadow-lg rounded-lg">
                        <User className="mr-2 h-4 w-4" />
                        Login
                      </Button>
                      <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 shadow-lg rounded-lg">
                        <Shield className="mr-2 h-4 w-4" />
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

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-24 lg:h-28"></div>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Search BCNS
                </h3>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for articles, events, members..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              </div>
              <div className="flex space-x-3">
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Search
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
