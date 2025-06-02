import { DEFAULT_LIMIT } from "@/constants";
import BranchView from "@/modules/admin/branch/ui/views/branch-view";
import { HydrateClient, trpc } from "@/trpc/server";

export default function Page() {
  void trpc.branch.getMany.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  });
  return (
    <HydrateClient>
      <BranchView />
    </HydrateClient>
  );
}
