import { type AppRouter } from "@/trpc/routers/_app";
import { TRPCClientError, type TRPCClientErrorLike } from "@trpc/client";
import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { ZodError } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function ToastError(error: ZodError | TRPCClientErrorLike<AppRouter>) {
  if (error instanceof TRPCClientError) {
    const errorMessages = error.data?.zodError?.fieldErrors
      ? Object.values(error.data.zodError.fieldErrors).flat()
      : [error.message];
    errorMessages.forEach((msg) => toast.error(String(msg)));
  } else if (error instanceof ZodError) {
    const errors = error.format();

    Object.keys(errors).forEach((key) => {
      const fieldError = errors[key as keyof typeof errors];
      if (
        fieldError &&
        typeof fieldError === "object" &&
        "_errors" in fieldError &&
        Array.isArray(fieldError._errors) &&
        fieldError._errors.length
      ) {
        fieldError._errors.forEach((errMsg: string) => {
          toast.error(errMsg);
        });
      }
    });
  }
}
