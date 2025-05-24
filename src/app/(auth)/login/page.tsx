import LoginView from "@/modules/auth/ui/views/login-view";
import { HydrateClient } from "@/trpc/server";

export default function Page() {
  return (
    <HydrateClient>
      <LoginView />
    </HydrateClient>
  );
}
