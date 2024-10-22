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
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import ThemeToggle from "./ThemeToggle";
import { User } from "@/types/user";
import { logout } from "@/lib/actions/auth.actions";
import { formatUserRole } from "@/lib/utils";

// This is sample data.
const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
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
  user: User;
};

const AppSidebar = ({ user }: Props) => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex h-14 items-center px-2 justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold">
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
                    <a href={link.route}>
                      {link.icon}
                      <span>{link.label}</span>
                    </a>
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
                    <span className="truncate font-semibold">{user.email}</span>
                    <span className="truncate text-xs">
                      {formatUserRole(user.role)}
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
                    logout();
                    router.push("/login");
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
