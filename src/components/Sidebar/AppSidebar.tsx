"use client";

import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  ChevronDown,
  User2,
  ChevronUp,
  CookingPot,
  Sparkle,
  Apple,
  Smile,
  LayoutDashboard,
  Map,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useTheme } from "next-themes";

import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/main/welcome",
    icon: Home,
  },
  {
    title: "Recipe of the Day",
    url: "/main/rotd",
    icon: CookingPot,
  },
  {
    title: "NutriWise AI",
    url: "/main/chat",
    icon: Sparkle,
  },
  {
    title: "Recommendations",
    url: "/main/recommend",
    icon: Apple,
  },
  {
    title: "Tracker",
    url: "/main/track",
    icon: Calendar,
  },
  {
    title: "Community",
    url: "/main/community",
    icon: Smile,
  },
  {
    title: "Recipe-Tour",
    url: "/recipe-map",
    icon: Map,
  },
  {
    title: "Recipes",
    url: "/main/recipes",
    icon: Search,
  },
  {
    title: "Dashboard",
    url: "/main/dashboard",
    icon: LayoutDashboard,
  },
];

export function AppSidebar() {
  const { setTheme } = useTheme();
  const router = useRouter();

  const { data: session } = useSession();
  const [status, setStatus] = useState("loaded");

  return (
    <Sidebar collapsible="icon" variant="floating" className="border-r">
      <SidebarHeader className="border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="hover:bg-accent transition-colors">
                  <span className="font-semibold">Nutriwise</span>
                  {/* <ChevronDown className="ml-auto h-4 w-4" /> */}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              {/* <DropdownMenuContent className="w-56">
                <DropdownMenuItem className="cursor-pointer">
                  <span>Acme Inc</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <span>Acme Corp.</span>
                </DropdownMenuItem>
              </DropdownMenuContent> */}
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground">
            Application
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="hover:bg-accent transition-colors rounded-md"
                  >
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span className="font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        {/* Profile Section */}
        <div className="px-2">
          <div className="flex items-center space-x-4 px-2 py-3 rounded-lg hover:bg-accent/50 transition-colors">
            {status === "loading" ? (
              <div className="h-10 w-10 rounded-full animate-pulse bg-muted" />
            ) : session?.user.image ? (
              <img
                src={session?.user?.image}
                alt={session.user.name || "Profile"}
                className="h-10 w-10 rounded-full ring-2 ring-border shadow-sm"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center ring-2 ring-border">
                <User2 className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              {status === "loading" ? (
                <div className="h-5 w-24 bg-muted rounded animate-pulse" />
              ) : (
                <>
                  <p className="text-sm font-medium truncate">
                    {session?.user?.name || "Guest"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {session?.user?.email}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Existing menu */}
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <span>Options</span>
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem onClick={() => router.push("/main/account")}>
                  <span>Account</span>
                </DropdownMenuItem>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <DropdownMenuItem>
                          <span>Toggle theme</span>
                        </DropdownMenuItem>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setTheme("light")}>
                          Light
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")}>
                          Dark
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("system")}>
                          System
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuItem>
                </SidebarMenu>
                <DropdownMenuItem onClick={() => signOut()}>
                  <button>Sign out</button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
