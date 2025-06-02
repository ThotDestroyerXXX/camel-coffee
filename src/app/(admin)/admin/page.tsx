import Dashboard from "@/modules/admin/dashboard/ui/views/dashboard-view";
import { HydrateClient } from "@/trpc/server";

export default function Page() {
  return (
    <HydrateClient>
      <Dashboard />
    </HydrateClient>
  );
}
