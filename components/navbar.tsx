"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, Phone, Mail, Search, ChevronDown } from "lucide-react";

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
  const [isOpen, setIsOpen] = React.useState(false);

  const navigationItems = [
    { name: "Home", href: "/", isActive: true },
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
    { name: "Activities", href: "/activities" },
    { name: "Research Publications", href: "/publications" },
    { name: "Conference", href: "/conference" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact us", href: "/contact" },
  ];

  return (
    <div className="w-full">
      {/* Top Bar - Contact Information */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2 text-blue-800 hover:text-blue-900 transition-colors">
                <Phone className="h-4 w-4" />
                <span className="font-medium">+880 1711261736</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-800 hover:text-blue-900 transition-colors">
                <Mail className="h-4 w-4" />
                <span className="font-medium">office@bcns.org.bd</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-600 hover:text-blue-800 hover:bg-blue-200"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo Section */}
            <Link href="/" className="flex items-center space-x-4 group">
              <Image
                src="/images/logo.png"
                alt="BCNS Logo"
                width={100}
                height={100}
                className="group-hover:scale-105 transition-transform duration-300"
              />
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
                          className={`h-12 px-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all duration-200 ${
                            item.isActive ? "text-blue-600 bg-blue-50" : ""
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
                      className={`h-12 px-4 flex items-center text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all duration-200 rounded-md ${
                        item.isActive ? "text-blue-600 bg-blue-50" : ""
                      }`}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}

              {/* Membership Button */}
              <div className="ml-6">
                <Button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2.5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  Membership Form
                </Button>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden p-2 hover:bg-gray-100"
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
                          className={`block w-full text-left px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md font-medium transition-colors ${
                            item.isActive ? "text-blue-600 bg-blue-50" : ""
                          }`}
                          onClick={() => setIsOpen(false)}
                        >
                          {item.name}
                        </Link>
                      )}
                    </div>
                  ))}

                  {/* Mobile Membership Button */}
                  <div className="pt-6 border-t border-gray-200">
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 shadow-lg">
                      Membership Form
                    </Button>
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
