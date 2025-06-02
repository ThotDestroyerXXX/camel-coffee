import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CircleCheck } from "lucide-react";

interface VariationCheckboxProps {
  value: {
    id: number;
    name: string;
  }[];
  disabled?: boolean;
  defaultValues?: number[];
}

export default function VariationCheckbox({
  value,
  disabled,
  defaultValues = [],
}: Readonly<VariationCheckboxProps>) {
  return (
    <div className='flex flex-row gap-4 flex-wrap'>
      {value.map((variation) => (
        <CheckboxPrimitive.Root
          key={variation.id}
          defaultChecked={defaultValues.includes(variation.id)}
          disabled={disabled}
          name={"variations"}
          value={variation.id.toString()}
          className='relative ring-[1px] ring-border rounded-sm px-6 py-3 text-start text-muted-foreground data-[state=checked]:ring-2 data-[state=checked]:ring-primary data-[state=checked]:text-primary'
        >
          <span className='font-medium tracking-tight text-sm'>
            {variation.name}
          </span>
          <CheckboxPrimitive.Indicator className='absolute top-1 right-1'>
            <CircleCheck className='fill-primary text-primary-foreground size-4' />
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
      ))}
    </div>
  );
}
