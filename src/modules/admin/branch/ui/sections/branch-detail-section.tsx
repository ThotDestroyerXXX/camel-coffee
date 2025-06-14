"use client";
import NotFound from "@/components/not-found";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { MapPin, Navigation, Phone, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import parsePhoneNumber from "libphonenumber-js";
import MapSection from "@/components/map/non-interactive-map";
import BranchDetailSkeleton from "../components/branch-detail-skeleton";
import AssignSellerDialog from "./assign-seller-dialog";
import { BreadcrumbLayout } from "@/components/beradcrumb-layout";
import ActiveBadge from "@/components/active-badge";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { UnassignSellerHandler } from "../../handlers/branch-handler";

export default function BranchDetailSection({
  branchId,
}: Readonly<{ branchId: string }>) {
  return (
    <Suspense fallback={<BranchDetailSkeleton />}>
      <ErrorBoundary fallback={<NotFound message='Internal Server Error' />}>
        <BranchDetailSectionSuspense branchId={branchId} />
      </ErrorBoundary>
    </Suspense>
  );
}

const breadCrumbList = [
  { label: "Admin", href: "/admin" },
  { label: "Branches", href: "/admin/branch" },
  { label: "Branch Details" },
];

function BranchDetailSectionSuspense({
  branchId,
}: Readonly<{ branchId: string }>) {
  const [data] = trpc.branch.getById.useSuspenseQuery({
    id: branchId,
  });

  const { handleUnassignSeller } = UnassignSellerHandler();

  return (
    <div className='flex flex-col gap-4'>
      <section className='flex flex-col flex-wrap bg-muted shadow-md rounded-md p-4 gap-4 sticky top-4 z-10'>
        <div className='flex flex-row flex-wrap justify-between items-center gap-4'>
          <div className='flex flex-col gap-1 text-background flex-shrink-0'>
            <h2 className='text-2xl font-semibold tracking-tighter max-sm:text-xl'>
              Branch Details
            </h2>
            <BreadcrumbLayout list={breadCrumbList} />
          </div>
          <div>
            {!data.sellerEmail ? (
              <AssignSellerDialog
                branchId={branchId}
                branchName={data.branch.name}
              />
            ) : (
              <ConfirmationDialog
                title='Unassign Seller'
                description={`Are you sure you want to unassign ${data.sellerEmail} from this branch?`}
                actionText='Unassign'
                onAction={async () =>
                  await handleUnassignSeller({
                    branchId,
                  })
                }
                triggerText='Unassign Seller'
                cancelText='Cancel'
              />
            )}
          </div>
        </div>
      </section>
      <div className='flex flex-row gap-4 max-[840px]:flex-col'>
        <section className='flex flex-col gap-2 flex-1 w-full'>
          <MapSection
            data={{
              latitude: data.branch.latitude,
              longitude: data.branch.longitude,
            }}
            className=' w-full h-full max-[840px]:h-[480px] max-[840px]:w-full'
          />
        </section>
        <section className='flex flex-col gap-4 max-w-[30rem] max-[840px]:max-w-full w-full border-2 rounded-md p-4'>
          <div className='flex flex-row gap-4 items-center'>
            <h1>{data.branch.name}</h1>
            <ActiveBadge isActive={data.branch.is_active} />
          </div>

          <div className='flex flex-row gap-2'>
            <MapPin className='w-11' />
            <span className='text-sm text-muted-foreground text-justify'>
              {data.branch.location_detail}
              {", "}
              {data.branch.google_map_address}
            </span>
          </div>
          <div className='flex flex-row gap-2 items-center'>
            <Phone className='w-5' />
            <p className='text-sm'>
              {parsePhoneNumber(
                data.branch.phone_number
              )?.formatInternational()}
            </p>
          </div>
          <div className='flex flex-row gap-2 items-center'>
            <User className='w-5' />
            <p className='text-sm'>
              {data.sellerEmail ?? "No Assigned Seller"}
            </p>
          </div>
          <Separator />
          <div className='flex flex-row justify-around items-center'>
            <div className='flex flex-col items-center hover:text-muted cursor-pointer'>
              <Phone className='w-5' />
              <p className='text-sm'>Call</p>
            </div>
            <Link
              href={`https://www.google.com/maps?q=${data.branch.google_map_address}`}
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
