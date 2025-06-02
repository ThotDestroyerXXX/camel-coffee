import CreateBranchView from "@/modules/admin/branch/ui/views/create-branch-view";
import { HydrateClient } from "@/trpc/server";

export default function Page() {
  return (
    <HydrateClient>
      <CreateBranchView />
    </HydrateClient>
  );
}
