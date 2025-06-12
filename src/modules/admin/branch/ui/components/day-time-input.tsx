import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import IsClosedSelect from "./is-closed-select";

export default function DayTimeInput({
  day,
  disabled,
}: Readonly<{
  day: string;
  disabled: boolean;
}>) {
  return (
    <>
      <div className='flex flex-col gap-2 flex-1'>
        <Label htmlFor={`${day}`}>Day</Label>
        <Input
          type='text'
          id={`${day}`}
          name={`${day}`}
          value={day}
          disabled
          className='bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none capitalize'
        />
      </div>

      {/* Add a flex column that includes both checkbox and label */}

      <div className='flex flex-col gap-2 '>
        <Label htmlFor={`time-from-${day}`} className='px-1'>
          From
        </Label>
        <Input
          type='time'
          id={`time-from-${day}`}
          name={`time-from-${day}`}
          defaultValue='09:00'
          disabled={disabled}
          className='bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none'
        />
      </div>
      <div className='flex flex-col gap-2'>
        <Label htmlFor={`time-to-${day}`} className='px-1'>
          To
        </Label>
        <Input
          type='time'
          id={`time-to-${day}`}
          name={`time-to-${day}`}
          defaultValue='21:00'
          disabled={disabled}
          className='bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none'
        />
      </div>
      <div className='flex flex-col gap-2'>
        <Label htmlFor={`closed-${day}`} className='px-1'>
          Closed
        </Label>
        <div className='flex items-center'>
          <IsClosedSelect day={day} disabled={disabled} />
        </div>
      </div>
    </>
  );
}
