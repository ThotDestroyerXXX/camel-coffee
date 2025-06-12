import { roleEnum } from "@/db/schema";
import { ToastError } from "@/lib/utils";
import { trpc } from "@/trpc/client";

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
