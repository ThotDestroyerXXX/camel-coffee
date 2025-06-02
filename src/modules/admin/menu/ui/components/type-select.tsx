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

interface TypeSelectProps {
  value: string[];
  classname?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  name: string;
  defaultValue: string | undefined;
}

export function TypeSelect({
  value,
  disabled,
  classname,
  onChange,
  name,
  defaultValue,
}: Readonly<TypeSelectProps>) {
  return (
    <Select
      disabled={disabled}
      onValueChange={onChange}
      name={name}
      defaultValue={defaultValue}
    >
      <SelectTrigger className={clsx("w-full", classname)}>
        <SelectValue placeholder='Select Item Type' />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {value.map((value) => (
            <SelectItem key={value} value={value}>
              {value}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
