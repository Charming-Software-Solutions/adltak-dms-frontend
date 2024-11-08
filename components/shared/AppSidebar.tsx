"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { logout } from "@/lib/actions/auth.actions";
import { formatUserRole } from "@/lib/utils";
import { UserLogin as Session } from "@/types/user";
import {
  Archive,
  ArrowDownUp,
  ChevronUp,
  ClipboardCheck,
  LayoutDashboard,
  Package,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import ThemeToggle from "./ThemeToggle";

const data = {
  navLinks: [
    {
      label: "Insights",
      icon: <LayoutDashboard className="size-4" />,
      route: "/",
      isActive: true,
    },
    {
      label: "Distributions",
      icon: <ArrowDownUp className="size-4" />,
      route: "/distributions",
    },
    {
      label: "Products",
      icon: <Package className="size-4" />,
      route: "/products",
    },
    {
      label: "Tasks",
      icon: <ClipboardCheck className="size-4" />,
      route: "/tasks",
    },
    {
      label: "Assets",
      icon: <Archive className="size-4" />,
      route: "/assets",
    },
  ],
};

type Props = {
  session: Session | null;
};

const AppSidebar = ({ session }: Props) => {
  const pathname = usePathname();

  if (!session) {
    redirect("/login");
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex h-14 items-center px-2 justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold"
            prefetch={true}
          >
            <Image
              src={"/assets/images/logo.jpg"}
              alt={"adtalk-logo"}
              priority
              width={30}
              height={30}
              className="rounded-sm border"
            />
            <span>AdTalk Dashboard</span>
          </Link>
          <ThemeToggle />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navLinks.map((link, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname == link.route}
                    className="h-10"
                  >
                    <Link href={link.route} prefetch={true}>
                      {link.icon}
                      <span>{link.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size={"lg"}
                  className="px-3 py-8 rounded-lg bg-card border text-card-foreground shadow-sm"
                >
                  <Avatar className="size-10">
                    <AvatarImage src="/assets/images/avatar.jpg" />
                    <AvatarFallback>LG</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {session.user.email}
                    </span>
                    <span className="truncate text-xs">
                      {formatUserRole(session.user.role)}
                    </span>
                  </div>
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem
                  onClick={() => {
                    logout(session.refresh);
                  }}
                >
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
