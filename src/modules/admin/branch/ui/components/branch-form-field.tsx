import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { memo } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/plain.css";

const BranchFormFields = memo(function BranchFormFields({
  loading,
}: {
  loading: boolean;
}) {
  return (
    <>
      <div className='flex flex-col gap-2'>
        <Label className='text-sm font-semibold' htmlFor='name'>
          Branch Name
        </Label>
        <Input type='text' id='name' name='name' className='w-full' />
      </div>
      <div className='flex flex-col gap-2'>
        <Label className='text-sm font-semibold' htmlFor='phone_number'>
          Phone Number
        </Label>
        <PhoneInput
          buttonClass={"rounded-md"}
          inputClass={cn(
            "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
          )}
          countryCodeEditable={false}
          country={"id"}
          disableSearchIcon
          autoFormat={false}
          inputProps={{
            name: "phone_number",
          }}
          enableSearch
          copyNumbersOnly
        />
      </div>
      <div className='flex flex-col gap-2'>
        <Label className='text-sm font-semibold' htmlFor='location_detail'>
          Location Detail
        </Label>
        <Textarea
          name='location_detail'
          placeholder='Floor, building, or any other details'
          className='placeholder:text-gray-500 placeholder:text-sm'
          rows={3}
          disabled={loading}
        />
      </div>
    </>
  );
});

export default BranchFormFields;
