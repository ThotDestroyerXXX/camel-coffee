"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SellerComboboxType {
  data: {
    id: string;
    name: string;
    email: string;
  }[];
  valueRef: React.RefObject<string | undefined>;
  disabled?: boolean;
}

export function SellerCombobox({
  data,
  valueRef,
  disabled = false,
}: Readonly<SellerComboboxType>) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<string | undefined>(
    valueRef.current
  );
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          aria-expanded={open}
          className='w-full justify-between'
          disabled={disabled}
        >
          {value
            ? data.find((seller) => seller.id === value)?.email
            : "Select seller..."}
          <ChevronsUpDown className='opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-full p-0'>
        <Command>
          <CommandInput
            placeholder='Search seller...'
            className='h-9'
            disabled={disabled}
          />
          <CommandList>
            <CommandEmpty>No seller found</CommandEmpty>
            <CommandGroup>
              {data.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.email}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : item.id);
                    valueRef.current = currentValue === value ? "" : item.id;
                    setOpen(false);
                  }}
                  disabled={disabled}
                >
                  {item.email}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === item.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
