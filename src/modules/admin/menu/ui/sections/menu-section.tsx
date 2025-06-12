"use client";
import { trpc } from "@/trpc/client";
import MenuCard from "../components/menu-card";
import { Button } from "@/components/ui/button";
import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import MenuSearch from "../components/menu-search";

import { updateAvailabilityHandler } from "../../handlers/update-handler";
import MenuSectionSkeleton from "../components/menu-section-skeleton";
import NotFound from "@/components/not-found";
import { ErrorBoundary } from "react-error-boundary";
import { useDebouncedCallback } from "use-debounce";
import { useIsMobile } from "@/hooks/use-mobile";
import MenuList from "../components/menu-list";

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
  const debouncedSearch = useDebouncedCallback(
    // function
    (value) => {
      setSearch(value);
    },
    // delay in ms
    500
  );

  const { updateAvailability } = updateAvailabilityHandler(setLoading);

  const filteredData = useMemo(() => {
    const searchTerm = search.toLowerCase().trim();
    if (!searchTerm) return data;

    return data.filter((item) =>
      item.item.name.toLowerCase().includes(searchTerm)
    );
  }, [data, search]);

  const isMobile = useIsMobile();

  return (
    <div className='flex flex-col gap-4'>
      <section className='flex flex-row flex-wrap justify-between gap-4 max-sm:flex-col'>
        <div className='flex w-full max-w-md max-sm:max-w-full'>
          <MenuSearch setSearch={debouncedSearch} />
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
          <>
            {!isMobile ? (
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
              <div className='flex flex-col gap-4'>
                {filteredData.map((item) => (
                  <MenuList
                    item={item}
                    key={item.item.id}
                    updateAvailability={updateAvailability}
                    disabled={loading}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <NotFound message='No menu items found.' />
        )}
      </section>
    </div>
  );
}
