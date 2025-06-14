import { Badge } from "./ui/badge";

export default function ActiveBadge({
  isActive,
}: Readonly<{ isActive: boolean }>) {
  return (
    <Badge
      className={isActive ? "text-green-600" : "text-red-600"}
      variant={"outline"}
    >
      {isActive ? "active" : "Inactive"}
    </Badge>
  );
}
