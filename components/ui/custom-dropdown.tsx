"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CustomDropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  className?: string;
}

export function CustomDropdown({
  trigger,
  children,
  align = "end",
  className,
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Prevent body scroll when dropdown is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle escape key
  React.useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const getAlignmentClass = () => {
    switch (align) {
      case "start":
        return "left-0";
      case "center":
        return "left-1/2 transform -translate-x-1/2";
      case "end":
      default:
        return "right-0";
    }
  };

  return (
    <div className="relative">
      {/* Trigger */}
      <div
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer"
      >
        {trigger}
      </div>

      {/* Dropdown Content */}
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Menu */}
          <div
            ref={dropdownRef}
            className={cn(
              "absolute top-full mt-2 z-50 w-56 bg-white rounded-md border border-gray-200 shadow-lg overflow-hidden",
              "animate-in fade-in-0 zoom-in-95 duration-100",
              "max-w-[calc(100vw-2rem)]", // Prevent overflow
              getAlignmentClass(),
              className
            )}
            style={{
              // Ensure dropdown stays within viewport
              maxWidth: "calc(100vw - 2rem)",
            }}
          >
            {children}
          </div>
        </>
      )}
    </div>
  );
}

// Custom dropdown item component
interface CustomDropdownItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  variant?: "default" | "destructive";
}

export function CustomDropdownItem({
  children,
  onClick,
  href,
  className,
  variant = "default",
}: CustomDropdownItemProps) {
  const baseClasses =
    "flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors cursor-pointer";
  const variantClasses =
    variant === "destructive"
      ? "text-red-600 hover:bg-red-50 hover:text-red-700"
      : "text-gray-700 hover:text-gray-900";

  const classes = cn(baseClasses, variantClasses, className);

  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} onClick={onClick}>
      {children}
    </button>
  );
}

// Custom dropdown separator
export function CustomDropdownSeparator({ className }: { className?: string }) {
  return <div className={cn("border-t border-gray-200 my-1", className)} />;
}
