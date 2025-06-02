"use client";
import { trpc } from "@/trpc/client";
import MenuCard from "../components/menu-card";
import { Button } from "@/components/ui/button";
import { Suspense, useState } from "react";
import Link from "next/link";
import MenuSearch from "../components/menu-search";

import { updateAvailabilityHandler } from "../../handlers/update-handler";
import MenuSectionSkeleton from "../components/menu-section-skeleton";
import NotFound from "@/components/not-found";
import { ErrorBoundary } from "react-error-boundary";

export default function MenuSection() {
  return (
    <Suspense fallback={<MenuSectionSkeleton />}>
      <ErrorBoundary fallback={<NotFound message='Internal Server Error' />}>
        <MenuSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
}

export function MenuSectionSuspense() {
  const [data] = trpc.menu.getMany.useSuspenseQuery();
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  const { updateAvailability } = updateAvailabilityHandler(setLoading);

  const filteredData = data.filter((item) =>
    item.item.name.toLowerCase().includes(search.toLowerCase().trim())
  );

  return (
    <div className='flex flex-col gap-4'>
      <section className='flex flex-row flex-wrap justify-between gap-4 max-sm:flex-col'>
        <div className='flex w-full max-w-md max-sm:max-w-full'>
          <MenuSearch setSearch={setSearch} />
        </div>
        <div>
          <Link href={"/admin/menu/create"} className='max-sm:w-full w-[5rem]'>
            <Button
              variant='outline'
              className='max-sm:w-full'
              disabled={loading}
            >
              Add Item
            </Button>
          </Link>
        </div>
      </section>
      <section>
        {filteredData && filteredData.length > 0 ? (
          <div className=' flex flex-row flex-wrap w-full gap-4 justify-center'>
            {filteredData.map((item) => (
              <MenuCard
                item={item}
                key={item.item.id}
                updateAvailability={updateAvailability}
                disabled={loading}
              />
            ))}
          </div>
        ) : (
          <NotFound message='No menu items found.' />
        )}
      </section>
    </div>
  );
}
