"use client";
import { useCallback, useState, useRef, Suspense } from "react";
import type { LatLngTuple } from "leaflet";
import { ErrorBoundary } from "react-error-boundary";
import NotFound from "@/components/not-found";
import CreateBranchSkeleton from "../components/create-branch-skeleton";
import { Button } from "@/components/ui/button";
import { BreadcrumbLayout } from "@/components/beradcrumb-layout";
import BranchFormFields from "../components/branch-form-field";
import OperatingHoursSection from "../components/operating-hours-section";
import MapSection from "@/components/map/interactive-map";
import AddressDisplay from "../components/address-display";
import CreateBranchHandler from "../../handlers/create-handler";
import Loading from "@/components/loading";

function CreateBranchSectionSuspense() {
  const coordsRef = useRef<LatLngTuple>([-6.295266325289677, 106.667673487407]);
  const addressRef = useRef<string>("");

  const [loading, setLoading] = useState(false);

  const geocodingRef = useRef({
    isProcessing: false,
  });

  const handleMoveEnd = useCallback(async (latlng: LatLngTuple) => {
    if (geocodingRef.current.isProcessing) return;

    geocodingRef.current.isProcessing = true;
    coordsRef.current = latlng;
    addressRef.current = "";

    setTimeout(async () => {
      fetch(`/api/geocode?lat=${latlng[0]}&lon=${latlng[1]}`)
        .then((data) => {
          return data.json();
        })
        .then((data) => {
          if (data?.display_name) {
            addressRef.current = data.display_name;
          }
        })
        .catch((error) => {
          console.error("Error reverse geocoding:", error);
        })
        .finally(() => (geocodingRef.current.isProcessing = false));
    }, 1000);
  }, []);

  const breadCrumbList = [
    { label: "Admin", href: "/admin" },
    { label: "Branches", href: "/admin/branch" },
    { label: "Create Branch" },
  ];

  const { handleSubmit } = CreateBranchHandler(setLoading);

  return (
    <>
      {loading && <Loading />}
      <form
        onSubmit={(e) => {
          handleSubmit({
            e,
            address: addressRef.current,
            latitude: coordsRef.current[0],
            longitude: coordsRef.current[1],
          });
        }}
      >
        <div className='flex flex-col gap-4'>
          <section className='flex flex-row flex-wrap justify-between items-center bg-muted shadow-md rounded-md p-4 gap-4 sticky top-4 z-10'>
            <div className='flex flex-col gap-1 text-background flex-shrink-0'>
              <h2 className='text-2xl font-semibold tracking-tighter'>
                Add Branch
              </h2>
              <BreadcrumbLayout list={breadCrumbList} />
            </div>
            <div className='flex flex-row gap-4 flex-shrink-0 max-md:w-full max-md:justify-end'>
              <Button
                variant='destructive'
                className='max-md:flex-1 max-md:w-auto'
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant='outline'
                className='max-md:flex-1 max-md:w-auto'
                disabled={loading}
              >
                Add Branch
              </Button>
            </div>
          </section>
          <div className='flex flex-row gap-4 max-[840px]:flex-col'>
            <section className='flex flex-col gap-2 flex-1 w-full'>
              <div className='flex flex-col gap-2'>
                <span className='text-sm font-semibold'>Selected Location</span>
                <AddressDisplay addressRef={addressRef} />
              </div>
              <div
                className=' w-full h-[480px]'
                aria-label='Interactive map for selecting branch location'
              >
                <MapSection coordsRef={coordsRef} onMoveEnd={handleMoveEnd} />
              </div>
            </section>
            <section className='flex flex-col gap-4 max-w-[30rem] max-[840px]:max-w-full w-full'>
              <BranchFormFields loading={loading} />
              <OperatingHoursSection loading={loading} />
            </section>
          </div>
        </div>
      </form>
    </>
  );
}

export default function CreateBranchSection() {
  return (
    <Suspense fallback={<CreateBranchSkeleton />}>
      <ErrorBoundary fallback={<NotFound message='Internal Server Error' />}>
        <CreateBranchSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
}
