import { authenticator } from "@/hooks/authenticator";
import { ToastError } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { itemValidation } from "@/validations/item";
import { upload } from "@imagekit/next";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export interface FormDataType {
  e: React.FormEvent<HTMLFormElement>;
  image: File | string | null;
  data: {
    values: {
      id: number;
      name: string;
      drink_option_type_id: number;
      additional_price: string;
    }[];
    id: number;
    name: string;
    created_at: Date;
    updated_at: Date;
  }[];
  image_url?: string;
  item_id?: string;
}

export const CreateHandler = (setLoading: (loading: boolean) => void) => {
  const router = useRouter();
  const utils = trpc.useUtils();
  const { mutate } = trpc.menu.create.useMutation({
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: async () => {
      await utils.invalidate();
      router.push("/admin/menu");
      toast.success("Item created successfully");
    },
    onError: (error) => {
      setLoading(false);
      ToastError(error);
    },
  });

  const OnSubmit = async ({ e, image, data }: FormDataType) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const type = form.get("item-type") || undefined;
    const drink_type =
      type !== "drink" ? undefined : form.get("drink-type") || null;

    const formData = {
      name: form.get("name") as string,
      description: form.get("description") as string,
      price: Number(form.get("price")),
      variations: form.getAll("variations") as string[] | undefined,
      type: type,
      drink_type: drink_type,
      image: image,
    };

    if (!image || !(image instanceof File)) {
      toast.error("Please select a valid image file");
      setLoading(false);
      return;
    }

    if (type === "drink") {
      const selectedVariationIds = new Set(formData.variations || []);
      const missingOptionTypes = data.filter(
        (optionType) =>
          !optionType.values.some((val) =>
            selectedVariationIds.has(val.id.toString())
          )
      );

      if (missingOptionTypes.length > 0) {
        missingOptionTypes.forEach((optionType) => {
          toast.error(
            `Please select at least one value for ${optionType.name}`
          );
        });
        setLoading(false);
        return;
      }
    }

    try {
      const result = itemValidation.safeParse(formData);
      if (!result.success) {
        ToastError(result.error);
        setLoading(false);
        return;
      }

      const { name, description, price, type, drink_type, image, variations } =
        result.data;

      try {
        const authParams = await authenticator();
        const { signature, expire, token, publicKey } = authParams;

        const uploadResponse = await upload({
          // Authentication parameters
          expire: expire,
          token,
          signature,
          publicKey,
          file: image,
          fileName: image.name, // Optionally set a custom file name
          folder: "/camel-coffee/menu",
          useUniqueFileName: true,
          overwriteFile: true,
        });

        if (!uploadResponse?.url) {
          throw new Error("Image upload failed");
        }
        mutate({
          name,
          description,
          price: price,
          type,
          drink_type: drink_type ?? undefined,
          image: uploadResponse.url,
          variations: variations,
        });
      } catch (error) {
        console.error("Image upload error:", error);
        toast.error("An error occurred while uploading the image");
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error("Validation error:", error);
      toast.error("An error occurred while validating the form data");
      setLoading(false);
      return;
    }
  };

  return { OnSubmit };
};
