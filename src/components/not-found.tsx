import emptyImage from "@/../public/empty-image.png";
import Image from "next/image";

export default function NotFound({ message }: Readonly<{ message: string }>) {
  return (
    <div className='flex items-center justify-center h-full flex-col gap-4'>
      <Image src={emptyImage} alt='empty' width={200} height={200} />
      <p className='text-muted-foreground'>{message}</p>
    </div>
  );
}
