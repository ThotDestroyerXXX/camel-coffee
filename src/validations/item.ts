import { drinkTypeEnum, itemTypeEnum } from "@/db/schema";
import { z } from "zod";

export const itemValidation = z.object({
  name: z
    .string()
    .nonempty({ message: "Name is required" })
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(50, { message: "Name must be less than 50 characters" }),
  description: z
    .string()
    .nonempty({ message: "Description is required" })
    .trim()
    .max(300, { message: "Description must be less than 300 characters" }),
  price: z
    .number({ message: "Price is required" })
    .min(0, { message: "Price must be a greater than 0" })
    .max(1000000, { message: "Price must be less than $1.000.000" }),
  type: z.enum(itemTypeEnum.enumValues, {
    required_error: "Type is required",
    invalid_type_error: `Type must be one of: ${itemTypeEnum.enumValues.join(
      ", "
    )}`,
  }),
  drink_type: z
    .enum(drinkTypeEnum.enumValues, {
      required_error: "Drink type is required",
      invalid_type_error: `Drink type must be one of: ${drinkTypeEnum.enumValues.join(
        ", "
      )}`,
    })
    .optional(),
  image: z
    .any()
    .refine(
      (file) =>
        typeof file === "string" ||
        (typeof File !== "undefined" && file instanceof File),
      { message: "Image must be a File or a string" }
    )
    .refine(
      (file) =>
        typeof file === "string" ||
        (file &&
          ["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(
            file.type
          )),
      { message: "Invalid image file type" }
    ),
  variations: z.array(
    z.string().min(1, { message: "At least one variation is required" })
  ),
});
