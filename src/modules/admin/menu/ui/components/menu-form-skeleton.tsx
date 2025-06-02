import { Skeleton } from "@/components/ui/skeleton";

export function MenuFormSkeleton() {
  return (
    <div className='flex flex-col gap-4'>
      <section>
        <Skeleton className='w-full h-20' />
      </section>
      <div className='flex gap-4 justify-between flex-wrap flex-row-reverse'>
        <div className='min-w-[300px] max-md:w-full gap-4 flex flex-col'>
          <section>
            <Skeleton className='w-full h-[22rem]' />
          </section>
          <section>
            <Skeleton className='w-full h-30' />
          </section>
        </div>
        <div className='max-md:w-full flex-1 gap-4 flex flex-col'>
          <section>
            <Skeleton className='w-full h-64' />
          </section>
          <section>
            <Skeleton className='w-full h-40' />
          </section>
          <section>
            <Skeleton className='w-full h-96' />
          </section>
        </div>
      </div>
    </div>
  );
}
