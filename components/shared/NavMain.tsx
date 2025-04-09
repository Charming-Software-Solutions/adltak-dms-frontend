"use client";

import { UserRoleEnum } from "@/enums";
import { User } from "@/types/user";
import {
  Archive,
  ClipboardCheck,
  FolderKanban,
  LayoutDashboard,
  NotepadText,
  Package,
  Tags,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";

export type NavMainProps = {
  user: User;
};

export type NavLink = {
  label: string;
  icon: React.ReactNode;
  route: string;
  isActive?: boolean;
  allowedRoles?: UserRoleEnum[];
};

const NAV_LINKS: NavLink[] = [
  {
    label: "Insights",
    icon: <LayoutDashboard className="size-4" />,
    route: "/",
    isActive: true,
  },
  {
    label: "Projects",
    icon: <FolderKanban className="size-4" />,
    route: "/projects",
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
    label: "Materials",
    icon: <Archive className="size-4" />,
    route: "/materials",
  },
  {
    label: "Classifications",
    icon: <Tags className="size-4" />,
    route: "/classifications",
  },
  {
    label: "Employees",
    icon: <Users className="size-4" />,
    route: "/employees",
    allowedRoles: [UserRoleEnum.ADMIN],
  },
  {
    label: "Activity Logs",
    icon: <NotepadText className="size-4" />,
    route: "/activity-logs",
  },
];

const NavMain = ({ user }: NavMainProps) => {
  const pathname = usePathname();
  const authorizedLinks = NAV_LINKS.filter((link) => {
    if (!link.allowedRoles) return true;
    return user.roles.some((role: string) =>
      link.allowedRoles!.includes(role as UserRoleEnum),
    );
  });
  return (
    <SidebarMenu>
      {authorizedLinks.map((link, index) => (
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
  );
};

export default NavMain;
