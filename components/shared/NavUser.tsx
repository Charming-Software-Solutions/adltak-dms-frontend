"use client";

import { BadgeCheck, ChevronsUpDown, LogOut } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { USER_ROLES } from "@/constants";
import { logout } from "@/lib/actions/auth.actions";
import { Employee, User } from "@/types/user";
import { useRouter } from "next/navigation";
import NavUserProfile from "./NavUserProfile";

export function NavUser({
  user,
  refresh,
  employee,
}: {
  user: User;
  refresh: string;
  employee: Employee;
}) {
  const { isMobile } = useSidebar();
  const router = useRouter();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground rounded-lg bg-card border text-card-foreground shadow-sm py-8"
            >
              <NavUserProfile
                firstName={employee.first_name}
                lastName={employee.last_name}
                subtitle={USER_ROLES[user.role]}
                alt={"profile-image"}
                avatarImage={employee.profile_image}
              />
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-[20rem] rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <NavUserProfile
                firstName={employee.first_name}
                lastName={employee.last_name}
                subtitle={user.email}
                alt={"profile-image"}
                avatarImage={employee.profile_image}
              />
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push("/account/")}>
                <BadgeCheck className="size-4 mr-2" />
                Account
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                logout(refresh);
              }}
            >
              <LogOut className="size-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
