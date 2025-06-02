import { DEFAULT_LIMIT } from "@/constants";
import UserView from "@/modules/admin/users/ui/views/user-view";
import { HydrateClient, trpc } from "@/trpc/server";

export default function Page() {
  void trpc.user.getMany.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  });
  return (
    <HydrateClient>
      <UserView />
    </HydrateClient>
  );
}
