import { Spinner } from "./ui/spinner";

export default function Loading() {
  return (
    <>
      <div className='fixed top-0 left-0 z-[100000] h-full w-full bg-black opacity-80'></div>
      <div className='fixed top-1/2 left-1/2 z-[1000000] -translate-x-1/2 -translate-y-1/2 transform'>
        <Spinner size={"large"} />
      </div>
    </>
  );
}
