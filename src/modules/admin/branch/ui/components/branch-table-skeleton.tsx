import { Skeleton } from "@/components/ui/skeleton";

export default function BranchTableSkeleton() {
  return (
    <div className='flex flex-col'>
      <section className='flex flex-row flex-wrap justify-between gap-4 max-sm:flex-col items-center'>
        <div className='flex w-full max-w-md max-sm:max-w-full'>
          <div className='flex items-center py-4 w-full'>
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-24 ml-2' />
          </div>
        </div>
        <div className='flex items-center gap-2 max-sm:w-full'>
          <Skeleton className='h-10 w-24 max-sm:w-full' />
        </div>
      </section>
      <section className='mt-4'>
        <div className='flex flex-row flex-wrap gap-4 max-sm:justify-center max-sm:flex-col'>
          {Array.from({ length: 20 }).map((branch, idx) => (
            <div key={`${branch}-${idx}`}>
              <div className='p-4 border w-screen max-w-[20rem] max-sm:max-w-full max-sm:w-full flex flex-col gap-2 rounded-md shadow-sm hover:shadow-md transition-shadow'>
                <div className='flex flex-row gap-4 items-center'>
                  <Skeleton className='w-24 h-8' />
                  <Skeleton className='h-5 w-14' />
                </div>
                <Skeleton className='h-12 w-full' />
                <div className='flex justify-between'>
                  <Skeleton className='h-6 w-32' />
                  <Skeleton className='h-6 w-24' />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
