import { authClient } from "@/lib/auth-client";
import { userValidation } from "@/validations/user";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

export const RegisterHandler = (setLoading: (loading: boolean) => void) => {
  const router = useRouter();

  const OnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const formData = {
      name: form.get("name") as string,
      email: form.get("email") as string,
      password: form.get("password") as string,
    };
    try {
      const result = userValidation.safeParse(formData);
      if (!result.success) {
        const errors = result.error.format();

        (["name", "email", "password"] as const).forEach((key) => {
          const fieldError = errors[key];
          if (fieldError?._errors?.length) {
            toast.error(fieldError._errors[0]);
          }
        });

        setLoading(false);
        return;
      }
      const { name, email, password } = result.data;
      const { data } = await authClient.signUp.email(
        {
          email,
          password,
          name,
          callbackURL: "/",
        },
        {
          onRequest: () => {
            setLoading(true);
          },
          onSuccess: () => {
            toast.success("Registration successful");
            router.push("/");
            setLoading(false);
          },
          onError: (ctx) => {
            toast.error(ctx.error.message);
            setLoading(false);
          },
        }
      );
      setLoading(false);
      return data;
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while processing your request");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  return { OnSubmit };
};
