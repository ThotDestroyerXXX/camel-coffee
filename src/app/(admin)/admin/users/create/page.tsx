import CreateUserView from "@/modules/admin/users/ui/views/create-user-view";
import { HydrateClient } from "@/trpc/server";

export default function Page() {
  return (
    <HydrateClient>
      <CreateUserView />
    </HydrateClient>
  );
}
