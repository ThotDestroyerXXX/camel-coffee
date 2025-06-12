"use client";
import MapSection from "@/components/map/interactive-map";
import { Label } from "@/components/ui/label";
import AddressDisplay from "@/modules/admin/branch/ui/components/address-display";
import { LatLngTuple } from "leaflet";
import { MapPinHouse } from "lucide-react";
import { useCallback, useRef } from "react";

interface UserAddressProps {
  coordsRef: React.RefObject<LatLngTuple>;
  addressRef: React.RefObject<string>;
}

export default function UserAddress({
  coordsRef,
  addressRef,
}: Readonly<UserAddressProps>) {
  const geocodingRef = useRef({
    isProcessing: false,
  });

  const handleMoveEnd = useCallback(
    async (latlng: LatLngTuple) => {
      if (geocodingRef.current.isProcessing) return;

      geocodingRef.current.isProcessing = true;
      coordsRef.current = latlng;
      addressRef.current = "";

      setTimeout(async () => {
        fetch(`/api/geocode?lat=${latlng[0]}&lon=${latlng[1]}`)
          .then((data) => {
            return data.json();
          })
          .then((data) => {
            if (data?.display_name) {
              addressRef.current = data.display_name;
            }
          })
          .catch((error) => {
            console.error("Error reverse geocoding:", error);
          })
          .finally(() => (geocodingRef.current.isProcessing = false));
      }, 1000);
    },
    [addressRef, coordsRef, geocodingRef]
  );

  return (
    <section className='flex flex-col max-w-[30rem] w-full gap-4 border-2 rounded-md shadow-sm overflow-hidden'>
      <div className='bg-muted p-4 text-background'>
        <h3 className='text-lg font-semibold'>User Address</h3>
      </div>
      <div className='p-4 flex flex-col gap-4'>
        <div className='flex flex-col gap-2'>
          <Label htmlFor='email'>
            <MapPinHouse className='w-4' />
            User Address
          </Label>
          <AddressDisplay addressRef={addressRef} />
        </div>
        <div
          className='size-full'
          aria-label='Interactive map for selecting branch location'
        >
          <MapSection coordsRef={coordsRef} onMoveEnd={handleMoveEnd} />
        </div>
      </div>
    </section>
  );
}
