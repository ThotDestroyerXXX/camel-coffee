import { Skeleton } from "@/components/ui/skeleton";

export default function MenuSectionSkeleton() {
  return (
    <div className='flex flex-col gap-4'>
      <section>
        <Skeleton className='w-full h-36' />
      </section>
      <section>
        <div className=' flex flex-row flex-wrap w-full gap-4 justify-center'>
          {Array.from({ length: 10 }).map((tes, ind) => (
            <div key={`iterate-${tes}-${ind}`}>
              <Skeleton className='w-[15rem] aspect-square rounded-md mb-2' />
              <div className='flex flex-col gap-2'>
                <Skeleton className='h-6 w-3/4' />
                <Skeleton className='h-4 w-1/2' />
                <Skeleton className='h-8 w-1/2 mt-auto' />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
