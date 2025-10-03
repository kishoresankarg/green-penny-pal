import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Home,
  Plus,
  BarChart3,
  Trophy,
  Users,
  Lightbulb,
  Settings,
  Bell,
  User,
  LogOut,
  Menu,
  Leaf,
  Target,
  TrendingUp,
  Share2,
  Globe,
  Zap,
  Calendar,
  Crown,
  Flame,
  Wallet
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  user: any;
  onSignOut: () => void;
  notifications?: number;
}

const navigationItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
    description: "Your eco-journey overview"
  },
  {
    title: "Track Activities",
    href: "/track",
    icon: Plus,
    description: "Log your eco-friendly activities"
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    description: "Deep dive into your impact data",
    submenu: [
      { title: "Overview", href: "/analytics", icon: TrendingUp },
      { title: "Trends", href: "/analytics/trends", icon: BarChart3 },
      { title: "Predictions", href: "/analytics/predictions", icon: Target },
      { title: "Comparisons", href: "/analytics/compare", icon: Globe }
    ]
  },
  {
    title: "Progress",
    href: "/progress",
    icon: Trophy,
    description: "Achievements, levels, and streaks",
    submenu: [
      { title: "Achievements", href: "/progress/achievements", icon: Trophy },
      { title: "Levels", href: "/progress/levels", icon: Crown },
      { title: "Streaks", href: "/progress/streaks", icon: Flame },
      { title: "Challenges", href: "/progress/challenges", icon: Target }
    ]
  },
  {
    title: "Community",
    href: "/community",
    icon: Users,
    description: "Connect with eco-warriors worldwide",
    submenu: [
      { title: "Leaderboard", href: "/community/leaderboard", icon: Trophy },
      { title: "Challenges", href: "/community/challenges", icon: Target },
      { title: "Social Feed", href: "/community/feed", icon: Share2 },
      { title: "Global Impact", href: "/community/impact", icon: Globe }
    ]
  },
  {
    title: "AI Insights",
    href: "/insights",
    icon: Lightbulb,
    description: "Personalized eco-suggestions"
  },
  {
    title: "Finance Manager",
    href: "/finance",
    icon: Wallet,
    description: "Manage your money and eco-savings"
  }
];

export const Navbar = ({ user, onSignOut, notifications = 0 }: NavbarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActivePath = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const NavigationItem = ({ item, mobile = false }: { item: any; mobile?: boolean }) => {
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isActive = isActivePath(item.href);

    if (mobile) {
      return (
        <div className="space-y-1">
          <Link
            to={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 min-h-[44px] touch-manipulation",
              isActive 
                ? "bg-primary text-primary-foreground shadow-sm" 
                : "text-foreground hover:text-primary hover:bg-accent/80 active:bg-accent"
            )}
            onClick={() => setMobileMenuOpen(false)}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            <span className="flex-1">{item.title}</span>
            {hasSubmenu && (
              <span className="text-xs opacity-60">
                {item.submenu.length}
              </span>
            )}
          </Link>
          {hasSubmenu && (
            <div className="ml-4 pl-4 border-l-2 border-muted space-y-1">
              {item.submenu.map((subItem: any) => (
                <Link
                  key={subItem.href}
                  to={subItem.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all duration-200 min-h-[40px] touch-manipulation",
                    isActivePath(subItem.href)
                      ? "bg-primary/15 text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50 active:bg-accent"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <subItem.icon className="h-4 w-4 flex-shrink-0" />
                  <span className="flex-1">{subItem.title}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (hasSubmenu) {
      return (
        <NavigationMenuItem>
          <NavigationMenuTrigger className={cn(
            isActive && "bg-accent text-accent-foreground"
          )}>
            <item.icon className="h-4 w-4 mr-2" />
            {item.title}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-6 w-[400px]">
              <div className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    to={item.href}
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                  >
                    <item.icon className="h-6 w-6" />
                    <div className="mb-2 mt-4 text-lg font-medium">
                      {item.title}
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      {item.description}
                    </p>
                  </Link>
                </NavigationMenuLink>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {item.submenu.map((subItem: any) => (
                  <NavigationMenuLink key={subItem.href} asChild>
                    <Link
                      to={subItem.href}
                      className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        isActivePath(subItem.href) && "bg-primary text-primary-foreground"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <subItem.icon className="h-4 w-4" />
                        <div className="text-sm font-medium">{subItem.title}</div>
                      </div>
                    </Link>
                  </NavigationMenuLink>
                ))}
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      );
    }

    return (
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <Link
            to={item.href}
            className={cn(
              "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
              isActive && "bg-accent text-accent-foreground"
            )}
          >
            <item.icon className="h-4 w-4 mr-2" />
            {item.title}
          </Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 min-w-0">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary flex-shrink-0">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="hidden sm:inline-block font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent truncate">
            Green Penny Pal
          </span>
          <span className="sm:hidden font-bold text-base text-primary">GPP</span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {navigationItems.map((item) => (
              <NavigationItem key={item.href} item={item} />
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right Side Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative h-9 w-9 sm:h-10 sm:w-10">
            <Bell className="h-4 w-4" />
            {notifications > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
              >
                {notifications > 99 ? "99+" : notifications}
              </Badge>
            )}
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-full p-0">
                <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                  <AvatarImage src={user?.avatar_url} alt={user?.full_name} />
                  <AvatarFallback className="text-sm font-medium">
                    {user?.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.full_name || "User"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Zap className="mr-2 h-4 w-4" />
                    <span>Quick Actions</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => navigate("/track")}>
                        <Plus className="mr-2 h-4 w-4" />
                        <span>Log Activity</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/insights")}>
                        <Lightbulb className="mr-2 h-4 w-4" />
                        <span>Get Suggestions</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/community/challenges")}>
                        <Target className="mr-2 h-4 w-4" />
                        <span>Join Challenge</span>
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuGroup>
              
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px] max-w-[85vw] p-0 flex flex-col">
              {/* Mobile Header - Fixed */}
              <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center justify-center w-6 h-6 rounded bg-primary">
                    <Leaf className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <span className="font-bold">Green Penny Pal</span>
                </div>
              </div>

              {/* Mobile User Info - Fixed */}
              <div className="p-4 border-b bg-background/95 backdrop-blur">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.avatar_url} />
                    <AvatarFallback>
                      {user?.full_name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {user?.full_name || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Mobile Navigation - Scrollable */}
              <nav className="flex-1 overflow-y-auto mobile-sidebar-nav overscroll-contain px-4 py-4">
                <div className="space-y-2 pb-4">
                  {navigationItems.map((item) => (
                    <NavigationItem key={item.href} item={item} mobile />
                  ))}
                </div>
              </nav>

              {/* Mobile Footer - Fixed */}
              <div className="border-t bg-background/95 backdrop-blur p-4 space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start h-10"
                  onClick={() => {
                    navigate("/settings");
                    setMobileMenuOpen(false);
                  }}
                >
                  <Settings className="mr-3 h-4 w-4" />
                  Settings
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-10 text-red-600 hover:text-red-600 hover:bg-red-50"
                  onClick={() => {
                    onSignOut();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  Log out
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};