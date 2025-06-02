import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FormDataType } from "./create-handler";
import { ToastError } from "@/lib/utils";
import { itemValidation } from "@/validations/item";
import { authenticator } from "@/hooks/authenticator";
import { upload } from "@imagekit/next";

export const updateAvailabilityHandler = (
  setLoading: (loading: boolean) => void
) => {
  const utils = trpc.useUtils();
  const { mutate } = trpc.menu.updateAvailability.useMutation({
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: async () => {
      toast.success("Item availability updated successfully");
      await utils.invalidate();
      setLoading(false);
    },
    onError: (error) => {
      setLoading(false);
      toast.error("Failed to update item availability: " + error.message);
    },
  });

  const updateAvailability = (itemId: string, isAvailable: boolean) => {
    mutate({ itemId, isAvailable });
  };

  return { updateAvailability };
};

export const UpdateHandler = (setLoading: (loading: boolean) => void) => {
  const router = useRouter();
  const utils = trpc.useUtils();
  const { mutate } = trpc.menu.update.useMutation({
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: async () => {
      await utils.invalidate();
      router.push("/admin/menu");
      toast.success("Item updated successfully");
    },
    onError: (error) => {
      setLoading(false);
      toast.error("something went wrong: " + error.message);
    },
  });

  const OnSubmit = async ({
    e,
    image,
    data,
    image_url,
    item_id,
  }: FormDataType) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const type = form.get("item-type") || undefined;
    const drink_type =
      type !== "drink" ? undefined : form.get("drink-type") || null;

    const url =
      image_url?.replace(
        "https://ik.imagekit.io/",
        "https://api.imagekit.io/v1/files/"
      ) ?? "";
    const options = {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Basic ${process.env.IMAGEKIT_PRIVATE_KEY!}`,
      },
    };

    const formData = {
      name: form.get("name") as string,
      description: form.get("description") as string,
      price: Number(form.get("price")),
      variations: form.getAll("variations") as string[] | undefined,
      type: type,
      drink_type: drink_type,
      image: image,
    };

    if (!image) {
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

      if (image instanceof File && image_url) {
        try {
          await fetch(url, options);
        } catch (error) {
          console.error(error);
          throw new Error("Failed to delete old image");
        }

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
            id: item_id ?? "",
            name,
            description,
            price,
            type,
            drink_type,
            image: uploadResponse.url,
            variations: variations,
          });
        } catch (error) {
          console.error("Image upload error:", error);
          toast.error("An error occurred while uploading the image");
          setLoading(false);
          return;
        }
      } else if (image_url) {
        mutate({
          id: item_id ?? "",
          name,
          description,
          price,
          type,
          drink_type,
          image: image_url,
          variations: variations,
        });
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
