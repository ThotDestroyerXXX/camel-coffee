import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import clsx from "clsx";

interface VariationSelectProps {
  value: {
    id: number;
    name: string;
  }[];
  classname?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
}

export function VariationSelect({
  value,
  disabled,
  classname,
  onChange,
}: Readonly<VariationSelectProps>) {
  return (
    <Select disabled={disabled} onValueChange={onChange}>
      <SelectTrigger className={clsx("w-full", classname)}>
        <SelectValue placeholder='Select Item Type' />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {value.map((value) => (
            <SelectItem key={value.id} value={value.name}>
              {value.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
