import { roleEnum } from "@/db/schema";
import { authenticator } from "@/hooks/authenticator";
import { ToastError } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { createUserValidation } from "@/validations/user";
import { upload } from "@imagekit/next";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export interface CreateUserHandlerType {
  e: React.FormEvent<HTMLFormElement>;
  image: File | null;
  address: string;
  latitude: number;
  longitude: number;
}

export const UpdateRoleHandler = (setLoading: (loading: boolean) => void) => {
  const utils = trpc.useUtils();
  const { mutate } = trpc.user.updateRole.useMutation({
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: async () => {
      await utils.invalidate();
      setLoading(false);
    },
    onError: (error) => {
      setLoading(false);
      ToastError(error);
    },
  });

  const handleUpdateRole = async (
    userId: string,
    role: (typeof roleEnum.enumValues)[number]
  ) => {
    setLoading(true);
    mutate({ userId, role });
  };

  return { handleUpdateRole };
};

export const CreateUserHandler = (setLoading: (loading: boolean) => void) => {
  const utils = trpc.useUtils();
  const router = useRouter();
  const { mutate } = trpc.user.create.useMutation({
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: async () => {
      await utils.invalidate();
      toast.success("User created successfully!");
      router.push("/admin/users");
    },
    onError: (error) => {
      setLoading(false);
      ToastError(error);
    },
  });

  const handleCreateUser = async ({
    e,
    image,
    address,
    latitude,
    longitude,
  }: CreateUserHandlerType) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const userData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      role:
        (formData.get("role") as (typeof roleEnum.enumValues)[number]).length >
        0
          ? (formData.get("role") as (typeof roleEnum.enumValues)[number])
          : undefined,
      google_map_address: address,
      latitude: latitude,
      longitude: longitude,
      phone: formData.get("phone_number") as string,
      image: image,
    };

    try {
      const result = createUserValidation.safeParse(userData);
      if (!result.success) {
        ToastError(result.error);
        setLoading(false);
        return;
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
          file: result.data.image,
          fileName: result.data.image.name, // Optionally set a custom file name
          folder: "/camel-coffee/user",
          useUniqueFileName: true,
          overwriteFile: true,
        });

        if (!uploadResponse?.url) {
          throw new Error("Image upload failed");
        }
        mutate({
          name: result.data.name,
          email: result.data.email,
          password: result.data.password,
          role: result.data.role,
          image: uploadResponse.url,
          google_map_address: result.data.google_map_address,
          latitude: result.data.latitude,
          longitude: result.data.longitude,
          phone: result.data.phone,
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

  return { handleCreateUser };
};
