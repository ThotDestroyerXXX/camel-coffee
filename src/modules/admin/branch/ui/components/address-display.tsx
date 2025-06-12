import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { memo, useEffect, useState } from "react";

function useRefValue<T>(ref: React.RefObject<T>) {
  const [, setTick] = useState(0);
  useEffect(() => {
    let prev = ref.current;
    const interval = setInterval(() => {
      if (ref.current !== prev) {
        prev = ref.current;
        setTick((tick) => tick + 1);
      }
    }, 200); // Poll every 200ms
    return () => clearInterval(interval);
  }, [ref]);
  return ref.current;
}

const AddressDisplay = memo(
  ({ addressRef }: { addressRef: React.RefObject<string> }) => {
    const address = useRefValue(addressRef);
    return address ? (
      <Textarea
        disabled
        aria-disabled
        className='text-sm text-muted-foreground block text-justify'
        placeholder='Select a location on the map to see the address'
        value={address}
      />
    ) : (
      <Skeleton className='w-full h-15' />
    );
  }
);
AddressDisplay.displayName = "AddressDisplay";

export default AddressDisplay;
