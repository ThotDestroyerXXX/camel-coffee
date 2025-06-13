import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { memo } from "react";
import "@/plain.css";
import PhoneInputComponent from "@/components/phone-input";

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
        <Input
          type='text'
          id='name'
          name='name'
          className='w-full'
          disabled={loading}
        />
      </div>
      <div className='flex flex-col gap-2'>
        <Label className='text-sm font-semibold' htmlFor='phone_number'>
          Phone Number
        </Label>
        <PhoneInputComponent disabled={loading} />
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
