import { roleEnum } from "@/db/schema";
import { z } from "zod";

export const userValidation = z.object({
  name: z
    .string()
    .nonempty({ message: "Name is required" })
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(50, { message: "Name must be less than 50 characters" }),
  email: z
    .string()
    .nonempty({ message: "Email is required" })
    .trim()
    .email({ message: "Invalid email address" })
    .max(100, { message: "Email must be less than 100 characters" }),
  password: z
    .string()
    .nonempty({ message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(100, { message: "Password must be less than 100 characters" }),
});

export const createUserValidation = userValidation.extend({
  role: z.enum(roleEnum.enumValues, {
    required_error: "Role is required",
    invalid_type_error: `Role must be one of: ${roleEnum.enumValues.join(
      ", "
    )}`,
  }),
  google_map_address: z
    .string()
    .min(5, {
      message: "Address must be at least 5 characters long",
    })
    .max(255, {
      message: "Address must be less than 255 characters",
    }),
  latitude: z
    .number()
    .min(-90, { message: "Latitude must be between -90 and 90" })
    .max(90, { message: "Latitude must be between -90 and 90" }),
  longitude: z
    .number()
    .min(-180, { message: "Longitude must be between -180 and 180" })
    .max(180, { message: "Longitude must be between -180 and 180" }),
  phone: z
    .string()
    .nonempty({ message: "Phone number must not be empty" })
    .refine(
      (val) => {
        const phoneRegex = /^\+[1-9]\d{7,14}$/;
        return phoneRegex.test(val);
      },
      {
        message: "Phone number must be in a valid format (e.g., +1234567890)",
      }
    ),
  image: z
    .instanceof(File, { message: "Image must be a File" })
    .refine(
      (file) =>
        typeof file === "string" ||
        (file &&
          ["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(
            file.type
          )),
      { message: "Invalid image file type" }
    ),
});
