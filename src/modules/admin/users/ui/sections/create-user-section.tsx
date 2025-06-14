"use client";

import { BreadcrumbLayout } from "@/components/beradcrumb-layout";
import NotFound from "@/components/not-found";
import { Button } from "@/components/ui/button";
import { Suspense, useRef, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { LatLngTuple } from "leaflet";
import UserProfile from "../components/user-profile";
import UserInformation from "../components/user-information";
import UserAddress from "../components/user-address";
import { CreateUserHandler } from "../../handlers/user-handler";
import Loading from "@/components/loading";

const breadCrumbList = [
  { label: "Admin", href: "/admin" },
  { label: "Users", href: "/admin/users" },
  { label: "Create User" },
];

export default function CreateUserSection() {
  return (
    <Suspense fallback={<p>Loading</p>}>
      <ErrorBoundary fallback={<NotFound message='Internal Server Error' />}>
        <CreateUserSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
}

function CreateUserSectionSuspense() {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const coordsRef = useRef<LatLngTuple>([-6.295266325289677, 106.667673487407]);
  const addressRef = useRef<string>("");

  const { handleCreateUser } = CreateUserHandler(setLoading);

  return (
    <>
      {loading && <Loading />}
      <form
        onSubmit={(e) => {
          handleCreateUser({
            e,
            image,
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
                Add User
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
                Add User
              </Button>
            </div>
          </section>

          <div className='flex flex-row flex-wrap gap-6 justify-center items-start w-full'>
            <div className='flex flex-col items-center gap-4'>
              <UserProfile
                image={image}
                setImage={setImage}
                loading={loading}
              />
            </div>
            <div className='flex flex-col gap-4 justify-center max-sm:w-full items-center'>
              <UserInformation loading={loading} />
              <UserAddress addressRef={addressRef} coordsRef={coordsRef} />
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
