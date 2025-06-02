import EditMenuView from "@/modules/admin/menu/ui/views/edit-menu-view";
import { HydrateClient, trpc } from "@/trpc/server";

export default async function Page({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params;
  void trpc.menu.getOne.prefetch({ itemId: id });
  void trpc.drinkOption.getMany.prefetch();
  return (
    <HydrateClient>
      <EditMenuView itemId={id} />
    </HydrateClient>
  );
}
