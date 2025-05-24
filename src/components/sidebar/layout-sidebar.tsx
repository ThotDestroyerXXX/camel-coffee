import { Coffee } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenuButton,
} from "../ui/sidebar";
import MainSection from "./main-section";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function LayoutSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const data = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <Sidebar {...props} collapsible='icon'>
      <SidebarHeader>
        <SidebarMenuButton
          size='lg'
          className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground items-center justify-center'
        >
          <div className='flex aspect-square size-10 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
            <Coffee className='size-5' />
          </div>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        {data?.user.role && <MainSection role={data.user.role} />}
      </SidebarContent>
    </Sidebar>
  );
}
