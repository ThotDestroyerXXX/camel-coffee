"use client";
import { trpc } from "@/trpc/client";
import { columns } from "../components/columns";
import { DataTable } from "../components/data-table";
import { DEFAULT_LIMIT } from "@/constants";
import { Suspense, useState } from "react";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import UserTableSkeleton from "../components/user-table-skeleton";
import { ErrorBoundary } from "react-error-boundary";
import NotFound from "@/components/not-found";
import Link from "next/link";

export default function UserTableSection() {
  return (
    <Suspense fallback={<UserTableSkeleton />}>
      <ErrorBoundary fallback={<NotFound message='Internal Server Error' />}>
        <UserTableSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
}

function UserTableSectionSuspense() {
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [data, query] = trpc.user.getMany.useSuspenseInfiniteQuery(
    {
      limit: DEFAULT_LIMIT,
      search,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const users = data.pages.flatMap((page) => page.items);
  return (
    <div className='flex flex-col'>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const searchValue = formData.get("search") as string;
          setSearch(searchValue?.trim());
        }}
      >
        <div className='flex items-center w-full py-4 max-sm:flex-col max-sm:gap-8'>
          <div className='flex items-center gap-2 flex-1 w-full'>
            <Input
              placeholder='Filter emails...'
              defaultValue={search}
              className='max-w-sm w-full placeholder:text-gray-500 max-sm:max-w-full'
              name='search'
            />
            <Button variant='outline' className='ml-2'>
              Search
            </Button>
          </div>
          <div className='flex items-center gap-2 max-sm:w-full max-sm:flex-1'>
            <Link href={`/admin/users/create`} className='max-sm:w-full'>
              <Button
                variant='outline'
                disabled={query.isFetchingNextPage || query.isLoading}
                className='max-sm:w-full'
              >
                Add User
              </Button>
            </Link>
          </div>
        </div>
      </form>
      <DataTable columns={columns} data={users} />
      <InfiniteScroll
        isManual={false}
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      />
    </div>
  );
}
