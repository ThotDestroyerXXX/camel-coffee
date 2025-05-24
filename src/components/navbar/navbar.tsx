import LoginButton from "@/modules/auth/ui/components/login-button";
import { SidebarTrigger } from "../ui/sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import ProfileDropdown from "./profile-dropdown";

export default async function Navbar() {
  const data = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <div className='w-full flex items-center justify-between py-3 px-5 shadow-sm bg-card'>
      <SidebarTrigger className='cursor-pointer md:hidden' />
      <h1 className='text-foreground text-xl'>My App</h1>
      <nav>
        <ul className='flex space-x-4'>
          <li>
            {data?.user ? (
              <ProfileDropdown
                image={data.user.image ?? null}
                name={data.user.name}
              />
            ) : (
              <LoginButton />
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
}
