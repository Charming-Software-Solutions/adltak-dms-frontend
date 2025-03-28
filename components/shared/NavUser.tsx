"use client";

import { BadgeCheck, ChevronsUpDown, IdCard, LogOut } from "lucide-react";

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
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { USER_ROLES } from "@/constants";
import { Employee, User } from "@/types/user";
import { useRouter } from "next/navigation";
import NavUserProfile from "./NavUserProfile";
import { logout } from "@/auth/actions";
import { Badge } from "../ui/badge";

export function NavUser({
  user,
  employee,
}: {
  user: User;
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
                subtitle={
                  user.roles.length > 1 ? (
                    <Badge variant="outline" className="rounded-md">
                      {USER_ROLES[user.roles[0]]} +{user.roles.length - 1}{" "}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="rounded-md">
                      {USER_ROLES[user.roles[0]]}
                    </Badge>
                  )
                }
                alt="profile-image"
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
                subtitle={user.email!}
                alt={"profile-image"}
                avatarImage={employee.profile_image}
              />
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <IdCard className="size-4 mr-2" />
                  Roles
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {user.roles.map((role) => (
                      <DropdownMenuItem
                        key={role}
                        className="pointer-events-none"
                      >
                        {USER_ROLES[role]}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push("/account/")}>
                <BadgeCheck className="size-4 mr-2" />
                Account
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                logout();
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
