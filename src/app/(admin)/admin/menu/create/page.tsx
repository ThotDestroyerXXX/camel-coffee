import CreateMenuView from "@/modules/admin/menu/ui/views/create-menu-view";
import { HydrateClient } from "@/trpc/server";

export default function Page() {
  return (
    <HydrateClient>
      <CreateMenuView />
    </HydrateClient>
  );
}
