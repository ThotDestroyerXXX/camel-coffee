import CreateMenuView from "@/modules/admin/menu/ui/views/create-menu-view";
import { HydrateClient, trpc } from "@/trpc/server";

export default function Page() {
  void trpc.drinkOption.getMany.prefetch();

  return (
    <HydrateClient>
      <CreateMenuView />
    </HydrateClient>
  );
}
