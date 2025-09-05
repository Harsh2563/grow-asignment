"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Home, Settings, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAVIGATION } from "@/constants";

const navItems = [
  {
    name: NAVIGATION.DASHBOARD,
    href: "/",
    icon: Home,
  },
  {
    name: NAVIGATION.SETTINGS,
    href: "/settings",
    icon: Settings,
  },
];

interface NavLinkProps {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

const NavLink: React.FC<NavLinkProps> = ({
  href,
  icon: Icon,
  children,
  isActive,
  onClick,
  className,
}) => (
  <Link href={href} onClick={onClick}>
    <Button
      variant={isActive ? "default" : "ghost"}
      size="sm"
      className={cn(
        "gap-2 transition-colors justify-start w-full",
        isActive && "bg-primary text-primary-foreground",
        className
      )}
    >
      <Icon className="h-4 w-4" />
      {children}
    </Button>
  </Link>
);

export const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <NavLink
              key={item.href}
              href={item.href}
              icon={item.icon}
              isActive={isActive}
              className="w-auto"
            >
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="p-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">{NAVIGATION.TOGGLE_MENU}</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle className="text-left">{NAVIGATION.NAVIGATION}</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-2 mt-6">
              {navItems.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <NavLink
                    key={item.href}
                    href={item.href}
                    icon={item.icon}
                    isActive={isActive}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </NavLink>
                );
              })}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};
