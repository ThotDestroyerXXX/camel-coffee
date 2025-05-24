import RegisterView from "@/modules/auth/ui/views/register-view";
import { HydrateClient } from "@/trpc/server";

export default function LoginPage() {
  return (
    <HydrateClient>
      <RegisterView />
    </HydrateClient>
  );
}
