import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Home,
  Plus,
  BarChart3,
  Trophy,
  Users,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavigationProps {
  className?: string;
}

const mobileNavItems = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "Track",
    href: "/track",
    icon: Plus,
  },
  {
    title: "Progress",
    href: "/progress",
    icon: Trophy,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Community",
    href: "/community",
    icon: Users,
  },
];

export const MobileNavigation = ({ className }: MobileNavigationProps) => {
  const location = useLocation();

  const isActivePath = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border",
      "md:hidden", // Hide on desktop
      className
    )}>
      <div className="container max-w-full px-2">
        <div className="flex items-center justify-around py-2">
          {mobileNavItems.map((item) => {
            const isActive = isActivePath(item.href);
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className="flex-1 max-w-16"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full h-12 flex flex-col items-center justify-center gap-1 px-2",
                    "hover:bg-accent hover:text-accent-foreground",
                    isActive && "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="text-xs font-medium truncate">{item.title}</span>
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};