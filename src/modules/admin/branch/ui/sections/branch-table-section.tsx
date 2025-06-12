"use client";
import { InfiniteScroll } from "@/components/infinite-scroll";
import NotFound from "@/components/not-found";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";
import Link from "next/link";
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default function BranchTableSection() {
  return (
    <Suspense fallback={<div>Loading branches...</div>}>
      <ErrorBoundary fallback={<NotFound message='Internal Server Error' />}>
        <BranchTableSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
}

function BranchTableSectionSuspense() {
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [data, query] = trpc.branch.getMany.useSuspenseInfiniteQuery(
    {
      limit: DEFAULT_LIMIT,
      search,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const branches = data.pages.flatMap((page) => page.items);

  return (
    <div className='flex flex-col'>
      <section className='flex flex-row flex-wrap justify-between gap-4 max-sm:flex-col items-center'>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const searchValue = formData.get("search") as string;
            setSearch(searchValue?.trim());
          }}
          className='flex w-full max-w-md max-sm:max-w-full'
        >
          <div className='flex items-center py-4 w-full'>
            <Input
              placeholder='Filter branch name...'
              defaultValue={search}
              className=' w-full max-sm:max-w-full placeholder:text-gray-500'
              name='search'
            />
            <Button variant='outline' className='ml-2'>
              Search
            </Button>
          </div>
        </form>
        <div>
          <Link
            href={"/admin/branch/create"}
            className='max-sm:w-full w-[5rem]'
          >
            <Button variant='outline' className='max-sm:w-full'>
              Add Branch
            </Button>
          </Link>
        </div>
      </section>
      <section className='mt-4'>
        {branches && branches.length > 0 ? (
          <div className='flex flex-row flex-wrap gap-4'>
            {branches.map((branch) => (
              <Link href={`/admin/branch/${branch.id}`} key={branch.id}>
                <div className='p-4 border w-[20rem] flex flex-col gap-2 rounded-md shadow-sm hover:shadow-md transition-shadow'>
                  <div className='flex flex-row gap-4 items-center'>
                    <h3 className='text-lg font-semibold line-clamp-1'>
                      {branch.name}
                    </h3>
                    <Badge className='text-red-600' variant={"outline"}>
                      {branch.is_active ? "" : "Inactive"}
                    </Badge>
                  </div>
                  <p className='text-sm text-gray-600 line-clamp-2'>
                    {branch.location_detail}
                    {", "}
                    {branch.google_map_address}
                  </p>
                  <div className='flex justify-between'>
                    <p className='text-sm text-gray-500 line-clamp-1'>
                      {branch.phone_number}
                    </p>
                    <p className='text-blue-500 hover:underline text-sm'>
                      View Details &gt;
                    </p>
                  </div>
                </div>
              </Link>
            ))}
            <InfiniteScroll
              isManual={false}
              hasNextPage={query.hasNextPage}
              isFetchingNextPage={query.isFetchingNextPage}
              fetchNextPage={query.fetchNextPage}
            />
          </div>
        ) : (
          <NotFound message='No branches found.' />
        )}
      </section>
    </div>
  );
}
