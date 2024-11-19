import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { UserLogin as Session, User } from "@/types/user";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import NavMain from "./NavMain";
import ThemeToggle from "./ThemeToggle";
import { getUserById } from "@/lib/actions/user.actions";
import { NavUser } from "./NavUser";

type Props = {
  session: Session | null;
};

const AppSidebar = async ({ session }: Props) => {
  if (!session) {
    redirect("/login");
  }
  const user = await getUserById(session?.user, session?.access);

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
            <NavMain />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={user.data as User}
          refresh={session.refresh}
          employee={session.employee}
        />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
