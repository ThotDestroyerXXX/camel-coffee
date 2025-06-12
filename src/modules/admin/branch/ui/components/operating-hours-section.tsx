import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { dayEnum } from "@/db/schema";
import { memo } from "react";
import DayTimeInput from "./day-time-input";

const OperatingHoursSection = memo(function OperatingHoursSection({
  loading,
}: {
  loading: boolean;
}) {
  return (
    <div className='flex flex-col gap-4'>
      <Label className='text-sm font-semibold'>Branch Operating Hours</Label>
      <Button
        type='button'
        variant='outline'
        size='sm'
        disabled={loading}
        onClick={() => {
          const defaultOpenTime = "09:00";
          const defaultCloseTime = "21:00";
          dayEnum.enumValues.forEach((day) => {
            const fromInput = document.getElementsByName(
              `time-from-${day}`
            )[0] as HTMLInputElement;
            const toInput = document.getElementsByName(
              `time-to-${day}`
            )[0] as HTMLInputElement;
            if (fromInput) fromInput.value = defaultOpenTime;
            if (toInput) toInput.value = defaultCloseTime;
          });
        }}
      >
        Set Default Times
      </Button>
      <div className='flex flex-col gap-4'>
        {dayEnum.enumValues.map((day) => (
          <div key={day} className='flex flex-row gap-2 w-full'>
            <DayTimeInput day={day} disabled={loading} />
          </div>
        ))}
      </div>
    </div>
  );
});

export default OperatingHoursSection;
