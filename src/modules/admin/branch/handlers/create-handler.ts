import { dayEnum } from "@/db/schema";
import { ToastError } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { branchValidation } from "@/validations/branch";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface CreateBranchHandler {
  e: React.FormEvent<HTMLFormElement>;
  address: string;
  latitude: number;
  longitude: number;
}

export default function CreateBranchHandler(
  setLoading: (loading: boolean) => void
) {
  const router = useRouter();
  const utils = trpc.useUtils();

  const { mutate } = trpc.branch.create.useMutation({
    onSuccess: async () => {
      toast.success("Branch created successfully!");
      await utils.invalidate();
      router.push("/admin/branch");
      router.refresh();
    },
    onError: (error) => {
      ToastError(error);
      setLoading(false);
    },
  });

  const handleSubmit = async ({
    e,
    address,
    latitude,
    longitude,
  }: CreateBranchHandler & {
    e: React.FormEvent<HTMLFormElement>;
    address: string;
    latitude: number;
    longitude: number;
  }) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const days = dayEnum.enumValues;
    const operatingHours = days.reduce((acc, day) => {
      acc[day] = {
        from: formData.get(`time-from-${day}`) as string,
        to: formData.get(`time-to-${day}`) as string,
        closed: formData.get(`closed-${day}`) === "close", // or whatever value your IsClosedSelect uses
      };
      return acc;
    }, {} as Record<string, { from: string; to: string; closed: boolean }>);
    const branchData = {
      name: formData.get("name") as string,
      address: address,
      latitude: latitude,
      longitude: longitude,
      phone: formData.get("phone_number") as string,
      operatingHours: operatingHours,
      location_detail: formData.get("location_detail") as string,
    };

    console.log("Branch Data:", branchData);

    try {
      const result = branchValidation.safeParse(branchData);
      if (!result.success) {
        ToastError(result.error);
        setLoading(false);
        return;
      }
      const errors: string[] = [];

      for (const day of days) {
        const { from, to, closed } = operatingHours[day];
        if (!closed && from && to && from >= to) {
          errors.push(
            `Opening time must be before closing time for ${
              day.charAt(0).toUpperCase() + day.slice(1)
            }. Please check your input.`
          );
        }
      }

      if (errors.length > 0) {
        errors.forEach((err) => toast.error(err));
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error("Validation error:", error);
      setLoading(false);
    }

    mutate({
      name: branchData.name,
      address: branchData.address,
      latitude: branchData.latitude,
      longitude: branchData.longitude,
      phone: branchData.phone,
      location_detail: branchData.location_detail,
      operatingHours: branchData.operatingHours,
    });
  };

  return {
    handleSubmit,
  };
}
