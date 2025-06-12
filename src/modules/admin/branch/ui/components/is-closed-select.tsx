import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function IsClosedSelect({
  day,
  disabled,
}: Readonly<{
  day: string;
  disabled: boolean;
}>) {
  return (
    <Select defaultValue='open' name={`closed-${day}`} disabled={disabled}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent className='mr-5'>
        <SelectGroup>
          <SelectItem value='open'>Open</SelectItem>
          <SelectItem value='close'>Close</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
