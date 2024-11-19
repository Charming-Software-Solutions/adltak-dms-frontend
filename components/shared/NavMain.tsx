"use client";

import React from "react";
import {
  Archive,
  ArrowDownUp,
  ClipboardCheck,
  LayoutDashboard,
  Package,
  Users,
} from "lucide-react";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavMain = () => {
  const pathname = usePathname();

  const navLinks = [
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
    {
      label: "Employees",
      icon: <Users className="size-4" />,
      route: "/employees",
    },
  ];

  return (
    <SidebarMenu>
      {navLinks.map((link, index) => (
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
