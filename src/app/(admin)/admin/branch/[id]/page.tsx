import BranchDetailView from "@/modules/admin/branch/ui/views/branch-detail-view";
import { HydrateClient, trpc } from "@/trpc/server";

export default async function Page({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params;
  void trpc.branch.getById.prefetch({ id: id });
  return (
    <HydrateClient>
      <BranchDetailView branchId={id} />
    </HydrateClient>
  );
}
