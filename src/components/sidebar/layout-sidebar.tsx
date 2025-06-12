import { Sidebar, SidebarContent, SidebarHeader } from "../ui/sidebar";
import MainSection from "./main-section";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import camelCoffee from "@/../public/camel-coffee-logo.png";
import Image from "next/image";

export default async function LayoutSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const data = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <Sidebar {...props} collapsible='icon'>
      <SidebarHeader>
        <Image src={camelCoffee} alt='logo' width={60} height={60} />
      </SidebarHeader>
      <SidebarContent>
        {data?.user.role && <MainSection role={data.user.role} />}
      </SidebarContent>
    </Sidebar>
  );
}
