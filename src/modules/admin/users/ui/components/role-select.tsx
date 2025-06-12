import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { roleEnum } from "@/db/schema";
import { cn } from "@/lib/utils";

interface RoleSelectProps {
  disabled?: boolean;
  className?: string;
}

export default function RoleSelect({
  disabled,
  className,
}: Readonly<RoleSelectProps>) {
  return (
    <Select disabled={disabled} name={"role"}>
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue placeholder='Select User Role' />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {roleEnum.enumValues.map((role) => (
            <SelectItem key={role} value={role}>
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
