"use client";

import { capitalize } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";

type Props = {
  children: React.ReactNode;
};

const Header = ({ children }: Props) => {
  const pathname = usePathname();
  const currentLink = pathname === "/" ? "Insights" : pathname.slice(1);
  const displayLink = capitalize(currentLink);

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6">
      <SidebarTrigger className="-ml-1 size-5" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <div className="w-full flex items-center justify-between">
        <h1 className="text-2xl font-bold">{displayLink}</h1>
        {children}
      </div>
    </header>
  );
};

export default Header;
