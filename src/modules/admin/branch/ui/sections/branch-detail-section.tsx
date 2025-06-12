"use client";
import NotFound from "@/components/not-found";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { MapPin, Navigation, Phone } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import parsePhoneNumber from "libphonenumber-js";
import MapSection from "@/components/map/non-interactive-map";

export default function BranchDetailSection({
  branchId,
}: Readonly<{ branchId: string }>) {
  return (
    <Suspense fallback={<div>Loading branch...</div>}>
      <ErrorBoundary fallback={<NotFound message='Internal Server Error' />}>
        <BranchDetailSectionSuspense branchId={branchId} />
      </ErrorBoundary>
    </Suspense>
  );
}

function BranchDetailSectionSuspense({
  branchId,
}: Readonly<{ branchId: string }>) {
  const [data] = trpc.branch.getById.useSuspenseQuery({
    id: branchId,
  });
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-row gap-4 max-[840px]:flex-col'>
        <section className='flex flex-col gap-2 flex-1 w-full'>
          <MapSection
            data={{
              latitude: data.latitude,
              longitude: data.longitude,
            }}
            className=' w-full h-full max-[840px]:h-[480px] max-[840px]:w-full'
          />
        </section>
        <section className='flex flex-col gap-4 max-w-[30rem] max-[840px]:max-w-full w-full border-2 rounded-md p-4'>
          <h1>{data.name}</h1>
          <div className='flex flex-row gap-2'>
            <MapPin className='w-10' />
            <span className='text-sm text-muted-foreground text-justify'>
              {data.location_detail}
              {", "}
              {data.google_map_address}
            </span>
          </div>
          <div className='flex flex-row gap-2'>
            <Phone className='w-5' />
            <p className='text-sm'>
              {parsePhoneNumber(data.phone_number)?.formatInternational()}
            </p>
          </div>
          <Separator />
          <div className='flex flex-row justify-around items-center'>
            <div className='flex flex-col items-center hover:text-muted cursor-pointer'>
              <Phone className='w-5' />
              <p className='text-sm'>Call</p>
            </div>
            <Link
              href={`https://www.google.com/maps?q=${data.google_map_address}`}
              target='_blank'
              className='flex flex-col items-center hover:text-muted cursor-pointer'
            >
              <Navigation className='w-5' />
              <p className='text-sm'>Location</p>
            </Link>
          </div>
          <Separator />
          <div className='flex flex-col gap-4'>
            <h1>Operating Hours</h1>
            <div className='flex flex-col gap-1'>
              {Object.entries(data.operatingHours).map(([day, hour]) => (
                <div key={day} className='flex flex-row '>
                  <p className='w-[15ch] capitalize'>{day}</p>
                  <p>{hour.closed ? "Closed" : hour.from + "-" + hour.to}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
