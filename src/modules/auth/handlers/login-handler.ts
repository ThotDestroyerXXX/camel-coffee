import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

export const LoginHandler = (setLoading: (loading: boolean) => void) => {
  const router = useRouter();

  const OnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const formData = {
      email: form.get("email") as string,
      password: form.get("password") as string,
      remember: form.get("remember") as string,
    };
    try {
      const { email, password, remember } = formData;
      const { data } = await authClient.signIn.email(
        {
          email,
          password,
          rememberMe: remember === "on",
          callbackURL: "/",
        },
        {
          onRequest: () => {
            setLoading(true);
          },
          onSuccess: () => {
            toast.success("Login successful");
            router.push("/");
            router.refresh();
          },
          onError: (ctx) => {
            toast.error(ctx.error.message);
            setLoading(false);
          },
        }
      );
      return data;
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while processing your request");
      setLoading(false);
    }
  };
  return { OnSubmit };
};
