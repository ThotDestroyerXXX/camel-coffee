import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { memo } from "react";

const MapLoading = memo(() => <Skeleton className='w-full h-[480px]' />);
MapLoading.displayName = "MapLoading";

const Maps = dynamic(() => import("@/components/map/"), {
  loading: MapLoading,
  ssr: false,
});

const MapSection = memo(function MapSection({
  data,
  className,
}: {
  data: {
    latitude: string;
    longitude: string;
  };
  className?: string;
}) {
  return (
    <section className='flex flex-col gap-2 flex-1 w-full'>
      <div
        className={cn("w-full h-[480px]", className)}
        aria-label='Interactive map for selecting branch location'
      >
        <Maps
          posix={[parseFloat(data.latitude), parseFloat(data.longitude)]}
          interactive={false}
        />
      </div>
    </section>
  );
});

export default MapSection;
