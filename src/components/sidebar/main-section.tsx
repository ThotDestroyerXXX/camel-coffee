import Link from "next/link";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";

import { ShoppingCart, Box, Utensils } from "lucide-react";

const mainItems = [
  {
    name: "menu",
    icon: Utensils,
    href: "/menu",
  },
  {
    name: "History",
    icon: Box,
    href: "/history",
  },
  {
    name: "Cart",
    icon: ShoppingCart,
    href: "/cart",
  },
];

export default function MainSection({
  role,
}: Readonly<{ role: string | null }>) {
  return (
    <SidebarGroup>
      {role === "customer" && (
        <SidebarGroupContent>
          <SidebarMenu>
            {mainItems.map((item) => {
              const Icon = item.icon;
              return (
                <SidebarMenuItem
                  key={item.name}
                  className='flex flex-col gap-4'
                >
                  <SidebarMenuButton className='flex flex-col size-full'>
                    <Link
                      href={item.href}
                      className='flex items-center gap-1 flex-col'
                    >
                      <Icon className='shrink-0' size={20} />
                      <span className='text-[13px]'>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      )}
    </SidebarGroup>
  );
}
