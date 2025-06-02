import { Skeleton } from "@/components/ui/skeleton";

export default function UserTableSkeleton() {
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center py-4'>
        <Skeleton className='h-10 max-w-sm w-full' />
        <Skeleton className='h-10 w-24 ml-2' />
      </div>
      <Skeleton className='h-[25rem] w-full' />
    </div>
  );
}
