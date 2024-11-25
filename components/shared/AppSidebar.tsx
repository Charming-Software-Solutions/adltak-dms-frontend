import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import NavMain from "./NavMain";
import { NavUser } from "./NavUser";
import ThemeToggle from "./ThemeToggle";
import { getAccountSession } from "@/lib/actions/auth.actions";

const AppSidebar = async () => {
  const accountSession = await getAccountSession();

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
            <NavMain user={accountSession.employee.user} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={accountSession.employee.user}
          refresh={accountSession.refresh}
          employee={accountSession.employee}
        />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
