"use client";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LogoutButton({
  setLoading,
}: Readonly<{ setLoading: (loading: boolean) => void }>) {
  const router = useRouter();
  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onRequest: () => {
          setLoading(true);
        },
        onSuccess: () => {
          router.push("/login");
          router.refresh();
          setLoading(false);
        },
        onError: () => {
          setLoading(false);
        },
      },
    });
  };

  return (
    <DropdownMenuItem onClick={() => handleLogout()}>
      <LogOut />
      Log out
    </DropdownMenuItem>
  );
}
