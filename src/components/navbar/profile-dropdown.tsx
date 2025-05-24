"use client";
import Image from "next/image";
import guest from "@/../public/guest.webp";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { User } from "lucide-react";
import LogoutButton from "@/modules/auth/ui/components/logout-button";
import { useState } from "react";
import Loading from "../loading";

export default function ProfileDropdown({
  image,
  name,
}: Readonly<{ image: string | null; name: string }>) {
  const [loading, setLoading] = useState(false);
  return (
    <>
      {loading && <Loading />}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Image
            src={image ?? guest}
            alt='pp'
            width={30}
            height={30}
            className='rounded-full bg-white h-9 w-9 object-contain object-bottom cursor-pointer'
          />
        </DropdownMenuTrigger>

        <DropdownMenuContent className='mr-4'>
          <DropdownMenuLabel>Welcome, {name ?? "guest"}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <User />
              Profile
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <LogoutButton setLoading={setLoading} />
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
