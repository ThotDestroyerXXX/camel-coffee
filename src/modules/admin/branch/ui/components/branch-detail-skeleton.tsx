import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function BranchDetailSkeleton() {
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-row gap-4 max-[840px]:flex-col'>
        <section className='flex flex-col gap-2 flex-1 w-full'>
          <Skeleton className=' w-full h-full max-[840px]:h-[480px] max-[840px]:w-full' />
        </section>
        <section className='flex flex-col gap-4 max-w-[30rem] max-[840px]:max-w-full w-full border-2 rounded-md p-4'>
          <div className='flex flex-row gap-4 items-center'>
            <Skeleton className='w-36 h-10' />
            <Skeleton className='w-10 h-4' />
          </div>

          <div className='flex flex-row gap-2'>
            <Skeleton className='size-5' />
            <Skeleton className='w-full h-15' />
          </div>
          <div className='flex flex-row gap-2 items-center'>
            <Skeleton className='size-5' />
            <Skeleton className='w-full h-5' />
          </div>
          <div className='flex flex-row gap-2 items-center'>
            <Skeleton className='size-5' />
            <Skeleton className='w-full h-5' />
          </div>
          <Separator />
          <div className='flex flex-row justify-around items-center'>
            <div className='flex flex-col items-center gap-3'>
              <Skeleton className='size-8' />
              <Skeleton className='w-15 h-5' />
            </div>
            <div className='flex flex-col items-center gap-3'>
              <Skeleton className='size-8' />
              <Skeleton className='w-15 h-5' />
            </div>
          </div>
          <Separator />
          <div className='flex flex-col gap-4'>
            <Skeleton className='w-36 h-10' />
            <div className='flex flex-col gap-1'>
              {Array.from({ length: 7 }).map((tes, idx) => (
                <div key={`${tes}-${idx}`} className='flex flex-row gap-[8ch]'>
                  <Skeleton className='w-20 h-5' />
                  <Skeleton className='w-30 h-5' />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
