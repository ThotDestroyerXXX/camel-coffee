import MenuView from "@/modules/admin/menu/ui/views/menu-view";
import { HydrateClient, trpc } from "@/trpc/server";

export default function Page() {
  void trpc.menu.getMany.prefetch();
  return (
    <HydrateClient>
      <MenuView />
    </HydrateClient>
  );
}
