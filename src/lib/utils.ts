import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { ZodError } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function ToastError(error: ZodError) {
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
      toast.error(fieldError._errors[0]);
    }
  });
}
